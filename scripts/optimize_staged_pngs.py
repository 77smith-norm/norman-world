#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Dict, List, Optional, Set

try:
    import tinify
except ImportError:
    print(
        "Missing dependency: tinify. Install it with:\n"
        "  python3 -m pip install --upgrade tinify python-dotenv",
        file=sys.stderr,
    )
    sys.exit(1)

try:
    from dotenv import load_dotenv
except ImportError:
    print(
        "Missing dependency: python-dotenv. Install it with:\n"
        "  python3 -m pip install --upgrade tinify python-dotenv",
        file=sys.stderr,
    )
    sys.exit(1)

CACHE_FILENAME = "tinify-pre-commit-cache.json"

def run_git(
    *args: str,
    cwd: Optional[Path] = None,
    check: bool = True,
    capture_output: bool = True,
    text: bool = True,
) -> subprocess.CompletedProcess:
    return subprocess.run(
        ["git", *args],
        cwd=str(cwd) if cwd else None,
        check=check,
        capture_output=capture_output,
        text=text,
    )

def get_repo_root() -> Path:
    result = run_git("rev-parse", "--show-toplevel")
    return Path(result.stdout.strip()).resolve()

def get_git_dir(repo_root: Path) -> Path:
    result = run_git("rev-parse", "--git-dir", cwd=repo_root)
    git_dir = Path(result.stdout.strip())
    if not git_dir.is_absolute():
        git_dir = (repo_root / git_dir).resolve()
    return git_dir

def load_repo_env(repo_root: Path) -> None:
    env_path = repo_root / ".env"
    if env_path.exists():
        load_dotenv(env_path)
    else:
        load_dotenv()

def get_staged_png_files(repo_root: Path) -> List[Path]:
    result = subprocess.run(
        [
            "git",
            "diff",
            "--cached",
            "--name-only",
            "--diff-filter=ACM",
            "-z",
            "--",
            "*.png",
            "*.PNG",
        ],
        cwd=str(repo_root),
        check=True,
        capture_output=True,
    )

    raw = result.stdout.decode("utf-8", errors="surrogateescape")
    rel_paths = [p for p in raw.split("\x00") if p]

    files: List[Path] = []
    for rel_path in rel_paths:
        full_path = (repo_root / rel_path).resolve()
        if full_path.is_file():
            files.append(full_path)

    return files

def has_unstaged_changes(repo_root: Path, rel_path: Path) -> bool:
    proc = subprocess.run(
        ["git", "diff", "--quiet", "--", str(rel_path)],
        cwd=str(repo_root),
        check=False,
        capture_output=True,
        text=True,
    )

    if proc.returncode == 0:
        return False
    if proc.returncode == 1:
        return True
    raise RuntimeError(f"git diff failed for {rel_path}")

def get_staged_blob_id(repo_root: Path, rel_path: Path) -> str:
    result = run_git("ls-files", "--stage", "--", str(rel_path), cwd=repo_root)
    line = result.stdout.strip()
    if not line:
        raise RuntimeError(f"Could not find staged blob for {rel_path}")

    # Format: <mode> <object> <stage>\t<path>
    parts = line.split(None, 3)
    if len(parts) < 3:
        raise RuntimeError(f"Unexpected ls-files output for {rel_path}: {line}")

    return parts[1]

def git_add(repo_root: Path, rel_path: Path) -> None:
    subprocess.run(
        ["git", "add", "--", str(rel_path)],
        cwd=str(repo_root),
        check=True,
    )

def load_cache(cache_path: Path) -> Set[str]:
    if not cache_path.exists():
        return set()

    try:
        data = json.loads(cache_path.read_text(encoding="utf-8"))
        blob_ids = data.get("optimized_blob_ids", [])
        if not isinstance(blob_ids, list):
            return set()
        return {str(x) for x in blob_ids}
    except Exception:
        return set()

def save_cache(cache_path: Path, optimized_blob_ids: Set[str]) -> None:
    cache_path.parent.mkdir(parents=True, exist_ok=True)

    payload: Dict[str, object] = {
        "version": 1,
        "optimized_blob_ids": sorted(optimized_blob_ids),
    }

    with tempfile.NamedTemporaryFile(
        mode="w",
        encoding="utf-8",
        dir=str(cache_path.parent),
        prefix=cache_path.name + ".",
        suffix=".tmp",
        delete=False,
    ) as tmp:
        json.dump(payload, tmp, indent=2, sort_keys=True)
        tmp.write("\n")
        tmp_path = Path(tmp.name)

    tmp_path.replace(cache_path)

def optimize_png_in_place(path: Path) -> tuple[int, int]:
    original_size = path.stat().st_size

    with tempfile.NamedTemporaryFile(
        prefix=path.stem + ".",
        suffix=path.suffix,
        dir=str(path.parent),
        delete=False,
    ) as tmp:
        tmp_path = Path(tmp.name)

    try:
        source = tinify.from_file(str(path))
        source.to_file(str(tmp_path))

        optimized_size = tmp_path.stat().st_size
        shutil.move(str(tmp_path), str(path))
        return original_size, optimized_size
    finally:
        if tmp_path.exists():
            try:
                tmp_path.unlink()
            except OSError:
                pass

def main() -> int:
    try:
        repo_root = get_repo_root()
    except subprocess.CalledProcessError:
        print("Not inside a Git repository.", file=sys.stderr)
        return 1

    git_dir = get_git_dir(repo_root)
    cache_path = git_dir / CACHE_FILENAME
    optimized_blob_ids = load_cache(cache_path)

    load_repo_env(repo_root)

    files = get_staged_png_files(repo_root)
    if not files:
        return 0

    files_to_optimize: List[Path] = []

    for path in files:
        rel_path = path.relative_to(repo_root)

        if has_unstaged_changes(repo_root, rel_path):
            print(
                f"Refusing to optimize {rel_path}: it has staged and unstaged changes.\n"
                "Please fully stage it (or stash the unstaged changes) and commit again.",
                file=sys.stderr,
            )
            return 1

        staged_blob_id = get_staged_blob_id(repo_root, rel_path)
        if staged_blob_id in optimized_blob_ids:
            print(f"Skipping already-optimized staged PNG: {rel_path}")
            continue

        files_to_optimize.append(path)

    if not files_to_optimize:
        return 0

    api_key = os.getenv("TINIFY_API_KEY")
    if not api_key:
        print("TINIFY_API_KEY is not set. Put it in your repo .env file.", file=sys.stderr)
        return 1

    tinify.key = api_key

    try:
        tinify.validate()
    except tinify.AccountError as e:
        print(f"Tinify account/API key error: {e}", file=sys.stderr)
        return 1
    except tinify.ConnectionError as e:
        print(f"Could not reach Tinify to validate API key: {e}", file=sys.stderr)
        return 1
    except tinify.Error as e:
        print(f"Tinify validation failed: {e}", file=sys.stderr)
        return 1

    print("Optimizing staged PNG files with Tinify...")

    for path in files_to_optimize:
        rel_path = path.relative_to(repo_root)

        try:
            original_size, optimized_size = optimize_png_in_place(path)
            git_add(repo_root, rel_path)

            new_staged_blob_id = get_staged_blob_id(repo_root, rel_path)
            optimized_blob_ids.add(new_staged_blob_id)

            delta = original_size - optimized_size
            if delta > 0:
                print(f"  optimized {rel_path} (-{delta} bytes)")
            elif delta == 0:
                print(f"  unchanged {rel_path}")
            else:
                print(f"  larger? {rel_path} (+{-delta} bytes)")
        except tinify.AccountError as e:
            print(f"Tinify account/API error for {rel_path}: {e}", file=sys.stderr)
            return 1
        except tinify.ClientError as e:
            print(f"Tinify rejected {rel_path}: {e}", file=sys.stderr)
            return 1
        except tinify.ServerError as e:
            print(f"Tinify server error for {rel_path}: {e}", file=sys.stderr)
            return 1
        except tinify.ConnectionError as e:
            print(f"Network error while optimizing {rel_path}: {e}", file=sys.stderr)
            return 1
        except subprocess.CalledProcessError as e:
            print(f"Git failed while re-staging {rel_path}: {e}", file=sys.stderr)
            return 1
        except Exception as e:
            print(f"Unexpected error for {rel_path}: {e}", file=sys.stderr)
            return 1

    save_cache(cache_path, optimized_blob_ids)
    return 0

if __name__ == "__main__":
    sys.exit(main())

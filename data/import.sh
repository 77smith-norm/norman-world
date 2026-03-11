#!/usr/bin/env bash
# Norman World Entry Importer
# Usage: ./data/import.sh [root_dir]
# Imports prompts + metadata into entries.db

ROOT="${1:-$(dirname "$0")/..}"
DB="$ROOT/data/entries.db"

sqlite3 "$DB" << 'SQL'
CREATE TABLE IF NOT EXISTS entries (
    date TEXT PRIMARY KEY,
    prompt TEXT NOT NULL,
    has_html INTEGER DEFAULT 0,
    has_image INTEGER DEFAULT 0,
    word_count INTEGER DEFAULT 0,
    imported_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE VIRTUAL TABLE IF NOT EXISTS entries_fts USING fts5(date, prompt);
SQL

imported=0
for f in "$ROOT/prompts/"*-prompt.txt; do
    fname=$(basename "$f")
    date="${fname%-prompt.txt}"
    prompt=$(cat "$f")
    has_html=0
    has_image=0
    [ -f "$ROOT/pages/$date.html" ] && has_html=1
    [ -f "$ROOT/images/$date-norm.png" ] && has_image=1
    word_count=$(echo "$prompt" | wc -w | tr -d ' ')

    sqlite3 "$DB" "
        INSERT INTO entries (date, prompt, has_html, has_image, word_count)
        VALUES ('$date', $(printf '%s' "$prompt" | python3 -c "import sys; s=sys.stdin.read(); print(\"'\" + s.replace(\"'\",\"''\") + \"'\")"), $has_html, $has_image, $word_count)
        ON CONFLICT(date) DO UPDATE SET
            prompt=excluded.prompt,
            has_html=excluded.has_html,
            has_image=excluded.has_image,
            word_count=excluded.word_count;
    "
    imported=$((imported+1))
done

echo "Imported $imported entries."
echo ""
echo "=== Entry Stats ==="
sqlite3 "$DB" "SELECT date, has_html, has_image, word_count FROM entries ORDER BY date DESC;"

#!/usr/bin/env bash
# Norman World — Useful queries against entries.db
# Usage: bash data/queries.sh [root_dir]

ROOT="${1:-$(dirname "$0")/..}"
DB="$ROOT/data/entries.db"

echo "=== Entry Count ==="
sqlite3 "$DB" "SELECT COUNT(*) || ' entries' FROM entries;"

echo ""
echo "=== Word Count Range ==="
sqlite3 "$DB" "SELECT 'min: ' || MIN(word_count) || ', max: ' || MAX(word_count) || ', avg: ' || ROUND(AVG(word_count)) FROM entries;"

echo ""
echo "=== Missing Images ==="
sqlite3 "$DB" "SELECT date FROM entries WHERE has_image=0 ORDER BY date;"

echo ""
echo "=== Missing HTML ==="
sqlite3 "$DB" "SELECT date FROM entries WHERE has_html=0 ORDER BY date;"

echo ""
echo "=== Prompts containing 'patience' ==="
sqlite3 "$DB" "SELECT date, substr(prompt,1,80) FROM entries WHERE prompt LIKE '%patience%';"

echo ""
echo "=== Prompts containing 'discipline' ==="
sqlite3 "$DB" "SELECT date, substr(prompt,1,80) FROM entries WHERE prompt LIKE '%discipline%';"

echo ""
echo "=== Month summary ==="
sqlite3 "$DB" "
SELECT 
    substr(date,1,7) as month,
    COUNT(*) as entries,
    ROUND(AVG(word_count)) as avg_words
FROM entries
GROUP BY month
ORDER BY month;
"

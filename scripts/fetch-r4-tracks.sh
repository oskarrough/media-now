#!/bin/bash
# Fetch all tracks from channels and store as JSON

CHANNELS_FILE="test-data/channels.json"
OUTPUT_FILE="test-data/r4-tracks.json"
TEMP_DIR="test-data/temp-tracks"

mkdir -p "$TEMP_DIR"

# Get all channel slugs
slugs=$(jq -r '.[].slug' "$CHANNELS_FILE")

echo "Fetching tracks from $(echo "$slugs" | wc -l) channels..."

i=0
for slug in $slugs; do
    i=$((i + 1))
    echo "[$i] Fetching: $slug"
    r4 track list --channel "$slug" --limit 2000 --format json 2>/dev/null > "$TEMP_DIR/$slug.json"
done

echo "Combining all tracks..."
jq -s 'add | if . == null then [] else . end' "$TEMP_DIR"/*.json > "$OUTPUT_FILE"

echo "Total tracks: $(jq 'length' "$OUTPUT_FILE")"

# Cleanup temp files
rm -rf "$TEMP_DIR"

echo "Done! Tracks saved to $OUTPUT_FILE"

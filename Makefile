all: clean_current_notes fetch_pub_notes format_code

clean_current_notes:
	@echo "[ Step 1 ] Deleting notes from repository ..."
	find content -mindepth 1 -not -path "content/index.md" -exec rm -rf {} + 2>/dev/null

fetch_pub_notes:
	@echo "[ Step 2 ] Fetching public notes ..."
	uv run scripts/fetch-pub-notes.py

format_code:
	@echo "[ Step 3 ] Formatting notes ..."
	uv tool run ruff format .
	npx prettier content --write

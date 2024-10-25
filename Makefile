all: clean_current_notes aux

clean_current_notes:
	@echo "[ Step 1 ] Deleting notes from repository ..."
	rm -rf content/{,.[!.],..?}*

aux:
	@echo "[ Step 2 ] Creating auxiliar 'index.md' file ..."
	touch content/index.md

fetch_pub_notes:
	@echo "[ Step 3 ] Fetching public notes ..."
	python utils/fetch-pub-notes.py

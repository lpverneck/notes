---
title: Makefile
tags:
  - completed
publish: true
---
## What is the Makefile ?

A Makefile is a specialized file used by the `make` build automation tool to manage the compilation and build process of software projects. It defines a set of rules and dependencies, allowing developers to automate the building of executable programs from source code, particularly in projects with multiple files.

## Structure

```text
target: dependencies
	command
```

- **Targets**: they represent the output artifacts.
- **Dependencies**: these are artifacts that must be already done for the target to be **executed**.
- **Commands**: these are the actions executed to create or update the target.

>[!info]
>It is not necessary for the target to be a file, it could be just a name for the command set. We call these **phony targets**.

## Example

```bash title="Makefile"
all: generate_data preprocess_data train_model clean_data

generate_data:
	@echo "Getting data ..."
	python gen_data.py

preprocess_data:
	@echo "Preprocessing data ..."
	python prep_data.py

train_model:
	@echo "Training the model ..."
	python train.py

clean_data:
	@echo "Cleaning data folder ..."
	rm -rf data/
```


```bash title="Execute the Makefile"
# run all targets
make
make all

# run specific target
make clean_data
```
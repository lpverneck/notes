---
title: Mongo DB
created: 2025-01-11
tags:
  - completed
publish: true
---
MongoDB is an open-source, non-relational database management system (DBMS) that uses a flexible document-oriented data model. It stores data in [[json|JSON]]-like documents called BSON (Binary JSON), allowing for dynamic schema design and high scalability.

## Install

- [Install Documentation](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/)

## Commands and Common Operations

```bash
# run MongoDB
brew services start mongodb-community@8.0

# stop MongoDB
brew services stop mongodb-community@8.0

# mongo shell
mongosh

# show default database
db

# show all databases
show dbs

# create or select a database
use <db_name>

# show collections
show collections

# insert one element
db.<collection>.insertOne(<JSON>)

# insert multiple elements
db.<collection>.insert(<LIST OF JSONs>)

# getting all documents
db.<collection>.find()

# getting documents
# query or query_selector is a JSON like filter
db.<collection>.find(<query>)

# update one document
df.<collection>.updateOne(<query_selector>, {$set: <JSON>)

# update many documents
df.<collection>.updateMany(<query_selector>, {$set: <JSON>)

# $currentDate operator
df.<collection>.updateOne(<query_selector>, {$set: <JSON>, $currentDate: {lastChanged: true})

# deleting documents
db.<collection>.deleteOne(<query_selector>)
db.<collection>.deleteMany(<query_selector>)
```

## Fancier Operations

```bash
db.<collection>.find({'parent_key.child_key': true, size: 'M'})

# gt: greater than
db.<collection>.find({'parent_key.child_key': {$gt: 10}})

db.<collection>.find({'parent_key.child_key': {$in: [<value1>, <value2>, <value3>]}})

db.<collection>.find({'parent_key.child_key': {$nin: [<value1>, <value2>, <value3>]}})

# lte: less than or equal
db.<collections>.find({$or: [{'parent_key.child_key': true}, {age: {$lte: 2}}]
```

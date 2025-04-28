/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u01gz4m571bnw0d")

  // remove
  collection.schema.removeField("xka109p4")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u01gz4m571bnw0d")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xka109p4",
    "name": "completed",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})

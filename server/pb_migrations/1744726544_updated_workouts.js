/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u01gz4m571bnw0d")

  // remove
  collection.schema.removeField("bblasbzd")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bxlyxkkq",
    "name": "state",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u01gz4m571bnw0d")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bblasbzd",
    "name": "completed",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("bxlyxkkq")

  return dao.saveCollection(collection)
})

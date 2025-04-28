/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pxbuwlq0uluzwm0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gdavm1gj",
    "name": "completed",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pxbuwlq0uluzwm0")

  // remove
  collection.schema.removeField("gdavm1gj")

  return dao.saveCollection(collection)
})

/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gn8v3g1b422i7ig")

  // remove
  collection.schema.removeField("red9bgg9")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "9jnuzdou",
    "name": "exercises",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gn8v3g1b422i7ig")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "red9bgg9",
    "name": "exercises",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "pxbuwlq0uluzwm0",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  // remove
  collection.schema.removeField("9jnuzdou")

  return dao.saveCollection(collection)
})

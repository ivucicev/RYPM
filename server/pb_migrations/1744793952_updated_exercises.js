/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pxbuwlq0uluzwm0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jgzbcxj3",
    "name": "workout",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "u01gz4m571bnw0d",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pxbuwlq0uluzwm0")

  // remove
  collection.schema.removeField("jgzbcxj3")

  return dao.saveCollection(collection)
})

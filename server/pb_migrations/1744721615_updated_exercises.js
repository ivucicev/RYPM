/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pxbuwlq0uluzwm0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zppkjxjj",
    "name": "sets",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "miwt2r3am6w9roy",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pxbuwlq0uluzwm0")

  // remove
  collection.schema.removeField("zppkjxjj")

  return dao.saveCollection(collection)
})

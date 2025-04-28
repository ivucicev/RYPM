/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("miwt2r3am6w9roy")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "1bgmpyft",
    "name": "exercise",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "pxbuwlq0uluzwm0",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("miwt2r3am6w9roy")

  // remove
  collection.schema.removeField("1bgmpyft")

  return dao.saveCollection(collection)
})

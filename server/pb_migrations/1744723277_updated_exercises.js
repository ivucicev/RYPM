/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pxbuwlq0uluzwm0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ieijgryl",
    "name": "user",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
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
  collection.schema.removeField("ieijgryl")

  return dao.saveCollection(collection)
})

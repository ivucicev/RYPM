/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u01gz4m571bnw0d")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ny7ozgwv",
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
  const collection = dao.findCollectionByNameOrId("u01gz4m571bnw0d")

  // remove
  collection.schema.removeField("ny7ozgwv")

  return dao.saveCollection(collection)
})

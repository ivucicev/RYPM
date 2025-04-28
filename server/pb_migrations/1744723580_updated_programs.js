/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("e0jve7y1d9cj2sl")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "v5uoyjsp",
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
  const collection = dao.findCollectionByNameOrId("e0jve7y1d9cj2sl")

  // remove
  collection.schema.removeField("v5uoyjsp")

  return dao.saveCollection(collection)
})

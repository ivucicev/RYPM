/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mmvlfwsyc19y08u")

  // remove
  collection.schema.removeField("hpnrdmav")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xqfnoifk",
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
  const collection = dao.findCollectionByNameOrId("mmvlfwsyc19y08u")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hpnrdmav",
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
  collection.schema.removeField("xqfnoifk")

  return dao.saveCollection(collection)
})

/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u01gz4m571bnw0d")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zhfmyoyr",
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u01gz4m571bnw0d")

  // remove
  collection.schema.removeField("zhfmyoyr")

  return dao.saveCollection(collection)
})

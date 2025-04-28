/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q2ebot9h3dm6uf0")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "knhrtvue",
    "name": "program",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "e0jve7y1d9cj2sl",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q2ebot9h3dm6uf0")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "knhrtvue",
    "name": "program",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "e0jve7y1d9cj2sl",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})

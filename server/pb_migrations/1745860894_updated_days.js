/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gn8v3g1b422i7ig")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fc4w7ufv",
    "name": "week",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "q2ebot9h3dm6uf0",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gn8v3g1b422i7ig")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fc4w7ufv",
    "name": "week",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "q2ebot9h3dm6uf0",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})

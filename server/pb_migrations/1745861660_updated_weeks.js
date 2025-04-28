/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q2ebot9h3dm6uf0")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yssquvme",
    "name": "days",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "gn8v3g1b422i7ig",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": null,
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
    "id": "yssquvme",
    "name": "days",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "gn8v3g1b422i7ig",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})

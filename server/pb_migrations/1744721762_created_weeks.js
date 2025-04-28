/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "q2ebot9h3dm6uf0",
    "created": "2025-04-15 12:56:02.589Z",
    "updated": "2025-04-15 12:56:02.589Z",
    "name": "weeks",
    "type": "base",
    "system": false,
    "schema": [
      {
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
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("q2ebot9h3dm6uf0");

  return dao.deleteCollection(collection);
})

/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "gn8v3g1b422i7ig",
    "created": "2025-04-15 12:55:09.941Z",
    "updated": "2025-04-15 12:55:09.941Z",
    "name": "day",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "red9bgg9",
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
  const collection = dao.findCollectionByNameOrId("gn8v3g1b422i7ig");

  return dao.deleteCollection(collection);
})

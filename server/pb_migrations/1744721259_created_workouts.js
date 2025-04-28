/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "u01gz4m571bnw0d",
    "created": "2025-04-15 12:47:39.297Z",
    "updated": "2025-04-15 12:47:39.297Z",
    "name": "workouts",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "0iu3ltsz",
        "name": "start",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "pxhgpuet",
        "name": "end",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
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
  const collection = dao.findCollectionByNameOrId("u01gz4m571bnw0d");

  return dao.deleteCollection(collection);
})

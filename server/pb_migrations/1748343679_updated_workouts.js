/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("u01gz4m571bnw0d")

  // update field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pxbuwlq0uluzwm0",
    "hidden": false,
    "id": "zhfmyoyr",
    "maxSelect": 2147483647,
    "minSelect": 0,
    "name": "exercises",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("u01gz4m571bnw0d")

  // update field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pxbuwlq0uluzwm0",
    "hidden": false,
    "id": "zhfmyoyr",
    "maxSelect": 2147483647,
    "minSelect": 0,
    "name": "exercises",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})

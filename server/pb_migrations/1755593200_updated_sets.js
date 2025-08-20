/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("miwt2r3am6w9roy")

  // update field
  collection.fields.addAt(14, new Field({
    "cascadeDelete": true,
    "collectionId": "pxbuwlq0uluzwm0",
    "hidden": false,
    "id": "1bgmpyft",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "exercise",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("miwt2r3am6w9roy")

  // update field
  collection.fields.addAt(14, new Field({
    "cascadeDelete": true,
    "collectionId": "pxbuwlq0uluzwm0",
    "hidden": false,
    "id": "1bgmpyft",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "exercise",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})

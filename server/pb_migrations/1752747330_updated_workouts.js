/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("u01gz4m571bnw0d")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number3895342900",
    "max": 10,
    "min": 1,
    "name": "effort",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2490651244",
    "max": 0,
    "min": 0,
    "name": "comment",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("u01gz4m571bnw0d")

  // remove field
  collection.fields.removeById("number3895342900")

  // remove field
  collection.fields.removeById("text2490651244")

  return app.save(collection)
})

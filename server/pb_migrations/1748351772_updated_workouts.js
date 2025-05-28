/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("u01gz4m571bnw0d")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "bool3312651334",
    "name": "isRestActive",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("u01gz4m571bnw0d")

  // remove field
  collection.fields.removeById("bool3312651334")

  return app.save(collection)
})

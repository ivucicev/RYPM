/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3507854305")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select2744374011",
    "maxSelect": 1,
    "name": "state",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "prepared",
      "sent",
      "cancelled",
      "error"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3507854305")

  // remove field
  collection.fields.removeById("select2744374011")

  return app.save(collection)
})

/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3507854305")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "date1538108716",
    "max": "",
    "min": "",
    "name": "sentAt",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number2996469915",
    "max": null,
    "min": null,
    "name": "delay",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3507854305")

  // remove field
  collection.fields.removeById("date1538108716")

  // remove field
  collection.fields.removeById("number2996469915")

  return app.save(collection)
})

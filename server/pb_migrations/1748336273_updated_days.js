/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("gn8v3g1b422i7ig")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number2155046657",
    "max": null,
    "min": null,
    "name": "index",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("gn8v3g1b422i7ig")

  // remove field
  collection.fields.removeById("number2155046657")

  return app.save(collection)
})

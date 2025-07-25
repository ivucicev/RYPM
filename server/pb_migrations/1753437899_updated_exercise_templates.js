/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2882705294")

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "bool586740212",
    "name": "isCommunity",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2882705294")

  // remove field
  collection.fields.removeById("bool586740212")

  return app.save(collection)
})

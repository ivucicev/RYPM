/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2452428166")

  // update field
  collection.fields.addAt(4, new Field({
    "exceptDomains": [],
    "hidden": false,
    "id": "email3616002756",
    "name": "to",
    "onlyDomains": [],
    "presentable": false,
    "required": false,
    "system": false,
    "type": "email"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2452428166")

  // update field
  collection.fields.addAt(4, new Field({
    "exceptDomains": [],
    "hidden": false,
    "id": "email3616002756",
    "name": "to",
    "onlyDomains": [],
    "presentable": false,
    "required": true,
    "system": false,
    "type": "email"
  }))

  return app.save(collection)
})

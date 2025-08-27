/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2452428166")

  // remove field
  collection.fields.removeById("email3616002756")

  // add field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation3616002756",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "to",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2452428166")

  // add field
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

  // remove field
  collection.fields.removeById("relation3616002756")

  return app.save(collection)
})

/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("miwt2r3am6w9roy")

  collection.listRule = "@request.auth.id != \"\" && @request.auth.id = user.id"
  collection.viewRule = "@request.auth.id != \"\" && @request.auth.id = user.id"
  collection.updateRule = "@request.auth.id != \"\" && @request.auth.id = user.id"
  collection.deleteRule = "@request.auth.id != \"\" && @request.auth.id = user.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("miwt2r3am6w9roy")

  collection.listRule = "@request.auth.id != \"\"  && @request.auth.id = user.id"
  collection.viewRule = "@request.auth.id != \"\"  && @request.auth.id = user.id"
  collection.updateRule = "@request.auth.id != \"\"  && @request.auth.id = user.id"
  collection.deleteRule = "@request.auth.id != \"\"  && @request.auth.id = user.id"

  return dao.saveCollection(collection)
})

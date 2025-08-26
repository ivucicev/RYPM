/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2452428166")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_IYX6aIyM90` ON `invites` (`code`)",
      "CREATE UNIQUE INDEX `idx_ZQQfj3SKZX` ON `invites` (\n  `to`,\n  `from`\n)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2452428166")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})

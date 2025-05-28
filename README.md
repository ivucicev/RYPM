# Angular Ionic + Pocketbase

## Client

```
.cd client
ionic serve
ionic serve --host 0.0.0.0 --port 4000 --disable-host-check
```

## Server

```
.cd server
./pocketbase serve --http 127.0.0.1:4444
```

`pb_data` - stores application data, uploaded files, etc.

`pb_migrations` - contains JS migration files with collection changes 

[See Pocketbase docs](https://pocketbase.io/docs/)

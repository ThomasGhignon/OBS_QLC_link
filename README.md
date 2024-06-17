# 🚀 Getting started with OBS QLC+ Link

## `Configuration`

### `OBS`

#### Active Websocket server
1. Go to : `Tools` &rarr; `Websocket server parameters`
2. Uncheck the box `use authentication`
3. retrieve `port` and `ip` information

Update your OBS Websocket connection parameters

```js
const obsWebSocket = new ObsController('OBS websocket ip', 'OBS websocket port')
```

### `QLC+`

#### Active Websocket server

Launch QLC+ through terminal with Web Access :

#### Mac

```bash
/Applications/QLC+.app/Contents/MacOS/qlcplus --web
```

By default, QLC+ use this address :
```js
const qlcWebSocket = new QlcController('ws://localhost:9999/qlcplusWS');
```

### `References`

Update the `scene.json` file with your OBS scenes name related to your QLC+ functions name

Example :

```json
[
  {
    "obs": "VALUE1",
    "qlc": "ENTRANCE",
    "id": 0
  },
  {
    "obs": "VALUE2",
    "qlc": "TOBLUE",
    "id": 1
  }
]
```

## `develop`

Start the app

```bash
npm run dev
```
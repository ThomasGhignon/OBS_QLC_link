import OBSWebSocket from "obs-websocket-js";
import emitter from "../event/event_emitter.js";

export default class ObsController {
    constructor(ip, port) {
        this.instance = new OBSWebSocket()
        this.ip = ip
        this.port = port
        this.init()
    }

    init() {
        this.connection().then(response => {
            console.log('OBS Websocket :: CONNECTED')
            return response
        })

        this.connectionBtn = document.querySelector('#connection-btn');
        this.connectionBtn.addEventListener('click', () => this.connection())
    }

    async connection() {
        try {
            const {
                obsWebSocketVersion,
                negotiatedRpcVersion
            } = await this.instance.connect(`ws://${this.ip}:${this.port}`);
            console.log(`Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`)

            await this.setListener()
        } catch (error) {
            console.error('Failed to connect', error.code, error.message);
        }
    }

    async setListener() {
        this.instance.on('CurrentProgramSceneChanged', this.onCurrentSceneChanged);
    }

    async getSceneList() {
        const data = await this.instance.call("GetSceneList");
        console.log(data)
    }

    onCurrentSceneChanged(event) {
        emitter.emit('sceneChanged', event)
    }
}
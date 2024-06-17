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
        this.connection()
        this.setListener()

        this.connectionBtn = document.querySelector('#connection-btn');
        this.connectionBtn.addEventListener('click', () => this.connection())

        this.scenesListBtn = document.querySelector('#obs-scene-list-btn');
        this.scenesListBtn.addEventListener('click', () => this.getSceneList(true))
    }

    async connection() {
        try {
            const {
                obsWebSocketVersion,
                negotiatedRpcVersion
            } = await this.instance.connect(`ws://${this.ip}:${this.port}`);
            console.log(`Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`)
        } catch (error) {
            console.log('Failed to connect', error.code, error.message);
        }
    }

    setListener() {
        this.instance.on('CurrentProgramSceneChanged', this.onCurrentSceneChanged);
        this.instance.on('SceneTransitionStarted', this.onSceneTransitionStarted);
    }

    async getSceneList(log) {
        const data = await this.instance.call("GetSceneList");
        if(log) console.log(data)
        return data
    }

    onCurrentSceneChanged(event) {
        console.log('Scene : ' + event.sceneName)
        emitter.emit('sceneChanged', event)
    }
    onSceneTransitionStarted(event) {
        console.log('Transition : ' + event.transitionName)
        emitter.emit('transitionStarted', event)
    }
}
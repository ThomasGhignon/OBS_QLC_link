import emitter from "../event/event_emitter.js";
import Scene from "../enum/scene.js";

export default class QlcController {
    constructor(url) {
        this.url = url;
        this.instance = null;
        this.awaiters = {}

        this.init()
    }

    init() {
        this.connection()
        this.setListener()

        this.functionsListBtn = document.querySelector('#functions-list-btn');
        this.functionsListBtn.addEventListener('click', () => this.getFunctionsList(true))
    }

    async connection() {
        try {
            this.instance = new WebSocket(this.url);

            this.instance.onopen = this.onOpen.bind(this);
            this.instance.onmessage = this.onMessage.bind(this);
            this.instance.onclose = this.onClose.bind(this);
            this.instance.onerror = this.onError.bind(this);
        } catch (error) {
            console.log('WebSocket initialization error:', error);
        }
    }

    setListener() {
        emitter.on('sceneChanged', (scene) => {
            this.switchScene(scene)
        })
        emitter.on('transitionStarted', () => {
            this.disableAllScenes()
        })
    }

    onOpen(event) {
        console.log('WebSocket connection opened:', event);
        this.sendCommand({ "command": "getFunctionsList" });
    }

    onClose(event) {
        console.log('WebSocket connection closed:', event);
    }

    onError(error) {
        console.error('WebSocket error:', error);
    }

    onMessage(event) {
        const parts = event.data.split('|');
        const command = parts[1];

        if (command && this.awaiters[command]) {
            this.awaiters[command].resolve(parts);
            delete this.awaiters[command];
        }
    }

    sendCommand(command, params) {
        return new Promise((resolve, reject) => {
            if (this.instance && this.instance.readyState === WebSocket.OPEN) {
                this.awaiters[command] = { resolve, reject };
                let paramValues = params !== undefined ? Object.values(params).join('|') : ''
                this.instance.send("QLC+API|" + command + "|" + paramValues);
            } else {
                reject('WebSocket is not open. Unable to send command:', command);
            }
        });
    }

    getFunctionsList(log) {
        this.sendCommand('getFunctionsList').then(response => {
            const result = {};
            for (let i = 2; i < response.length; i += 2) {
                result[response[i + 1]] = response[i];
            }

            if (log) console.log(result)

            return result;
        }).catch(error => {
            console.error('getFunctionsList error:', error);
        });
    }

    switchScene(scene) {
        console.log(scene)
        try {
            const sceneInfo = Scene[scene.sceneUuid]
            if (!sceneInfo) throw new Error('sceneInfo not found')
            this.disableAllScenes(sceneInfo.id)
            this.sendCommand('setFunctionStatus', { id: sceneInfo.id, status: 1 }).then(response => {
                return response;
            })
        } catch (error) {
            console.error('switchScene error:', error);
        }
    }

    disableAllScenes(exception) {
        try {
            const sceneValues = Object.values(Scene);
            for (const scene of sceneValues) {
                if (exception && exception === scene.id) continue
                this.sendCommand('setFunctionStatus', { id: scene.id, status: 0 }).then(response => {
                    console.log('switchScene response:', response);
                })
            }
        } catch (error) {
            console.error('disableAllScenes error:', error);
        }
    }
}
import '../style.css'
import ObsController from "./controller/obs_controller.js";
import QlcController from "./controller/qlc_controller.js";

const obsWebSocket = new ObsController('192.168.4.134', '4455')
const qlcWebSocket = new QlcController('ws://localhost:9999/qlcplusWS');
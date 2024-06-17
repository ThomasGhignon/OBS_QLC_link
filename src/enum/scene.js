import data from '../data/scene.json'

const Scene = {};
data.forEach((scene, index) => {
    Scene[`${scene.obs_id}`] = {
        id: scene.qlc_id
    };
});

Object.freeze(Scene);

export default Scene;

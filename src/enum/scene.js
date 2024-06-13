import data from '../data/scene.json'

const Scene = {};
data.forEach((scene, index) => {
    Scene[`${scene.obs}`] = {
        qlc: scene.qlc,
        id: scene.id
    };
});

Object.freeze(Scene);

export default Scene;

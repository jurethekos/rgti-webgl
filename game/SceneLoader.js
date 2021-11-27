export class SceneLoader {

    async loadScene(uri) {
        const scene = await this.loadJson(uri);

        //random začetna pozicija
        let pozicija = Math.random() * (4 - 0) + 0;
        pozicija = Math.round(pozicija);
        const x = [0, 0, 0, 0, 0];
        const z = [0, 0, 0, 0, 0];

        scene.nodes[0].translation[0] = x[pozicija];
        scene.nodes[0].translation[2] = z[pozicija];

        //random začetna pozicija
        let pozicijaCilja = Math.random() * (4 - 0) + 0;
        pozicijaCilja = Math.round(pozicijaCilja);
        const xCilja = [5, 5, 5, 5, 5];
        const zCilja = [1, 5, 8, 10, 12];

        scene.nodes[1].translation[0] = xCilja[pozicijaCilja];
        scene.nodes[1].translation[2] = zCilja[pozicijaCilja];


        const images = scene.textures.map(uri => this.loadImage(uri));
        const meshes = scene.meshes.map(uri => this.loadJson(uri));
        scene.textures = await Promise.all(images);
        scene.meshes = await Promise.all(meshes);

        return scene;
    }

    loadImage(uri) {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', reject);
            image.src = uri;
        });
    }

    loadJson(uri) {
        return fetch(uri).then(response => response.json());
    }

}

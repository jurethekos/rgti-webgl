import { Mesh } from './Mesh.js';

import { Node } from './Node.js';
import { Model } from './Model.js';
import { Camera } from './Camera.js';

import { Scene } from './Scene.js';

export class SceneBuilder {

    constructor(spec) {
        this.spec = spec;
    }

    createNode(spec) {
        switch (spec.type) {
            case 'camera': return new Camera(spec);
            case 'model': {
                //console.log(spec);
                if (spec.collectable == true){
                    const collectable = true;
                    const mesh = new Mesh(this.spec.meshes[spec.mesh]);
                    const texture = this.spec.textures[spec.texture];
                    return new Model(mesh, texture, spec, collectable);
                } else{
                    const collectable = false;
                    const mesh = new Mesh(this.spec.meshes[spec.mesh]);
                    const texture = this.spec.textures[spec.texture];
                    return new Model(mesh, texture, spec, collectable);
                }
            }
            default: return new Node(spec);
        }
    }

    build() {
        let scene = new Scene();
        this.spec.nodes.forEach(spec => scene.addNode(this.createNode(spec)));
        return scene;
    }

}

import { Node } from './Node.js';

export class Model extends Node {

    constructor(mesh, image, options, collectable, info) {
        super(options);
        this.mesh = mesh;
        this.image = image;
        this.collectable = collectable;
        this.info = info;
        this.movement = 0;
        this.movementUp = true;
    }

}

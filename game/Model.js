import { Node } from './Node.js';

export class Model extends Node {

    constructor(mesh, image, options, collectable) {
        super(options);
        this.mesh = mesh;
        this.image = image;
        this.collectable = collectable;
    }

}

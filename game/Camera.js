import { vec3, mat4 } from '../lib/gl-matrix-module.js';

import { Utils } from './Utils.js';
import { Node } from './Node.js';

export class Camera extends Node {

    constructor(options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);
        localStorage.setItem('soundTimer', 0);
        this.projection = mat4.create();
        this.updateProjection();

        this.mousemoveHandler = this.mousemoveHandler.bind(this);
        this.keydownHandler = this.keydownHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);
        this.keys = {};
        this.spacePressed = false;
    }

    updateProjection() {
        mat4.perspective(this.projection, this.fov, this.aspect, this.near, this.far);
    }

    update(dt) { //dt = potekli čas od prejšnjega updejta
        const c = this;

        const forward = vec3.set(vec3.create(),
            -Math.sin(c.rotation[1]), 0, -Math.cos(c.rotation[1]));
        const right = vec3.set(vec3.create(),
            Math.cos(c.rotation[1]), 0, -Math.sin(c.rotation[1]));

        // 1: add movement acceleration
        let acc = vec3.create();
        if (this.keys['KeyW']) {
            vec3.add(acc, acc, forward); //acc = acc - forward
        }
        if (this.keys['KeyS']) {
            vec3.sub(acc, acc, forward);
        }
        if (this.keys['KeyD']) {
            vec3.add(acc, acc, right);
        }
        if (this.keys['KeyA']) {
            vec3.sub(acc, acc, right);
        }
        if (this.keys['KeyB']) {
            var audio = new Audio("../common/sounds/bruh.mp3");
            audio.play();
        }

        // 2: update velocity
        vec3.scaleAndAdd(c.velocity, c.velocity, acc, dt * c.acceleration);

        // 3: if no movement, apply friction
        if (!this.keys['KeyW'] &&
            !this.keys['KeyS'] &&
            !this.keys['KeyD'] &&
            !this.keys['KeyA'])
        {
            vec3.scale(c.velocity, c.velocity, 1 - c.friction);
        }

        // 4: limit speed
        const len = vec3.len(c.velocity);
        //console.log(len);
        if (len > c.maxSpeed) {
            vec3.scale(c.velocity, c.velocity, c.maxSpeed / len);
        }
    }

    enable() {
        document.addEventListener('mousemove', this.mousemoveHandler);
        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup', this.keyupHandler);
    }

    disable() {
        document.removeEventListener('mousemove', this.mousemoveHandler);
        document.removeEventListener('keydown', this.keydownHandler);
        document.removeEventListener('keyup', this.keyupHandler);

        for (let key in this.keys) {
            this.keys[key] = false;
        }
    }

    mousemoveHandler(e) {
        const dx = e.movementX;
        const dy = e.movementY;
        const c = this;

        c.rotation[0] -= dy * c.mouseSensitivity;
        c.rotation[1] -= dx * c.mouseSensitivity;

        const pi = Math.PI;
        const twopi = pi * 2;
        const halfpi = pi / 2;

        if (c.rotation[0] > halfpi) {
            c.rotation[0] = halfpi;
        }
        if (c.rotation[0] < -halfpi) {
            c.rotation[0] = -halfpi;
        }

        c.rotation[1] = ((c.rotation[1] % twopi) + twopi) % twopi;
    }

    keydownHandler(e) {
        this.keys[e.code] = true;
    }

    keyupHandler(e) {
        this.keys[e.code] = false;
    }

    async speedup() {
        //registered collision with speedup collectable
        //console.log("speedup");
        const c = this;
        c.maxSpeed = 14;
        await new Promise(resolve => setTimeout(resolve, 5000));
        c.maxSpeed = 8;
    }

    async slowdown() {
        //registered collision with speedup collectable
        //console.log("speedup");
        const c = this;
        c.maxSpeed = 4;
        await new Promise(resolve => setTimeout(resolve, 3000));
        c.maxSpeed = 8;
        
    }

    timereduction(){
        //registered collision with speedup collectable
        console.log("timereduction");
    
    }

    async sound() {
        //registered collision with speedup collectable
        //console.log("speedup");
        if(localStorage.getItem('soundTimer') == "0"){
            var audio = new Audio("../common/sounds/roblox-death-sound-effect.mp3");
            audio.play();
            localStorage.setItem('soundTimer', 1);
            await new Promise(resolve => setTimeout(resolve, 400));
            localStorage.setItem('soundTimer', 0);
        }

    }
    async finish(time) {
        await new Promise(resolve => setTimeout(resolve, 100));
        alert(time);
        window.history.back();
    }
    async grassSound() {
        if(localStorage.getItem('soundTimer') == "0"){
            var audio = new Audio("../common/sounds/grass.mp3");
            audio.play();
            localStorage.setItem('soundTimer', 1);
            await new Promise(resolve => setTimeout(resolve, 3000));
            localStorage.setItem('soundTimer', 0);
        }
    }

}

Camera.defaults = {
    aspect           : 1,
    fov              : 1.5,
    near             : 0.01,
    far              : 100,
    velocity         : [0, 0, 0],
    mouseSensitivity : 0.002,
    maxSpeed         : 8,
    friction         : 0.2,
    acceleration     : 20
};

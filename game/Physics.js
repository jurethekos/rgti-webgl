import { vec3, mat4 } from '../lib/gl-matrix-module.js';
import { Camera } from './Camera.js';

export class Physics {

    constructor(scene) {
        this.scene = scene;
    }

    update(dt) {
        this.scene.traverse(node => {
            if (node.velocity) {
                vec3.scaleAndAdd(node.translation, node.translation, node.velocity, dt);
                node.updateTransform();
                this.scene.traverse(other => {
                    if (node !== other) {
                        this.resolveCollision(node, other);
                    }
                });
            }
        });
    }

    intervalIntersection(min1, max1, min2, max2) {
        return !(min1 > max2 || min2 > max1);
    }

    aabbIntersection(aabb1, aabb2) {
        return this.intervalIntersection(aabb1.min[0], aabb1.max[0], aabb2.min[0], aabb2.max[0])
            && this.intervalIntersection(aabb1.min[1], aabb1.max[1], aabb2.min[1], aabb2.max[1])
            && this.intervalIntersection(aabb1.min[2], aabb1.max[2], aabb2.min[2], aabb2.max[2]);
    }

    resolveCollision(a, b) {
        //console.log(localStorage.getItem('gameStartTime'));
        //console.log(b.info);
        // Update bounding boxes with global translation.

        if(b.collectable && b.info != "grass"){
            //console.log(b.movement);
            if (b.movementUp){
                b.movement += 0.001;
                if(b.movement > 0.02){
                    b.movementUp = false;
                }
                
            } else{
                b.movement -= 0.001;
                if(b.movement < -0.02){
                    b.movementUp = true;
                }
            }
            vec3.add(b.translation, b.translation, [0, b.movement, 0]);
            b.updateTransform();
        }

        const ta = a.getGlobalTransform();
        const tb = b.getGlobalTransform();

        const posa = mat4.getTranslation(vec3.create(), ta);
        const posb = mat4.getTranslation(vec3.create(), tb);

        const mina = vec3.add(vec3.create(), posa, a.aabb.min);
        const maxa = vec3.add(vec3.create(), posa, a.aabb.max);
        const minb = vec3.add(vec3.create(), posb, b.aabb.min);
        const maxb = vec3.add(vec3.create(), posb, b.aabb.max);

        //console.log(posa[1]);
        // Check if there is collision.
        const isColliding = this.aabbIntersection({
            min: mina,
            max: maxa
        }, {
            min: minb,
            max: maxb
        });

        if(isColliding){
            //console.log("colliding");
        };
        if(isColliding && posa[1] == 3){
            a.setOnTop(true);
            a.onTopOf = b;
            //console.log("colliding");
            //console.log(posa[1]);
            //vec3.set(a.translation, a.translation[0], 3, a.translation[2]);
            return;
        };
        if(!isColliding && posa[1] == 3 && a.onTop && a.onTopOf == b){
            a.setOnTop(false);
            //console.log("NOTcolliding");
            //a.enableFalling();
            return;
        };
        
        if (!isColliding) {
            return;
        }
        //console.log(posa);
        
        // Move node A minimally to avoid collision.

        //preveri če je collision s collectablom
        //FINISH
        if(b.collectable == true && b.info == "finish"){
            console.log(b);
            //b.translation[1] = -10;
            let dir = [0, -10, 0]
            vec3.add(b.translation, b.translation, dir);
            b.updateTransform();
            var gameEndTime = (Date.now() - localStorage.getItem('gameStartTime'))/1000 - localStorage.getItem('gameReductedTime');
            localStorage.setItem('gameReductedTime', '00');

            localStorage.setItem('gameEndTime', gameEndTime); //DA LAHKO IZPIŠEMO ČAS NA ENDGAME.HTML
            console.log(gameEndTime);

            a.finish(gameEndTime);

            //window.history.back();
            window.location.replace("../endgame.html?" + gameEndTime);
            return;
        }
        //SPEEDUP
        if(b.collectable == true && b.info == "speedup"){
            console.log(b);
            //b.translation[1] = -10;
            let dir = [0, -10, 0]
            vec3.add(b.translation, b.translation, dir);
            b.updateTransform();
            a.speedup();
            var audio = new Audio("../common/sounds/smb_powerup.wav");
            audio.play();
            return;
        }
        //TIMEREDUCTION
        if(b.collectable == true && b.info == "timereduction"){
            console.log(b);
            //b.translation[1] = -10;
            let spremenljivka = localStorage.getItem('gameReductedTime');
            if (spremenljivka === "00"){
                spremenljivka = "05";
            }
            else if(spremenljivka === "05"){
                spremenljivka = "10";
            }
            
            let dir = [0, -10, 0]
            vec3.add(b.translation, b.translation, dir);
            b.updateTransform();
            console.log(spremenljivka);
            localStorage.setItem('gameReductedTime', spremenljivka);
            var audio = new Audio("../common/sounds/smb_powerup.wav");
            audio.play();
            return;
        }
        //GRASS
        if(b.collectable == true && b.info == "grass"){
            console.log(b);
            a.slowdown();
            //var audio = new Audio("../common/sounds/smb_powerup.wav");
            //audio.play();
            a.grassSound();
            return;
        }

        a.sound();

        const diffa = vec3.sub(vec3.create(), maxb, mina);
        const diffb = vec3.sub(vec3.create(), maxa, minb);

        let minDiff = Infinity;
        let minDirection = [0, 0, 0];
        if (diffa[0] >= 0 && diffa[0] < minDiff) {
            minDiff = diffa[0];
            minDirection = [minDiff, 0, 0];
        }
        if (diffa[1] >= 0 && diffa[1] < minDiff) {
            minDiff = diffa[1];
            minDirection = [0, minDiff, 0];
        }
        if (diffa[2] >= 0 && diffa[2] < minDiff) {
            minDiff = diffa[2];
            minDirection = [0, 0, minDiff];
        }
        if (diffb[0] >= 0 && diffb[0] < minDiff) {
            minDiff = diffb[0];
            minDirection = [-minDiff, 0, 0];
        }
        if (diffb[1] >= 0 && diffb[1] < minDiff) {
            minDiff = diffb[1];
            minDirection = [0, -minDiff, 0];
        }
        if (diffb[2] >= 0 && diffb[2] < minDiff) {
            minDiff = diffb[2];
            minDirection = [0, 0, -minDiff];
        }

        vec3.add(a.translation, a.translation, minDirection);
        a.updateTransform();
    }

}

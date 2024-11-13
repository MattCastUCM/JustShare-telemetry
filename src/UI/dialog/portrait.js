export default class Portrait {
    /**
    * Clase para un personaje y su retrato 
    * @param {Phaser.Scene} scene - escena a la que pertenece
    * @param {String} key - id de la imagen
    * @param {Object} trans - posicion y escala del personaje
    */
    constructor(scene, key, trans) {
        this.scene = scene;
        this.img = scene.add.image(0, 0, key)
        this.img.setPosition(trans.x, trans.y);
        this.img.setScale(trans.scale);

        this.animEase = 'linear';
        this.scale = trans.scale;
        this.deactiveScale = this.scale * 0.8;

        this.noTint = Phaser.Display.Color.HexStringToColor('#ffffff');
        this.deactiveTint = Phaser.Display.Color.HexStringToColor('#454545');

        this.key = key;
        this.activate(false)
    }
    
    getKey() { return this.key; }
    
    activate(active, duration, onComplete) {
        if (!duration) duration = 0;

        let anim = null;
        
        if (active) {
            this.img.alpha = 0;

            // Hace la animacion de fade out para todos los objetos
            anim = this.scene.tweens.add({
                targets: this.img,
                alpha: { from: 0, to: 1 },
                ease: this.animEase,
                duration: duration,
                repeat: 0,
            });
        }
        else {
            this.img.alpha = 1;

            // Hace la animacion de fade out para todos los objetos
            anim = this.scene.tweens.add({
                targets: this.img,
                alpha: { from: 1, to: 0 },
                ease: this.animEase,
                duration: duration,
                repeat: 0,
            });
        }

        if (onComplete !== null && typeof onComplete === 'function') {
            anim.on('complete', () => {
                onComplete();
            });

        }
    }

    setTalking(talking, duration, onComplete) {
        if (!duration) duration = 0;

        let anim = null;
        
        if (talking) {
            // Hace la animacion de iluminarse
            anim = this.scene.tweens.add({
                targets: this.img,
                ease: this.animEase,
                duration: duration,
                scale: this.scale,
                repeat: 0,
            });

            // Para el fade de colores
            this.scene.tweens.addCounter({
                targets: [this.box],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(this.deactiveTint, this.noTint, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    this.img.setTint(colInt);
                },
                repeat: 0,
                repeat: 0,
                duration: duration
            });
        }
        else {
            // Hace la animacion de oscurecerse
            anim = this.scene.tweens.add({
                targets: this.img,
                ease: this.animEase,
                duration: duration,
                scale: this.deactiveScale,
                repeat: 0,
            });

            // Para el fade de colores
            this.scene.tweens.addCounter({
                targets: [this.box],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(this.noTint, this.deactiveTint, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    this.img.setTint(colInt);
                },
                repeat: 0,
                duration: duration
            });
        }

        if (onComplete !== null && typeof onComplete === 'function') {
            anim.on('complete', () => {
                onComplete();
            });

        }
    }

    setDepth(depth) {
        this.img.setDepth(depth);
    }
}
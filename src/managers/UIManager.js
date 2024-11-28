import GameManager from "./gameManager.js";
import DialogManager from "./dialogManager.js";
import PhoneManager from "./PhoneManager.js";

 export default class UIManager extends Phaser.Scene {
    /**
    * Gestor de la interfaz. Contiene el PhoneManager y el DialogManager.
    * Tambien se encarga de la creacion de textos
    * @extends Phaser.Scene
    */
    constructor(scene) {
        super({ key: 'UIManager' });
    }

    create() {
        this.CANVAS_WIDTH = this.sys.game.canvas.width
        this.CANVAS_HEIGHT = this.sys.game.canvas.height;

        this.gameManager = GameManager.getInstance();
        this.dialogManager = new DialogManager(this);
        this.phoneManager = new PhoneManager(this);

        // Crea los parpados para la animacion de abrir y cerrar los ojos
        this.topLid = this.add.rectangle(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT / 2, 0x000, 1).setOrigin(0, 0);
        this.topLid.setDepth(100).setScrollFactor(0);
        this.botLid = this.add.rectangle(0, this.CANVAS_HEIGHT / 2, this.CANVAS_WIDTH, this.CANVAS_HEIGHT / 2, 0x000, 1).setOrigin(0, 0);
        this.botLid.setDepth(100).setScrollFactor(0);

        this.activateLids(false);
    }

    // Animacion de abrir los ojos
    openEyes() {
        this.activateLids(true);
        let speed = 1000;
        let lastTopPos = this.topLid.y;
        let lastBotPos = this.botLid.y;
        let movement = this.topLid.displayHeight / 4;

        // Abre los ojos
        let anim = this.tweens.add({
            targets: [this.topLid],
            y: { from: lastTopPos, to: lastTopPos - movement },
            duration: speed,
            repeat: 0,
        });
        this.tweens.add({
            targets: [this.botLid],
            y: { from: lastBotPos, to: lastBotPos + movement },
            duration: speed,
            repeat: 0,
        });

        // Cierra un poco los ojos
        anim.on('complete', () => {
            speed = 500
            lastTopPos = this.topLid.y;
            lastBotPos = this.botLid.y;
            movement = this.topLid.displayHeight / 10;

            anim = this.tweens.add({
                targets: [this.topLid],
                y: { from: lastTopPos, to: lastTopPos + movement },
                duration: speed,
                repeat: 0,
            });
            this.tweens.add({
                targets: [this.botLid],
                y: { from: lastBotPos, to: lastBotPos - movement },
                duration: speed,
                repeat: 0,
            });

            // Vuelve a abrir los ojos
            anim.on('complete', () => {
                speed = 500
                lastTopPos = this.topLid.y;
                lastBotPos = this.botLid.y;
                movement = this.topLid.displayHeight / 9;

                anim = this.tweens.add({
                    targets: [this.topLid],
                    y: { from: lastTopPos, to: lastTopPos - movement },
                    duration: speed,
                    repeat: 0,
                });
                this.tweens.add({
                    targets: [this.botLid],
                    y: { from: lastBotPos, to: lastBotPos + movement },
                    duration: speed,
                    repeat: 0,
                });

                // Cierra los ojos un poco mas
                anim.on('complete', () => {
                    speed = 500
                    lastTopPos = this.topLid.y;
                    lastBotPos = this.botLid.y;
                    movement = this.topLid.displayHeight / 5;

                    anim = this.tweens.add({
                        targets: [this.topLid],
                        y: { from: lastTopPos, to: lastTopPos + movement },
                        duration: speed,
                        repeat: 0,
                    });
                    this.tweens.add({
                        targets: [this.botLid],
                        y: { from: lastBotPos, to: lastBotPos - movement },
                        duration: speed,
                        repeat: 0,
                    });

                    // Abre los ojos completamente
                    anim.on('complete', () => {
                        speed = 1500
                        lastTopPos = this.topLid.y;
                        lastBotPos = this.botLid.y;

                        anim = this.tweens.add({
                            targets: [this.topLid],
                            y: { from: lastTopPos, to: -this.CANVAS_HEIGHT / 2 },
                            duration: speed,
                            repeat: 0,
                        });
                        this.tweens.add({
                            targets: [this.botLid],
                            y: { from: lastBotPos, to: this.CANVAS_HEIGHT },
                            duration: speed,
                            repeat: 0,
                        });
                    });
                });
            });
        });
    }

    // Animacion de cerrar los ojos. Cierra los parpados y 
    // vuelve a reproducir la animacion de abrir los ojos
    closeEyes(onComplete) {
        this.activateLids(true);
        let speed = 2000;
        let lastTopPos = this.topLid.y;
        let lastBotPos = this.botLid.y;
        
        this.tweens.add({
            targets: [this.topLid],
            y: { from: lastTopPos, to: 0 },
            duration: speed,
            repeat: 0,
        });
        this.tweens.add({
            targets: [this.botLid],
            y: { from: lastBotPos, to: this.CANVAS_HEIGHT / 2 },
            duration: speed,
            repeat: 0,
        });
        
        if (onComplete !== null && typeof onComplete === 'function') {
            onComplete();
        }
    }

    activateLids(active) {
        this.topLid.visible = active;
        this.botLid.visible = active;
    }
}
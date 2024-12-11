import GameManager from '../managers/gameManager.js'
import Button from '../UI/button.js'

export default class ComputerBaseScene extends Phaser.Scene {
    /**
     * Pantalla principal
     * @extends Phaser.Scene
     */
    constructor(key, namespace, powerOnClick) {
        super({ key: key });

        this.namespace = namespace
        this.powerOnClick = powerOnClick
    }
    
    create() {
        this.CANVAS_WIDTH = this.sys.game.canvas.width;
        this.CANVAS_HEIGHT = this.sys.game.canvas.height;

        this.gameManager = GameManager.getInstance();
        this.i18next = this.gameManager.i18next;
        
        this.textConfig = { ...this.gameManager.textConfig };
        this.textConfig.fontFamily = 'corpid-black'
        this.textConfig.color = '#000000'

        // Fondo escalado en cuanto al canvas
        let bg = this.add.image(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, 'loginScreen');
        let scale = this.CANVAS_WIDTH / bg.width;
        bg.setScale(scale);

        this.createPowerIcon(this.powerOnClick);
    }

    createButton(x, y, textId, scale, onClick) {
        let translation = this.i18next.t(textId, { ns: this.namespace });

        let button = new Button(this, x, y, scale, onClick,
            this.gameManager.textBox.fill.name, 
            { R: 255, G: 255, B: 255 }, { R: 200, G: 200, B: 200 }, { R: 150, G: 150, B: 150 },
            translation, 
            { font: this.textConfig.fontFamily, size: 54, style: this.textConfig.fontStyle, color: this.textConfig.color }, 
            this.gameManager.textBox.border.name,
            {
                // La textura generada con el objeto grafico es un pelin mas grande que el dibujo en si. Por lo tanto,
                // si la caja de colision por defecto es un pelin mas grande. Es por eso que se pasa una que se ajuste
                // a las medidas reales
                area: new Phaser.Geom.Rectangle(this.gameManager.textBox.offset, this.gameManager.textBox.offset, this.gameManager.textBox.width, this.gameManager.textBox.height),
                callback: Phaser.Geom.Rectangle.Contains
            }
        );

        return button
    }

    createPowerIcon(onClick) {
        const POS_X = 265;
        const POS_Y = 760;
        const SCALE = 0.13;
        const SCALE_MULTIPLIER = 1.2;

        let powerIcon = this.add.image(POS_X, POS_Y, 'powerIcon');
        powerIcon.setInteractive({ useHandCursor: true });
        powerIcon.setScale(SCALE)
        powerIcon.setTintFill(0xffffff);

        let originalScale = powerIcon.scale

        powerIcon.on('pointerover', () => {
            this.tweens.add({
                targets: powerIcon,
                scale: originalScale * SCALE_MULTIPLIER,
                duration: 0,
                repeat: 0,
            });
            }
        );

        powerIcon.on('pointerout', () => {
            this.tweens.add({
                targets: powerIcon,
                scale: originalScale,
                duration: 0,
                repeat: 0,
            });

        });

        powerIcon.on('pointerdown', () => {
            let anim = this.tweens.add({
                targets: powerIcon,
                scale: originalScale,
                duration: 20,
                repeat: 0,
                yoyo: true
            });

            anim.on('complete', () => {
                if(onClick !== null && typeof onClick === "function")
                onClick()
            });
        });
    }
}
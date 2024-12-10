import GameManager from '../managers/gameManager.js'
import Button from '../UI/button.js'

export default class TitleScene extends Phaser.Scene {
    /**
     * Pantalla principal
     * @extends Phaser.Scene
     */
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        const CANVAS_WIDTH = this.sys.game.canvas.width;
        const CANVAS_HEIGHT = this.sys.game.canvas.height;

        this.gameManager = GameManager.getInstance();
        this.i18next = this.gameManager.i18next;
        this.namespace = 'titleScene';

        const BUTTON_HEIGHT = this.gameManager.textBox.height
        const BUTTON_OFFSET = 60
        this.BUTTON_SCALE = 0.9

        // Fondo escalado en cuanto al canvas
        let bg = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'loginScreen');
        let scale = CANVAS_WIDTH / bg.width;
        bg.setScale(scale);

        let playButton = this.createButton(CANVAS_WIDTH / 3, 2 * CANVAS_HEIGHT / 5, "Jugar", () => {
            this.gameManager.startTestScene();
        });

        let creditsButton = this.createButton(playButton.x, playButton.y + BUTTON_HEIGHT + BUTTON_OFFSET, "Créditos", () => {

        });
    }

    createButton(x, y, textId, fn) {
        let translation = this.gameManager.translate(textId, { ns: this.namespace });

        let button = new Button(this, x, y, this.BUTTON_SCALE, fn,
            this.gameManager.textBox.fillName, { R: 255, G: 255, B: 255 }, { R: 200, G: 200, B: 200 }, { R: 150, G: 150, B: 150 },
            translation, { font: 'corpid', size: 54, style: 'bold', color: '#000000' }, this.gameManager.textBox.edgeName,
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
}
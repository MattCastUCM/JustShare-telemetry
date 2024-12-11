import ComputerBaseScene from './computerBaseScene.js';

export default class TitleScene extends ComputerBaseScene {
    /**
     * Pantalla principal
     * @extends Phaser.Scene
     */
    constructor() {
        super("TitleScene", "titleScene", null)
    }
    
    create() {
        super.create()
        
        const BUTTON_SCALE = 0.9
        const BUTTON_HEIGHT = this.gameManager.textBox.height * BUTTON_SCALE
        const BUTTON_OFFSET = 60

        let playButton = this.createButton(this.CANVAS_WIDTH / 3, 3 * this.CANVAS_HEIGHT / 7, "playButton", BUTTON_SCALE, () => {
            this.gameManager.startTestScene();
        });

        let creditsButton = this.createButton(playButton.x, playButton.y + BUTTON_HEIGHT + BUTTON_OFFSET, 
            "creditsButton", BUTTON_SCALE, () => {

        });
    }
}
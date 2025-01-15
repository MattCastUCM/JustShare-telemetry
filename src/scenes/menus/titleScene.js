import ComputerBaseScene from '../../computer/computerBaseScene.js';

export default class TitleScene extends ComputerBaseScene {
    constructor() {
        super("TitleScene")
    }
    
    create(params) {
        super.create(params)
        
        const BUTTON_SCALE = 0.8
        const BUTTON_OFFSET_Y = 70

        this.createBackground('titleScreen')
        this.setNamespace('menus/titleScene')

       let playButton = this.createButton(this.CANVAS_WIDTH / 2.9, 3.1 * this.CANVAS_HEIGHT / 7, "playButton", () => {
            this.gameManager.changeScene("LoginScene")
        }, BUTTON_SCALE);

        this.createButton(playButton.x, playButton.y + playButton.height + BUTTON_OFFSET_Y, 
            "creditsButton", BUTTON_SCALE, () => {
        }, BUTTON_SCALE);
    }
}
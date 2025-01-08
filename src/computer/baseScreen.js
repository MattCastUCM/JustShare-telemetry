export default class BaseScreen extends Phaser.GameObjects.Container {
    constructor(scene, screenName) {
        super(scene, 0, 0)

        this.scene.add.existing(this)
        this.scene.setBackground(screenName)

        this.CANVAS_WIDTH = this.scene.CANVAS_WIDTH;
        this.CANVAS_HEIGHT = this.scene.CANVAS_HEIGHT;

        this.screenName = screenName
        this.username = this.scene.username
    }

    translate(transId, options) {
        return this.scene.translate(transId, options)
        // return this.scene.translate(this.screenName + '.' + transId, options)
    }

    reset() {
        
    }
}
export default class BaseScreen extends Phaser.GameObjects.Container {
    constructor(scene, screenName) {
        super(scene, 0, 0)

        this.scene.add.existing(this)

        this.NAMESPACE_PREFIX = 'computer/'

        this.scene.setNamespace(this.NAMESPACE_PREFIX + screenName)
        
        this.CANVAS_WIDTH = this.scene.CANVAS_WIDTH;
        this.CANVAS_HEIGHT = this.scene.CANVAS_HEIGHT;
        
        this.dialogManager = this.scene.dialogManager;
        this.username = this.scene.username

        let bg = this.scene.createBackground(screenName)
        this.add(bg)
    }

    reset() {
        
    }
}
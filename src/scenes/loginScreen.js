export default class LoginScreen extends Phaser.GameObjects.Group {
    constructor(scene) {
        super(scene);

        const SCALE = 0.9;

        let nameInput = this.scene.createInputBox(this.scene.CANVAS_WIDTH / 3, 3 * this.scene.CANVAS_HEIGHT / 7, 
            "Nombre", SCALE, true)
        nameInput.textInput.addText(this.scene.gameManager.userInfo.name);
        this.add(nameInput);

        let passwordInput = this.scene.createInputBox(nameInput.x, nameInput.y + this.scene.gameManager.inputBox.height, 
            "Contraseña", SCALE, true)
        passwordInput.textInput.addText("**********");
        this.add(passwordInput);
    }
}
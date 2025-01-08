import BaseScreen from "./baseScreen.js";

export default class LoginScreen extends BaseScreen {
    constructor(scene) {
        super(scene, 'login');

        this.x = this.CANVAS_WIDTH / 3;
        this.y = 2.8 * this.CANVAS_HEIGHT / 7;
        const SCALE = 0.78
        const OFFSET_Y = 40;

        let translation = this.translate("Nombre de usuario")
        let nameInput = this.scene.createTextInputWithSideText(80, 0, translation, 1, true)
        nameInput.textInput.addText(this.username);
        this.add(nameInput);

        translation = this.translate("Contraseña")
        let passwordInput = this.scene.createTextInputWithSideText(nameInput.x, nameInput.y + nameInput.height + OFFSET_Y, translation, 1, true)
        passwordInput.textInput.addText("**********");
        this.add(passwordInput);

        translation = this.translate("Iniciar sesión")
        let loginButton = this.createButton(40, passwordInput.y + passwordInput.height + OFFSET_Y * 2.5, translation, () => {
            this.scene.changeToMainScreen()
        }, 0.85)
        this.add(loginButton)

        this.setScale(SCALE)
    }

    createButton(x, y, transId, onClick, scale = 1) {
        let button = this.scene.createButton(x, y, transId, onClick, scale)

        let buttonImg = button.fillImg

        let interactionAnim = this.scene.tweens.addCounter({
            targets: [buttonImg],
            from: 0,
            to: 100,
            onUpdate: (tween) => {
                const value = tween.getValue();
                let col = Phaser.Display.Color.Interpolate.ColorWithColor(button.hCol, button.nCol, 100, value);
                let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                buttonImg.setTint(colInt);
            },
            duration: 650,
            repeat: -1,
            yoyo: true
        })

        buttonImg.on('pointerover', () => {
            interactionAnim.pause()
        });

        buttonImg.on('pointerdown', () => {
            interactionAnim.pause()
        });

        buttonImg.off('pointerout')
        buttonImg.on('pointerout', () => {
            interactionAnim.resume()
        })

        return button
    }
}
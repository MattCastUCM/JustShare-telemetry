import ComputerBaseScene from "./computerBaseScene.js"
import LoginScreen from "./loginScreen.js"

export default class ComputerScene extends ComputerBaseScene {
    /**
    * Pantalla principal
    * @extends Phaser.Scene
    */
    constructor() {
        super("ComputerScene", "computerScene", null);
    }
    
    create() {
        super.create()

        new LoginScreen(this);
    }
}
import ComputerBaseScene from "./computerBaseScene.js"
import LoginScreen from "./loginScreen.js"
import SocialMediaScreen from "./socialMediaScreen.js";

export default class Computer extends ComputerBaseScene {
    constructor() {
        super("Computer", "computer");
    }
    
    create(params) {
        super.create(params)

        this.createPowerIcon(() => {
            this.currentScreen.reset()
        });

        const N_RANDOM_DIGITS = 3
        this.username = this.gameManager.userInfo.name
        for(let i = 0; i < N_RANDOM_DIGITS; ++i) {
            this.username += this.getRandomInt(0, 9)
        }

        this.currentScreen = new LoginScreen(this);
        this.changeToMainScreen()
    }

    changeToMainScreen() {
        this.currentScreen.destroy()
        this.currentScreen = new SocialMediaScreen(this)
    }
}
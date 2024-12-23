import BaseScene from '../baseScene.js';

export default class Scene3Bedroom extends BaseScene {
    /**
     * Escena base para el salon. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super("Scene3Bedroom", 'Scene3Bedroom');
    }

    create(params) {
        super.create(params)

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'bedroomBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);

        
        // Lee el archivo de nodos
        let nodes = this.cache.json.get('scene3Bedroom');
        
        let node = super.readNodes(nodes, "scene3\\scene3Bedroom", "", true);

        this.chatName = this.gameManager.translate("textMessages.chat2", { ns: "deviceInfo", returnObjects: true });
        this.phoneManager.phone.addChat(this.chatName, "");
        this.phoneManager.phone.setChatNode(this.chatName, node);

        this.phoneManager.togglePhone();
        this.phoneManager.bgBlock.disableInteractive();
        this.phoneManager.phone.returnButton.disableInteractive();
        this.phoneManager.phone.toChatScreen(this.chatName);
        
        
        // Anade el evento endConversation para que, al producirse, se pase a la siguiente escena
        this.dispatcher.add("endConversation", this, () => {
            setTimeout(() => {
                let sceneName = 'TextOnlyScene';
                let params = {
                    fadeOutTime: 1000,
                    text: this.gameManager.translate("scene4.party", { ns: "transitions", returnObjects: true }),
                    onComplete: () => {
                        this.gameManager.changeScene("Scene4Frontyard");
                    },
                };
                this.phoneManager.togglePhone();
                this.phoneManager.phone.returnButton.setInteractive();
                this.gameManager.changeScene(sceneName, params);
            }, 3000);
        });
    }

}

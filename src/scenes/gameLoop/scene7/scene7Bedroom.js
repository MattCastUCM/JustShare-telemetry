import BaseScene from '../baseScene.js';
import Portrait from '../../../UI/dialog/portrait.js';

export default class Scene7Bedroom extends BaseScene {
    /**
     * Escena base para el salon. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super("Scene7Bedroom", 'Scene7Bedroom');
    }

    create(params) {
        super.create(params)

        // Pone la imagen de fondo con las dimensiones del canvas
        let dreamBg = this.add.image(0, 0, 'dream').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / dreamBg.height;
        dreamBg.setScale(this.scale);
        dreamBg.depth = 100;
        
        let bg = this.add.image(0, 0, 'bedroomNightBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);
        
        
        // Lee el archivo de nodos
        let nodes = this.cache.json.get('scene7Bedroom');

        this.phoneManager.activatePhoneIcon(true);

        let chatName = this.gameManager.translate("textMessages.chat2", { ns: "deviceInfo", returnObjects: true });
        this.phoneManager.phone.reset();

        this.resetPhone = () => {
            this.phoneManager.phone.addChat(chatName, "harasserPfp");

            let phoneNode = super.readNodes(nodes, "scene7\\scene7Bedroom", "phone", true);
            this.dialogManager.setNode(phoneNode, []);
            
            // Quitar notificaciones de los mensajes anteriores
            this.phoneManager.togglePhone(0, () => {
                this.phoneManager.phone.toChatScreen(chatName);
            });
            this.phoneManager.bgBlock.disableInteractive();
            this.phoneManager.phone.returnButton.disableInteractive();
            this.phoneManager.phone.chats.get(chatName).returnButton.disableInteractive();
        };
        
        // Al producirse, se cambian los dialogos de la cama y el armario
        this.dispatcher.add("chatEnded", this, () => {
            this.dialogManager.textbox.activate(false);
            this.phoneManager.bgBlock.setInteractive();
            this.phoneManager.phone.returnButton.setInteractive();
            this.phoneManager.phone.chats.get(chatName).returnButton.setInteractive();

            super.createInteractiveElement(1390, 400, "pointer", 0.3, () => {
                this.phoneManager.activatePhoneIcon(false);

                let bgDepth = bg.depth;
                this.add.image(0, 0, 'basePC').setOrigin(0, 0).setDepth(bgDepth - 1);
                bg.setDepth(bgDepth - 1);
                
                // Retrato del padre
                let dadTr = this.portraitTr;
                dadTr.x = this.CANVAS_WIDTH / 2 + this.CANVAS_WIDTH / 5;
                let dadPortrait = new Portrait(this, "dad", dadTr, "dad");
                this.portraits.set("dad", dadPortrait);
        
                // Retrato de la madre
                let momTr = this.portraitTr;
                momTr.x =  this.CANVAS_WIDTH / 2 - this.CANVAS_WIDTH / 5;
                let momPortrait = new Portrait(this, "mom", momTr, "mom")
                momPortrait.setFlipX(true);
                this.portraits.set("mom", momPortrait);
                
                setTimeout(() => {
                    let node = super.readNodes(nodes, "scene7\\scene7Bedroom", "call", true);
                    this.dialogManager.setNode(node, [dadPortrait, momPortrait]);
                }, 1000);
            }, true);
        });


        this.dispatcher.add("end", this, () => {
            let params = {
                fadeOutTime: 1000,
                text: this.gameManager.translate("scene7.end", { ns: "transitions", returnObjects: true }),
                onComplete: () => {
                    this.gameManager.changeScene("TitleScene");
                },
            };
            this.gameManager.changeScene("TextOnlyScene", params);
        });
    }

    onCreate() {
        this.resetPhone();
    }
}

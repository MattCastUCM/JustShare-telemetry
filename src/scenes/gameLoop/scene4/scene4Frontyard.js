import BaseScene from '../baseScene.js';
import Portrait from '../../../UI/dialog/portrait.js';

export default class Scene4Frontyard extends BaseScene {
    /**
     * Escena base para el salon. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super("Scene4Frontyard", 'Scene4Frontyard');
    }

    create(params) {
        super.create(params)

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'frontyardBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);

        // Retrato de paula
        let paulaTr = this.portraitTr;
        paulaTr.x = this.CANVAS_WIDTH / 2;
        let paulaPortrait = new Portrait(this, "paula", paulaTr, "paula")
        this.portraits.set("paula", paulaPortrait);

        // PENDIENTE / TEST
        this.phoneManager.activatePhoneIcon(true);

        this.chatName = this.gameManager.translate("textMessages.chat2", { ns: "deviceInfo", returnObjects: true });
        this.phoneManager.phone.addChat(this.chatName, "harasserPfp");
        
        
        // Lee el archivo de nodos
        let nodes = this.cache.json.get('scene4Frontyard');
        let node = super.readNodes(nodes, "scene4\\scene4Frontyard", "", true);

        // Callback que al llamarse cambiara el nodo de dialogo
        this.setNode = () => {
            this.dialogManager.setNode(node, [paulaPortrait]);
        }


        // Al producirse, hace que se reciba un mensaje en el movil
        this.dispatcher.add("endConversation", this, () => {
            this.dialogManager.setNode(null, []);

            // PENDIENTE
            super.createInteractiveElement(100, 100, "enter", 0.4, () => {
                this.gameManager.changeScene("Scene4Backyard");
            }, true);
        });
    }

    // Se hace esto porque si se establece un dialogo en la constructora, no funciona el bloqueo del fondo del DialogManager
    onCreate() {
        setTimeout(() => {
            this.setNode();
        }, 500);
    }
}

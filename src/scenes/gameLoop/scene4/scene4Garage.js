import BaseScene from '../baseScene.js';
import Portrait from '../../../UI/dialog/portrait.js';

export default class Scene4Garage extends BaseScene {
    /**
     * Escena base para el salon. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super("Scene4Garage", 'Scene4Garage');
    }

    create(params) {
        super.create(params)

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'garageBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);

        // Retrato de paula
        let paulaTr = this.portraitTr;
        paulaTr.x = this.CANVAS_WIDTH / 2;
        let paulaPortrait = new Portrait(this, "paula", paulaTr, "paula")
        this.portraits.set("paula", paulaPortrait);

        // PENDIENTE / TEST
        this.phoneManager.activatePhoneIcon(true);

        let chatName = this.gameManager.translate("textMessages.chat2", { ns: "deviceInfo", returnObjects: true });
        this.phoneManager.phone.addChat(chatName, "");

        // Lee el archivo de nodos
        let nodes = this.cache.json.get('scene4Garage');
        let node = super.readNodes(nodes, "scene4\\scene4Garage", "gifts", true);

        // Callback que al llamarse cambiara el nodo de dialogo
        this.setNode = () => {
            this.dialogManager.setNode(node, [paulaPortrait]);
        }

        
        // Anade el evento checkAllClassmates para que, al producirse, compruebe si se ha interactuado con todos los companeros
        this.dispatcher.add("endGifts", this, () => {
            setTimeout(() => {
                this.dialogManager.processNode();
                
                let phoneNode = super.readNodes(nodes, "scene4\\scene4Garage", "phone", true);
                this.phoneManager.phone.setChatNode(chatName, phoneNode);

            }, 1);
        });
    }

    // Se hace esto porque si se establece un dialogo en la constructora, no funciona el bloqueo del fondo del DialogManager
    onCreate() {
        setTimeout(() => {
            this.setNode();
        }, 500);
    }
}

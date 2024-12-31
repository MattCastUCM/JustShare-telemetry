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

        // Retrato de laura
        let lauraTr = this.portraitTr;
        lauraTr.x = this.CANVAS_WIDTH / 2;
        let lauraPortrait = new Portrait(this, "laura", lauraTr, "laura")
        lauraPortrait.setFlipX(true);
        this.portraits.set("laura", lauraPortrait);

        // PENDIENTE / TEST
        this.phoneManager.activatePhoneIcon(true);

        let chatName = this.gameManager.translate("textMessages.chat2", { ns: "deviceInfo", returnObjects: true });
        this.phoneManager.phone.addChat(chatName, "harasserPfp");

        // Lee el archivo de nodos
        let nodes = this.cache.json.get('scene4Garage');
        let node = super.readNodes(nodes, "scene4\\scene4Garage", "gifts", true);

        // Callback que al llamarse cambiara el nodo de dialogo
        this.setNode = () => {
            this.dialogManager.setNode(node, [paulaPortrait]);
        }

        
        // Al producirse, se recibe un mensaje en el movil
        this.dispatcher.add("endGifts", this, () => {
            setTimeout(() => {
                this.dialogManager.processNode();
                
                let phoneNode = super.readNodes(nodes, "scene4\\scene4Garage", "phone1", true);
                this.phoneManager.phone.setChatNode(chatName, phoneNode);

            }, 1);
        });

        // Al producirse, aparece el icono para interactuar con los regalos
        this.dispatcher.add("takePhoto", this, () => {
            // PENDIENTE
            super.createInteractiveElement(100, 100, "pointer", 0.4, () => {
                let node = super.readNodes(nodes, "scene4\\scene4Garage", "photo", true);
                this.dialogManager.setNode(node, [paulaPortrait]);
            }, true);
        });
        
        // Al producirse, se recibe un mensaje en el movil
        this.dispatcher.add("endPhoto", this, () => {
            let phoneNode = super.readNodes(nodes, "scene4\\scene4Garage", "phone2", true);
            this.phoneManager.phone.setChatNode(chatName, phoneNode);
        });

        // Al producirse, se guarda el movil y se pone la conversacion con laura
        this.dispatcher.add("lauraInterrupt", this, () => {
            if (this.phoneManager.phone.visible) {
                this.phoneManager.togglePhone();
            }
            let node = super.readNodes(nodes, "scene4\\scene4Garage", "interruption", true);
            this.dialogManager.setNode(node, [lauraPortrait]);
        });

        // Al producirse, se cambia a la escena de transicion y luego a la escena del salon
        this.dispatcher.add("endInterruption", this, () => {
            let params = {
                text: this.gameManager.translate("scene4.partyEnd", { ns: "transitions", returnObjects: true }),
                onComplete: () => {
                    this.gameManager.changeScene("Scene4Bedroom");
                },
            };
            this.gameManager.changeScene("TextOnlyScene", params);
        });
    }

    // Se hace esto porque si se establece un dialogo en la constructora, no funciona el bloqueo del fondo del DialogManager
    onCreate() {
        setTimeout(() => {
            this.setNode();
        }, 500);
    }
}

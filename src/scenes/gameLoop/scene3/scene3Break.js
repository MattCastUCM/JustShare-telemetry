import BaseScene from '../baseScene.js';
import Portrait from '../../../UI/dialog/portrait.js';

export default class Scene3Break extends BaseScene {
    /**
     * Escena base para el salon. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super("Scene3Break", 'Scene3Break');
    }

    create(params) {
        super.create(params)

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'canteenBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);

        // Retrato de laura
        let lauraTr = this.portraitTr;
        lauraTr.x = this.CANVAS_WIDTH / 2;
        let lauraPortrait = new Portrait(this, "laura", lauraTr, "laura")
        lauraPortrait.setFlipX(true);
        this.portraits.set("laura", lauraPortrait);

        // Lee el archivo de nodos
        let nodes = this.cache.json.get('scene3Break');
        let node = super.readNodes(nodes, "scene3\\scene3Break", "", true);
        
        // Callback que al llamarse cambiara el nodo de dialogo
        this.setNode = () => {
            this.dialogManager.setNode(node, [lauraPortrait]);
        }

        this.phoneManager.activatePhoneIcon(true);
        // PENDIENTE / TEST
        let chatName = this.gameManager.translate("textMessages.chat2", { ns: "deviceInfo", returnObjects: true });
        this.phoneManager.phone.addChat(chatName, "");


        this.dispatcher.add("processChoice", this, () => {
            this.dialogManager.processNode();

        });
        
        this.dispatcher.add("answerPhone", this, () => {
            setTimeout(() => {
                this.phoneManager.togglePhone();
                this.phoneManager.phone.toChatScreen(chatName);
            }, 500);
        });

        this.dispatcher.add("closePhone", this, () => {
            this.phoneManager.togglePhone();
        });

        // Anade el evento endBreak para que, al producirse, se cambie a la escena de transicion y luego a la
        this.dispatcher.add("endBreak", this, () => {
            let sceneName = 'TextOnlyScene';
            let params = {
                text: this.gameManager.translate("scene3.classEnd", { ns: "transitions", returnObjects: true }),
                onComplete: () => {
                    this.gameManager.changeScene("TitleScene");
                },
            };
            this.gameManager.changeScene(sceneName, params);
        });
    }

    // Se hace esto porque si se establece un dialogo en la constructora,
    // no funciona el bloqueo del fondo del DialogManager
    onCreate() {
        setTimeout(() => {
            this.setNode();
        }, 500);
    }
}

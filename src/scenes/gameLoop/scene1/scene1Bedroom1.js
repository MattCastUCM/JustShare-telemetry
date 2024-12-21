import BaseScene from '../baseScene.js';
import Portrait from '../../../UI/dialog/portrait.js';

export default class Scene1Bedroom1 extends BaseScene {
    /**
     * Escena base para el salon. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super("Scene1Bedroom1", 'Scene1Bedroom1');
    }

    create(params) {
        super.create(params)

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'bedroomBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);


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

        
        // Lee el archivo de nodos
        let nodes = this.cache.json.get('scene1Bedroom1');
        let generalNodes = this.cache.json.get('generalDialogs');

        // Armario
        let closetNode = super.readNodes(generalNodes, "generalDialogs", "closet", true);
        super.createInteractiveElement(240, 400, "pointer", 0.3, () => {
            this.dialogManager.setNode(closetNode, []);
        }, false);
        
        // Cama
        let bedNode = super.readNodes(nodes, "scene1\\scene1Bedroom1", "bed", true);
        super.createInteractiveElement(790, 550, "pointer", 0.3, () => {
            this.dialogManager.setNode(bedNode, []);
        }, false);
        

        // Ordenador
        let pcNode = super.readNodes(nodes, "scene1\\scene1Bedroom1", "computer1", true);
        super.createInteractiveElement(1390, 400, "pointer", 0.3, () => {
            // PENDIENTE / TEST
            this.phoneManager.activatePhoneIcon(true);
            let chatName = this.gameManager.translate("textMessages.harasserUsername", { ns: "deviceInfo", returnObjects: true });
            this.phoneManager.phone.addChat(chatName, "");
            this.dialogManager.setNode(pcNode, []);
        }, false);
        

        this.dispatcher.add("answerDoor", this, () => {
            // TEST
            this.phoneManager.togglePhone();

            let node = super.readNodes(nodes, "scene1\\scene1Bedroom1", "interruption", true);
            this.dialogManager.setNode(node, [momPortrait, dadPortrait]);

            pcNode = super.readNodes(nodes, "scene1\\scene1Bedroom1", "homework", true);
        });

        // Anade el evento homework para que, al producirse, se cambie el dialogo de la cama
        this.dispatcher.add("endHomework", this, () => {
            let node = super.readNodes(nodes, "scene1\\scene1Bedroom1", "computer2", true);
            let chatName = this.gameManager.translate("textMessages.harasserUsername", { ns: "deviceInfo", returnObjects: true });

            // TEST
            this.phoneManager.phone.setChatNode(chatName, node);
        });

        // Anade el evento endConversation para que, al producirse, se cambie el dialogo de la cama
        this.dispatcher.add("endConversation", this, () => {
            let depth = bg.depth;
            bg.destroy();
            bg = this.add.image(0, 0, 'bedroomNightBg').setOrigin(0, 0).setDepth(depth - 1);
            bedNode = super.readNodes(generalNodes, "generalDialogs", "bed", true);
        });

        // Anade el evento sleep para que, al producirse, se haga la animacion de cerrar los ojos
        this.dispatcher.add("sleep", this, () => {
            this.UIManager.closeEyes(() => {
                // Una vez termina la animacion, se introduce un retardo y cuando acaba,
                // se cambia a la escena de transicion y luego a la escena del comedor del dia siguiente
                setTimeout(() => {
                    let sceneName = 'TextOnlyScene';
                    let params = {
                        text: this.gameManager.translate("scene1.nextDay", { ns: "transitions", returnObjects: true }),
                        onComplete: () => {
                            this.UIManager.moveLids(true);
                            this.gameManager.changeScene("Scene1Lunch2");
                        },
                    };
                    this.gameManager.changeScene(sceneName, params);
                }, 1000);
            });
        });
    }

    // Se hace esto porque si se establece un dialogo en la constructora, no funciona el bloqueo del fondo del DialogManager
    onCreate() {
    }
    
}

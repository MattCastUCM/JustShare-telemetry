import BaseScene from '../baseScene.js';
import Portrait from '../../../UI/dialog/portrait.js';

export default class Scene1Lunch1 extends BaseScene {
    /**
     * Escena base para el salon. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super("Scene1Lunch1", 'Scene1Lunch1');
    }

    create(params) {
        super.create(params)

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'livingroomInsideBg').setOrigin(0, 0);
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
        let nodes = this.cache.json.get('scene1Lunch1');
        let node = super.readNodes(nodes, "scene1\\scene1Lunch1", "main", true);
        
        // Callback que al llamarse cambiara el nodo de dialogo
        this.setNode = () => {
            this.dialogManager.setNode(node, [dadPortrait, momPortrait]);
        }

        // Anade el evento endLunch para que, al producirse, cambie de dialogo
        this.dispatcher.add("endLunch", this, () => {
            let thoughtNode = super.readNodes(nodes, "scene1\\scene1Lunch1", "endLunch", true);
            this.dialogManager.setNode(thoughtNode, []);
        });
        
        // Anade el evento receiveMsg para que, al producirse, 
        // aparezca el icono del telefono y se reciba un mensaje
        this.dispatcher.add("receiveMsg", this, () => {
            this.phoneManager.activatePhoneIcon(true);
            // PENDIENTE
            let chatName = this.gameManager.translate("textMessages.chat1", { ns: "phoneInfo", returnObjects: true });
            let phoneNode = super.readNodes(nodes, "scene1\\scene1Lunch1", "phone", true);
            this.phoneManager.phone.addChat(chatName, "");
            this.phoneManager.phone.setChatNode(chatName, phoneNode);
        })

        let msgAnswered = false;
        // Anade el evento spawnInteractions para que, al producirse, se creen los elementos interactuables de la escena
        this.dispatcher.add("spawnInteractions", this, () => {
            let doorNode = super.readNodes(nodes, "scene1\\scene1Lunch1", "door", true);
            super.createInteractiveElement(890, 380, "pointer", 0.4, () => {
                this.dialogManager.setNode(doorNode, []);
            }, false);
            
            // PENDIENTE
            let bedroomNode = super.readNodes(nodes, "scene1\\scene1Lunch1", "unanswered", true);
            super.createInteractiveElement(1140, 380, "enter", 0.4, () => {
                if (msgAnswered) {
                    this.gameManager.changeScene("Scene1Bedroom1", null, true);
                }
                else {
                    this.dialogManager.setNode(bedroomNode, []);
                }
            }, false);
        });

        this.dispatcher.add("chatEnded", this, () =>{
            msgAnswered = true;
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

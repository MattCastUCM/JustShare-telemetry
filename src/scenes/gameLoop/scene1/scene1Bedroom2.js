import BaseScene from '../baseScene.js';
import Portrait from '../../../UI/dialog/portrait.js';

export default class Scene1Bedroom2 extends BaseScene {
    /**
     * Escena base para el salon. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super("Scene1Bedroom2", 'Scene1Bedroom2');
    }

    create(params) {
        super.create(params)

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'bedroomBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);


        // Elemento interactuable que permite volver al salon
        super.createInteractiveElement(1400, 800, 0.4, () => {
            this.gameManager.changeScene("Scene1Lunch2", null, true);
        }, false);

        
        // Lee el archivo de nodos
        let nodes = this.cache.json.get('scene1Bedroom2');
        let generalNodes = this.cache.json.get('generalDialogs');

        // Armario
        let closetNode = super.readNodes(generalNodes, "generalDialogs", "closet", true);
        super.createInteractiveElement(240, 400, "pointer", 0.3, () => {
            this.dialogManager.setNode(closetNode, []);
        }, false);
        
        // Cama
        let bedNode = super.readNodes(nodes, "scene1\\scene1Bedroom2", "bed", true);
        super.createInteractiveElement(790, 550, "pointer", 0.3, () => {
            this.dialogManager.setNode(bedNode, []);
        }, false);
        
        // Ordenador
        let pcNode = super.readNodes(nodes, "scene1\\scene1Bedroom2", "computer", true);
        super.createInteractiveElement(1390, 400, "pointer", 0.3, () => {
            // PENDIENTE / TEST
            this.phoneManager.activatePhoneIcon(true);
            let chatName = this.gameManager.translate("textMessages.harasserUsername", { ns: "deviceInfo", returnObjects: true });
            this.phoneManager.phone.addChat(chatName, "");
            this.dialogManager.setNode(pcNode, []);
        }, false);

        
        // Anade el evento endConversation para que, al producirse, se haga la animacion de cerrar los ojos
        this.dispatcher.add("endConversation", this, () => {
            this.UIManager.closeEyes(() => {
                // Una vez termina la animacion, se introduce un retardo y cuando acaba,
                // se cambia a la escena de transicion y luego a la escena del comedor del dia siguiente
                setTimeout(() => {
                    let sceneName = 'TextOnlyScene';
                    let params = {
                        text: this.gameManager.translate("scene2.startWeek", { ns: "transitions", returnObjects: true }),
                        onComplete: () => {
                            // PENDIENTE
                            this.UIManager.moveLids(true);
                            this.gameManager.changeScene("Scene2Break");
                        },
                    };
                    this.gameManager.changeScene(sceneName, params);
                }, 1000);
            });
        });
    }

    // Se hace esto porque si se establece un dialogo en la constructora, no funciona el bloqueo del fondo del DialogManager
    onCreate() {
        // this.dispatcher.dispatch("sleep", { });
    }
    
}

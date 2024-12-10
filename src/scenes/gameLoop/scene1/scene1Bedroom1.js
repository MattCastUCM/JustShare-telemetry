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


        // Elemento interactuable que permite volver al salon
        super.createInteractiveElement(120, 790, "exit", 0.4, () => {
            this.gameManager.changeScene("Scene1Lunch1", null, true);
        }, false)

        
        // Lee el archivo de nodos
        let nodes = this.cache.json.get('scene1Bedroom1');

        // Armario
        let closetNode = super.readNodes(nodes, "scene1\\scene1Bedroom1", "closet", true);
        super.createInteractiveElement(240, 400, "pointer", 0.4, () => {
            this.dialogManager.setNode(closetNode, []);
        }, false)
        
        // Cama
        let bedNode = super.readNodes(nodes, "scene1\\scene1Bedroom1", "bed", true);
        super.createInteractiveElement(790, 550, "pointer", 0.4, () => {
            this.dialogManager.setNode(bedNode, []);
        }, false)
        
        // Ordenador
        super.createInteractiveElement(1390, 400, "pointer", 0.4, () => {
            // PENDIENTE
        }, false)
        

        // Anade el evento setInterruption para que, al producirse, se cambie el dialogo de la cama
        this.dispatcher.add("setInterruption", this, () => {
            bedNode = super.readNodes(nodes, "scene1\\scene1Bedroom1", "bedAfterInterruption", true);
        });

        // Anade el evento homework para que, al producirse, se cambie el dialogo de la cama
        this.dispatcher.add("endHomework", this, () => {
            bedNode = super.readNodes(nodes, "scene1\\scene1Bedroom1", "bedAfterHomework", true);
        });

        // Anade el evento endConversation para que, al producirse, se cambie el dialogo de la cama
        this.dispatcher.add("endConversation", this, () => {
            bedNode = super.readNodes(nodes, "scene1\\scene1Bedroom1", "bedFinal", true);
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

    // Se hace esto porque si se establece un dialogo en la constructora,
    // no funciona el bloqueo del fondo del DialogManager
    onCreate() {
    }
    
}

import BaseScene from '../baseScene.js';
import Portrait from '../../../UI/dialog/portrait.js';

export default class Scene1Room1 extends BaseScene {
    /**
     * Escena base para el salon. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super("Scene1Room1", 'Scene1Room1');
    }

    create(params) {
        super.create(params)

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'bedroomBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);


        // Elemento interactuable que permite volver al salon
        super.createInteractiveElement(1400, 800, 0.4, () => {
            this.gameManager.changeScene("Scene1Lunch1", null, true);
        }, false)

        
        // Lee el archivo de nodos
        this.nodes = this.cache.json.get('scene1Room1');

        // Cama
        let bedNode = super.readNodes(this.nodes, "scene1\\scene1Room1", "bed", true);
        super.createInteractiveElement(700, 500, 0.4, () => {
            this.dialogManager.setNode(bedNode, []);
        }, false)

        // Armario
        let closetNode = super.readNodes(this.nodes, "scene1\\scene1Room1", "closet", true);
        super.createInteractiveElement(600, 500, 0.4, () => {
            this.dialogManager.setNode(closetNode, []);
        }, false)

        
        // Anade el evento setInterruption para que, al producirse, se cambie el dialogo de la cama
        this.dispatcher.add("setInterruption", this, () => {
            bedNode = super.readNodes(this.nodes, "scene1\\scene1Room1", "bedAfterInterruption", true);
        });

        // Anade el evento homework para que, al producirse, se cambie el dialogo de la cama
        this.dispatcher.add("homework", this, () => {
            bedNode = super.readNodes(this.nodes, "scene1\\scene1Room1", "bedAfterHomework", true);
        });

        // Anade el evento endConversation para que, al producirse, se cambie el dialogo de la cama
        this.dispatcher.add("endConversation", this, () => {
            bedNode = super.readNodes(this.nodes, "scene1\\scene1Room1", "bedFinal", true);
        });

        // Anade el evento sleep para que, al producirse, se haga la animacion de cerrar los ojos
        this.dispatcher.add("sleep", this, () => {
            this.UIManager.closeEyes(() => {
                // Una vez termina la animacion, se introduce un retardo y cuando acaba,
                // se cambia a la escena de transicion y luego a la escena del comedor del dia siguiente
                setTimeout(() => {
                    let sceneName = 'TextOnlyScene';
                    let params = {
                        text: this.i18next.t("scene1.nextDay", { ns: "transitions", returnObjects: true }),
                        onComplete: () => {
                            this.UIManager.moveLids(true);
                            this.gameManager.changeScene("TitleScene");
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
        // this.test();
    }
    
}

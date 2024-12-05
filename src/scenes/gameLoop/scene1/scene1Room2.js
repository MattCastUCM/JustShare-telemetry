import BaseScene from '../baseScene.js';
import Portrait from '../../../UI/dialog/portrait.js';

export default class Scene1Room2 extends BaseScene {
    /**
     * Escena base para el salon. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super("Scene1Room2", 'Scene1Room2');
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
        }, false)

        
        // Lee el archivo de nodos
        let nodes = this.cache.json.get('scene1Room2');

        // Cama
        let bedNode = super.readNodes(nodes, "scene1\\scene1Room2", "bed", true);
        super.createInteractiveElement(700, 500, 0.4, () => {
            this.dialogManager.setNode(bedNode, []);
        }, false)

        // Armario
        let closetNode = super.readNodes(nodes, "scene1\\scene1Room2", "closet", true);
        super.createInteractiveElement(600, 500, 0.4, () => {
            this.dialogManager.setNode(closetNode, []);
        }, false)

        // Ordenador
        // PENDIENTE

        // Anade el evento sleep para que, al producirse, se haga la animacion de cerrar los ojos
        this.dispatcher.add("sleep", this, () => {
            this.UIManager.closeEyes(() => {
                // Una vez termina la animacion, se introduce un retardo y cuando acaba,
                // se cambia a la escena de transicion y luego a la escena del comedor del dia siguiente
                setTimeout(() => {
                    let sceneName = 'TextOnlyScene';
                    let params = {
                        text: this.i18next.t("scene2.startWeek", { ns: "transitions", returnObjects: true }),
                        onComplete: () => {
                            this.UIManager.moveLids(true);
                            this.gameManager.changeScene("Scene2Break");
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
        this.dispatcher.dispatch("sleep", { });
    }
    
}

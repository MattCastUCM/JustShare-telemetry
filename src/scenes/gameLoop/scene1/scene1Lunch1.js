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
        let bg = this.add.image(0, 0, 'classBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);

        
        let dadTr = this.portraitTr;
        dadTr.x = this.CANVAS_WIDTH / 4 + this.CANVAS_WIDTH / 2;
        let dadPortrait = new Portrait(this, "dad", dadTr, "dad");
        this.portraits.set("dad", dadPortrait);

        let momTr = this.portraitTr;
        momTr.x = this.CANVAS_WIDTH / 4;
        let momPortrait = new Portrait(this, "mom", momTr, "mom")
        momPortrait.setFlipX(true);
        this.portraits.set("mom", momPortrait);

        this.nodes = this.cache.json.get('scene1Lunch1');
        let node = super.readNodes(this.nodes, "scene1\\scene1Lunch1", "main", true);
        
        this.setNode = () => {
            this.dialogManager.setNode(node, [dadPortrait, momPortrait]);
        }

        this.dispatcher.add("endLunch", this, () => {
            let thoughtNode = super.readNodes(this.nodes, "scene1\\scene1Lunch1", "endLunch", true);
            this.dialogManager.setNode(thoughtNode, []);
        });

        this.dispatcher.add("spawnInteractions", this, () => {
            let doorNode = super.readNodes(this.nodes, "scene1\\scene1Lunch1", "door", true);
            super.createInteractiveElement(500, 500, 0.4, () => {
                this.dialogManager.setNode(doorNode, []);
            }, false)

            super.createInteractiveElement(700, 500, 0.4, () => {
                this.gameManager.changeScene("Scene1Room", null, true);
            }, false)
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

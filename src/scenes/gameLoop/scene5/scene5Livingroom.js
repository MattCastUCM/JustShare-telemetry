import BaseScene from '../baseScene.js';
import Portrait from '../../../UI/dialog/portrait.js';

export default class Scene5Livingroom extends BaseScene {
    /**
     * Escena base para el salon. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super("Scene5Livingroom", 'Scene5Livingroom');
    }

    create(params) {
        super.create(params)

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'livingroomOutsideBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);

        // Retrato de laura
        let lauraTr = this.portraitTr;
        lauraTr.x = this.CANVAS_WIDTH / 2;
        let lauraPortrait = new Portrait(this, "laura", lauraTr, "laura")
        lauraPortrait.setFlipX(true);
        this.portraits.set("laura", lauraPortrait);


        // // Lee el archivo de nodos
        // let nodes = this.cache.json.get('scene5Livingroom');
        // let node = super.readNodes(nodes, "scene5\\scene5Livingroom", "", true);

        // Callback que al llamarse cambiara el nodo de dialogo
        this.setNode = () => {
            // this.dialogManager.setNode(node, [lauraPortrait]);
        }
    }

    // Se hace esto porque si se establece un dialogo en la constructora, no funciona el bloqueo del fondo del DialogManager
    onCreate() {
        setTimeout(() => {
            this.setNode();
        }, 500);
    }
}

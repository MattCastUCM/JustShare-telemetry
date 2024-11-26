import BaseScene from '../baseScene.js';
import Portrait from '../../../UI/dialog/portrait.js';

export default class Scene1Classroom extends BaseScene {
    /**
     * Escena base para el salon. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super("Scene1Classroom", 'Scene1Classroom');
    }

    create(params) {
        super.create(params)

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'livingroomBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);

        let momTr = this.portraitTr;
        let momPortrait = new Portrait(this, "mom", momTr)
        momPortrait.setFlipX(true);
        this.portraits.set("mom", momPortrait);

        let dadTr = this.portraitTr;
        dadTr.x += this.CANVAS_WIDTH / 2;
        let dadPortrait = new Portrait(this, "dad", dadTr);
        this.portraits.set("dad", dadPortrait);

        let nodes = this.cache.json.get('scene1Classroom');
        this.node = super.readNodes(nodes, "scene1\\scene1Classroom", "", true);
        
        this.setNode = () => {
            this.dialogManager.setNode(this.node, [momPortrait, dadPortrait]);
        }
        
        this.dispatcher.add("startBreak", this, () => {
            // Pasa a la escena inicial con los parametros text, onComplete y onCompleteDelay
            let sceneName = 'TextOnlyScene';
            let params = {
                text: this.i18next.t("scene1.break", { ns: "transitions", returnObjects: true }),
                onComplete: () => {
                    // this.changeScene("Scene1Break", null);
                },
                onCompleteDelay: 1000
            };
            this.gameManager.changeScene(sceneName, params);
        })

    }

    // Se hace esto porque si se establece un dialogo en la constructora, 
    // no funciona el bloqueo del fondo del DialogManager
    onCreate() {
        this.dialogManager.changeScene(this);
        // this.setNode();
        setTimeout(() => {
            // this.setNode();
        }, 500);
        
    }

}

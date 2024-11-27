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

        
        let teacherTr = this.portraitTr;
        teacherTr.x = this.CANVAS_WIDTH / 2;
        let teacherPortrait = new Portrait(this, "dad", teacherTr, "teacher");
        this.portraits.set("teacher", teacherPortrait);

        let lauraTr = this.portraitTr;
        let lauraPortrait = new Portrait(this, "mom", lauraTr, "laura")
        lauraPortrait.setFlipX(true);
        this.portraits.set("laura", lauraPortrait);

        let nodes = this.cache.json.get('scene1Classroom');
        let node = super.readNodes(nodes, "scene1\\scene1Classroom", "part1", true);
        
        this.setNode = () => {
            this.dialogManager.setNode(node, [teacherPortrait]);
        }

        this.dispatcher.add("appearLaura", this, () => {
            node = super.readNodes(nodes, "scene1\\scene1Classroom", "part2", true);
            this.dialogManager.setNode(node, [lauraPortrait]);
        });

        this.dispatcher.add("startBreak", this, () => {
            // Pasa a la escena inicial con los parametros text, onComplete y onCompleteDelay
            let sceneName = 'TextOnlyScene';
            let params = {
                text: this.i18next.t("scene1.break", { ns: "transitions", returnObjects: true }),
                onComplete: () => {
                    this.gameManager.changeScene("Scene1Break", null);
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

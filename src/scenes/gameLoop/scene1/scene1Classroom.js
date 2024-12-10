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
        let bg = this.add.image(0, 0, 'classBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);

        // Retrato del profesor
        let teacherTr = this.portraitTr;
        teacherTr.x = this.CANVAS_WIDTH / 2;
        let teacherPortrait = new Portrait(this, "teacher", teacherTr, "teacher");
        this.portraits.set("teacher", teacherPortrait);

        // Retrato de laura
        let lauraTr = this.portraitTr;
        let lauraPortrait = new Portrait(this, "laura", lauraTr, "laura")
        lauraPortrait.setFlipX(true);
        this.portraits.set("laura", lauraPortrait);

        
        // Lee el archivo de nodos
        let nodes = this.cache.json.get('scene1Classroom');
        let node = super.readNodes(nodes, "scene1\\scene1Classroom", "part1", true);
        
        // Callback que al llamarse cambiara el nodo de dialogo
        this.setNode = () => {
            this.dialogManager.setNode(node, [teacherPortrait]);
        }

        // Anade el evento appearLaura para que, al producirse, cambie de dialogo
        this.dispatcher.add("appearLaura", this, () => {
            node = super.readNodes(nodes, "scene1\\scene1Classroom", "part2", true);
            this.dialogManager.setNode(node, [lauraPortrait]);
        });

        // Anade el evento startBreak para que, al producirse, se cambie a la escena de transicion y luego a la escena del comedor
        this.dispatcher.add("startBreak", this, () => {
            let sceneName = 'TextOnlyScene';
            let params = {
                text: this.gameManager.translate("scene1.break", { ns: "transitions", returnObjects: true }),
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

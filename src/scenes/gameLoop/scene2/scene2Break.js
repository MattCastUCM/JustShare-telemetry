import BaseScene from '../baseScene.js';
import Portrait from '../../../UI/dialog/portrait.js';

export default class Scene2Break extends BaseScene {
    /**
     * Escena base para el salon. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super("Scene2Break", 'Scene2Break');
    }

    create(params) {
        super.create(params)

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'canteenBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);

        // Retrato de laura
        let lauraTr = this.portraitTr;
        lauraTr.x = this.CANVAS_WIDTH / 2;
        let lauraPortrait = new Portrait(this, "laura", lauraTr, "laura")
        lauraPortrait.setFlipX(true);
        this.portraits.set("laura", lauraPortrait);

        // Retrato de paula
        let paulaTr = this.portraitTr;
        paulaTr.x = this.CANVAS_WIDTH / 2 + this.CANVAS_WIDTH / 5;
        let paulaPortrait = new Portrait(this, "paula", paulaTr, "paula")
        this.portraits.set("paula", paulaPortrait);

        
        // Lee el archivo de nodos
        let nodes = this.cache.json.get('scene2Break');
        let node = super.readNodes(nodes, "scene2\\scene2Break", "part1", true);
        
        // Callback que al llamarse cambiara el nodo de dialogo
        this.setNode = () => {
            this.dialogManager.setNode(node, [lauraPortrait]);
        }


        // Anade el evento paulaAppear para que, al producirse, el retrato de laura se desplace, 
        // aparezca el retrato de paula, y se cambie el dialogo a la segunda parte
        this.dispatcher.add("paulaAppear", this, () => {
            lauraTr.x = this.CANVAS_WIDTH / 2 - this.CANVAS_WIDTH / 5;
            lauraPortrait.setPosX(lauraTr.x);
            node = super.readNodes(nodes, "scene2\\scene2Break", "part2", true);
            this.dialogManager.setNode(node, [lauraPortrait, paulaPortrait]);
        });
    
        // Anade el evento endBreak para que, al producirse, se cambie a la escena de transicion y luego a la
        this.dispatcher.add("endBreak", this, () => {
            let sceneName = 'TextOnlyScene';
            let params = {
                text: this.i18next.t("scene2.classEnd", { ns: "transitions", returnObjects: true }),
                onComplete: () => {
                    this.gameManager.changeScene("TitleScene");
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

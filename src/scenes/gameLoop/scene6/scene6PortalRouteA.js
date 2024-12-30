import BaseScene from '../baseScene.js';
import Portrait from '../../../UI/dialog/portrait.js';

export default class Scene6PortalRouteA extends BaseScene {
    /**
     * Escena base para el salon. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super("Scene6PortalRouteA", 'Scene6PortalRouteA');
    }

    create(params) {
        super.create(params)

        // Pone la imagen de fondo con las dimensiones del canvas
        // PENDIENTE
        let bg = this.add.image(0, 0, '').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);
        
        // Retrato del acosador
        let harasserTr = this.portraitTr;
        harasserTr.x = this.CANVAS_WIDTH / 2;
        let harasserPortrait = new Portrait(this, "harasser", harasserTr, "???");
        this.portraits.set("harasser", harasserPortrait);


        // Lee el archivo de nodos
        this.nodes = this.cache.json.get('scene6PortalRouteA');
        this.addDoors();
        
        // Al producirse, se cambian los dialogos de la cama y el armario
        this.dispatcher.add("enter", this, () => {
            let bgDepth = bg.depth;
            bg.setDepth(bgDepth - 1);
            // PENDIENTE
            let bg2 = this.add.image(0, 0, 'bedroomBg').setOrigin(0, 0).setDepth(bgDepth - 1);
            bg2.alpha = 0;
            // Hace la animacion de fade in para todos los objetos
            this.tweens.add({
                targets: bg2,
                alpha: { from: 0, to: 1 },
                duration: 300,
                repeat: 0,
            });

        });

        // Al producirse, se cambian los dialogos de la cama y el armario
        this.dispatcher.add("end", this, () => {
            let params = {
                fadeOutTime: 1000,
            };
            this.gameManager.changeScene("Scene6EndingRouteA", params);
        });
    }
    
    // PENDIENTE
    addDoors() {
        let nodeDoor1 = super.readNodes(this.nodes, "scene6\\scene6PortalRouteA", "incorrectDoor1", true);
        super.createInteractiveElement(550, 480, "pointer", 0.3, () => {
            this.dialogManager.setNode(nodeDoor1, []);
        }, true);

        let nodeDoor2 = super.readNodes(this.nodes, "scene6\\scene6PortalRouteA", "incorrectDoor2", true);
        super.createInteractiveElement(650, 480, "pointer", 0.3, () => {
            this.dialogManager.setNode(nodeDoor2, []);
        }, true);

        let nodeDoor3 = super.readNodes(this.nodes, "scene6\\scene6PortalRouteA", "incorrectDoor3", true);
        super.createInteractiveElement(750, 480, "pointer", 0.3, () => {
            this.dialogManager.setNode(nodeDoor3, []);
        }, true);

        let nodeDoor4 = super.readNodes(this.nodes, "scene6\\scene6PortalRouteA", "main", true);
        super.createInteractiveElement(850, 480, "pointer", 0.3, () => {
            this.dialogManager.setNode(nodeDoor4, [this.portraits.get("harasser")]);
        }, true);
    }
}

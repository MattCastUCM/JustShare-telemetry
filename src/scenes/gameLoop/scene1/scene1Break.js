import BaseScene from '../baseScene.js';
import Portrait from '../../../UI/dialog/portrait.js';

export default class Scene1Break extends BaseScene {
    /**
     * Escena base para el salon. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super("Scene1Break", 'Scene1Break');
    }

    create(params) {
        super.create(params)

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'livingroomBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);

        let lauraTr = this.portraitTr;
        lauraTr.x = this.CANVAS_WIDTH / 2;
        let lauraPortrair = new Portrait(this, "mom", lauraTr, "laura")
        lauraPortrair.setFlipX(true);
        this.portraits.set("laura", lauraPortrair);

        this.addTables();

        this.dispatcher.add("checkAllTables", this, () => {
            this.checkAllTables();
        });

        this.dispatcher.add("endBreak", this, () => {
            // Pasa a la escena inicial con los parametros text, onComplete y onCompleteDelay
            let sceneName = 'TextOnlyScene';
            let params = {
                text: this.i18next.t("scene1.classEnd", { ns: "transitions", returnObjects: true }),
                onComplete: () => {
                    
                },
            };
            this.gameManager.changeScene(sceneName, params);
        });
    }


    addTables() {
        this.interactedTables = [false, false, false];
        let nodes = this.cache.json.get('scene1Break');

        let nodeTable1 = super.readNodes(nodes, "scene1\\scene1Break", "tables1", true);
        let table1 = this.add.image(0, 0, 'livingroomBg').setOrigin(0, 0).setScale(0.2, 0.2);
        table1.setInteractive({ useHandCursor: true });
        table1.on('pointerdown', () => {
            this.dialogManager.setNode(nodeTable1, []);
            this.interactedTables[0] = true;
            this.clickTable(table1);
        });

        let nodeTable2 = super.readNodes(nodes, "scene1\\scene1Break", "tables2", true);
        let table2 = this.add.image(300, 300, 'livingroomBg').setOrigin(0, 0).setScale(0.2, 0.2);
        table2.setInteractive({ useHandCursor: true });
        table2.on('pointerdown', () => {
            this.dialogManager.setNode(nodeTable2, []);
            this.interactedTables[1] = true;
            this.clickTable(table2);
        });

        let nodeTable3 = super.readNodes(nodes, "scene1\\scene1Break", "tables3", true);
        let table3 = this.add.image(600, 600, 'livingroomBg').setOrigin(0, 0).setScale(0.2, 0.2);
        table3.setInteractive({ useHandCursor: true });
        table3.on('pointerdown', () => {
            this.dialogManager.setNode(nodeTable3, []);
            this.interactedTables[2] = true;
            this.clickTable(table3);
        });
    }

    clickTable(table) {
        // Configuracion de las animaciones
        let animConfig = {
            fadeTime: 150,
            fadeEase: 'linear'
        }

        table.disableInteractive();
        this.tweens.add({
            targets: table,
            alpha: { from: 1, to: 0 },
            ease: animConfig.fadeEase,
            duration: animConfig.fadeTime,
            repeat: 0,
        });
    }

    checkAllTables() {
        let allPressed = true;
        for (let i = 0; i < this.interactedTables.length && allPressed; i++) {
            allPressed &= this.interactedTables[i];
        }

        if (allPressed) {
            let nodes = this.cache.json.get('scene1Break');
            let node = super.readNodes(nodes, "scene1\\scene1Break", "mainConversation", true);
            setTimeout(() => {
                this.dialogManager.setNode(node, [this.portraits.get("laura")]); 
            }, 500);
        }
    }
}

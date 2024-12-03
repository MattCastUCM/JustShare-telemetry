import BaseScene from '../baseScene.js';
import Portrait from '../../../UI/dialog/portrait.js';

export default class Scene1Room extends BaseScene {
    /**
     * Escena base para el salon. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super("Scene1Room", 'Scene1Room');
    }

    create(params) {
        super.create(params)

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'bedroomBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);

        super.createInteractiveElement(700, 500, 0.4, () => {
            this.gameManager.changeScene("Scene1Lunch1", null, true);
        }, false)
    }

    // Se hace esto porque si se establece un dialogo en la constructora,
    // no funciona el bloqueo del fondo del DialogManager
    onCreate() {
        
    }
    
}

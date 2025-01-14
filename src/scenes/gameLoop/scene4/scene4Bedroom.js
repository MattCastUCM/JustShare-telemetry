import BaseScene from '../baseScene.js';

export default class Scene4Bedroom extends BaseScene {
    /**
     * Escena base para el salon. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super("Scene4Bedroom", 'Scene4Bedroom');
    }

    create(params) {
        super.create(params)

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'bedroomNightBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);
        

        // TEST
        this.phoneManager.activatePhoneIcon(true);

        this.chatName = this.gameManager.translate("textMessages.chat2", { ns: "deviceInfo", returnObjects: true });
        this.phoneManager.phone.addChat(this.chatName, "harasserPfp");


        // Lee el archivo de nodos
        let nodes = this.cache.json.get('scene4Bedroom');
        let generalNodes = this.cache.json.get('generalDialogs');

        // Armario
        let closetNode = super.readNodes(generalNodes, "generalDialogs", "closet", true);
        super.createInteractiveElement(240, 400, "pointer", 0.3, () => {
            this.dialogManager.setNode(closetNode, []);
        }, false);
        
        // Cama
        let bedNode = super.readNodes(nodes, "scene4\\scene4Bedroom", "bed", true);
        super.createInteractiveElement(790, 550, "pointer", 0.3, () => {
            this.dialogManager.setNode(bedNode, []);
        }, false);
        
        let phoneNode = super.readNodes(nodes, "scene4\\scene4Bedroom", "phone", true);
        this.phoneManager.phone.setChatNode(this.chatName, phoneNode);

        
        // // Al producirse, se cambia el nodo de la cama
        this.dispatcher.add("chatEnded", this, () =>{
            bedNode = super.readNodes(generalNodes, "generalDialogs", "bed", true);
            closetNode = super.readNodes(generalNodes, "generalDialogs", "closetNight", true);
        });

        // Al producirse, se hace la animacion de cerrar los ojos
        this.dispatcher.add("sleep", this, () => {
            this.UIManager.closeEyes(() => {
                // Una vez termina la animacion, se introduce un retardo y cuando acaba,
                // se cambia a la escena de transicion y luego a la escena del salon del dia siguiente
                setTimeout(() => {
                    let params = {
                        text: this.gameManager.translate("scene5.startWeek", { ns: "transitions", returnObjects: true }),
                        onComplete: () => {
                            this.UIManager.moveLids(true);
                            this.gameManager.changeScene("Scene5Livingroom");
                        },
                    };
                    this.gameManager.changeScene("TextOnlyScene", params);
                }, 1000);
            });
        });
    }
    
    
}

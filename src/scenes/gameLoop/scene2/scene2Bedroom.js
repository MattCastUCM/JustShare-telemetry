import BaseScene from '../baseScene.js';

export default class Scene2Bedroom extends BaseScene {
    /**
     * Escena base para el salon. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super("Scene2Bedroom", 'Scene2Bedroom');
    }

    create(params) {
        super.create(params)

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'bedroomNightBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);
        
        
        // Lee el archivo de nodos
        let nodes = this.cache.json.get('scene2Bedroom');
        let generalNodes = this.cache.json.get('generalDialogs');

        // Armario
        let closetNode = super.readNodes(nodes, "scene2\\scene2Bedroom", "closet", true);
        super.createInteractiveElement(240, 400, "pointer", 0.3, () => {
            this.dialogManager.setNode(closetNode, []);
        }, false);
        
        // Cama
        let bedNode = super.readNodes(nodes, "scene2\\scene2Bedroom", "bed", true);
        super.createInteractiveElement(790, 550, "pointer", 0.3, () => {
            this.dialogManager.setNode(bedNode, []);
        }, false);
        
        // Ordenador
        let pcNode = super.readNodes(nodes, "scene2\\scene2Bedroom", "computer", true);
        super.createInteractiveElement(1390, 400, "pointer", 0.3, () => {
            // PENDIENTE / TEST
            this.phoneManager.activatePhoneIcon(true);
            let chatName = this.gameManager.translate("textMessages.harasserUsername", { ns: "deviceInfo", returnObjects: true });
            this.phoneManager.phone.addChat(chatName, "harasserPfp");
            this.dialogManager.setNode(pcNode, []);
        }, false);
        

        // Al producirse, aparece el icono del telefono y se recibe un mensaje
        this.dispatcher.add("endConversation", this, () => {
            this.phoneManager.activatePhoneIcon(true);
            // PENDIENTE / TEST
            let chatName = this.gameManager.translate("textMessages.chat2", { ns: "deviceInfo", returnObjects: true });
            let phoneNode = super.readNodes(nodes, "scene2\\scene2Bedroom", "phone", true);
            this.phoneManager.phone.addChat(chatName, "harasserPfp");
            this.phoneManager.phone.setChatNode(chatName, phoneNode);

            this.dialogManager.setNode(null, []);
        })
        
        // Al producirse, se cambian los nodos de la cama y el armario
        this.dispatcher.add("chatEnded", this, () =>{
            bedNode = super.readNodes(generalNodes, "generalDialogs", "bed", true);
            closetNode = super.readNodes(generalNodes, "generalDialogs", "closetNight", true);
        });

        // Al producirse, se hace la animacion de cerrar los ojos
        this.dispatcher.add("sleep", this, () => {
            this.UIManager.closeEyes(() => {
                // Una vez termina la animacion, se introduce un retardo y cuando acaba,
                // se cambia a la escena de transicion y luego a la escena del recreo del dia siguiente
                setTimeout(() => {
                    let sceneName = 'TextOnlyScene';
                    let params = {
                        text: this.gameManager.translate("scene3.startWeek", { ns: "transitions", returnObjects: true }),
                        onComplete: () => {
                            this.UIManager.moveLids(true);
                            this.gameManager.changeScene("Scene3Break");
                        },
                    };
                    this.gameManager.changeScene(sceneName, params);
                }, 1000);
            });
        });
    }

    
}

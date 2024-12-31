import BaseScene from '../../baseScene.js';

export default class Scene6BedroomRouteB extends BaseScene {
    /**
     * Escena base para el salon. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super("Scene6BedroomRouteB", 'Scene6BedroomRouteB');
    }

    create(params) {
        super.create(params)

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'bedroomBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);


        // Lee el archivo de nodos
        let nodes = this.cache.json.get('scene6BedroomRouteB');
        let generalNodes = this.cache.json.get('generalDialogs');


        // PENDIENTE / TEST
        this.phoneManager.activatePhoneIcon(true);

        let chatName = this.gameManager.translate("textMessages.chat2", { ns: "deviceInfo", returnObjects: true });
        this.phoneManager.phone.addChat(chatName, "harasserPfp");

        let phoneNode = super.readNodes(nodes, "scene6\\routeB\\scene6BedroomRouteB", "harasserChat", true);
        this.dialogManager.setNode(phoneNode, []);


        // Armario
        let closetNode = super.readNodes(generalNodes, "generalDialogs", "closet", true);
        super.createInteractiveElement(240, 400, "pointer", 0.3, () => {
            this.dialogManager.setNode(closetNode, []);
        }, false);

        // Cama
        let bedNode = super.readNodes(nodes, "scene6\\routeB\\scene6BedroomRouteB", "bedStart", true);
        super.createInteractiveElement(790, 550, "pointer", 0.3, () => {
            this.dialogManager.setNode(bedNode, []);
        }, false);


        // Al producirse, se cambian los nodos de la cama y el armario
        this.dispatcher.add("harasserChatEnded", this, () => {
            chatName = this.gameManager.translate("textMessages.chat5", { ns: "deviceInfo", returnObjects: true });
            this.phoneManager.phone.addChat(chatName, "unknownPfp");
            phoneNode = super.readNodes(nodes, "scene6\\routeB\\scene6BedroomRouteB", "chat2", true);
            this.phoneManager.phone.setChatNode(chatName, phoneNode);
        });

        this.dispatcher.add("chat2Ended", this, () => {
            chatName = this.gameManager.translate("textMessages.chat6", { ns: "deviceInfo", returnObjects: true });
            this.phoneManager.phone.addChat(chatName, "unknownPfp");
            phoneNode = super.readNodes(nodes, "scene6\\routeB\\scene6BedroomRouteB", "chat3", true);
            this.phoneManager.phone.setChatNode(chatName, phoneNode);
        });

        this.dispatcher.add("chat3Ended", this, () => {
            // PENDIENTE
            chatName = this.gameManager.translate("textMessages.chat1", { ns: "deviceInfo", returnObjects: true });
            this.phoneManager.phone.addChat(chatName, "lauraPfp");
            phoneNode = super.readNodes(nodes, "scene6\\routeB\\scene6BedroomRouteB", "lauraChat", true);
            this.phoneManager.phone.setChatNode(chatName, phoneNode);
        });

        // Al producirse, se cambian los nodos de la cama y el armario
        this.dispatcher.add("lauraChatEnded", this, () => {
            bedNode = super.readNodes(nodes, "scene6\\routeB\\scene6BedroomRouteB", "bed", true);
            closetNode = super.readNodes(nodes, "scene6\\routeB\\scene6BedroomRouteB", "closet", true);

            // Ordenador
            super.createInteractiveElement(1390, 400, "pointer", 0.3, () => {
                // PENDIENTE
            }, false);
        });
    }

}

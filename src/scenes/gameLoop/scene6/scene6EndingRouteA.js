import BaseScene from '../baseScene.js';

export default class Scene6EndingRouteA extends BaseScene {
    /**
     * Escena base para el salon. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super("Scene6EndingRouteA", 'Scene6EndingRouteA');
    }

    create(params) {
        super.create(params)

        // Al producirse, se cambian los dialogos de la cama y el armario
        this.dispatcher.add("end", this, () => {
            if (this.phoneManager.phone.visible) {
                this.phoneManager.togglePhone();
                this.phoneManager.activatePhoneIcon(false);
            }
            
            let params = {
                fadeOutTime: 1000,
            };
            this.gameManager.changeScene("TitleScene", params);
        });
    }

    // Se hace esto porque si se establece un dialogo en la constructora, no funciona el bloqueo del fondo del DialogManager
    onCreate() {
        // Lee el archivo de nodos
        let nodes = this.cache.json.get('scene6EndingRouteA');
        
        setTimeout(() => {
            this.phoneManager.activatePhoneIcon(true);
            this.phoneManager.togglePhone();
            this.phoneManager.bgBlock.disableInteractive();
            this.phoneManager.phone.returnButton.disableInteractive();

            // PENDIENTE
            setTimeout(() => {
                let chatName = this.gameManager.translate("textMessages.chat3", { ns: "deviceInfo", returnObjects: true });
                this.phoneManager.phone.addChat(chatName, "");
                let phoneNode = super.readNodes(nodes, "scene6\\scene6EndingRouteA", "dad", true);
                this.phoneManager.phone.setChatNode(chatName, phoneNode);
            }, 2000);
            
            setTimeout(() => {
                let chatName = this.gameManager.translate("textMessages.chat4", { ns: "deviceInfo", returnObjects: true });
                this.phoneManager.phone.addChat(chatName, "");
                let phoneNode = super.readNodes(nodes, "scene6\\scene6EndingRouteA", "mom", true);
                this.phoneManager.phone.setChatNode(chatName, phoneNode);
            }, 7000);

        }, 1000);
    }
}

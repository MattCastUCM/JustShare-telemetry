import EventDispatcher from "../eventDispatcher.js";
import BaseScene from "../scenes/gameLoop/baseScene.js";

// Variable de nivel de modulo
// - Se puede acceder desde cualquier parte del modulo, pero no es visible
// al no pertenecer a la clase y no ser exportada
// - No cambia con las instancia puesto que no pertenece a la clase, sino
// al modulo y solo existe un modulo

let instance = null;

export default class GameManager {
    /**
    * Maneja el flujo de juego y variables de uso comun
    * @param {Scene} - se necesita una escena para poder acceder al ScenePlugin y cambiar de escena
    */
    constructor(scene) {
        // no deberia suceder, pero por si acaso se hace el new de la clase desde fuera
        if (instance === null) {
            instance = this;
        }
        else {
            throw new Error('GameManager is a Singleton class!');
        }

        // Se necesita una escena para poder acceder al ScenePlugin y cambiar de escena
        // Por lo tanto, se aprovecha para mantener la escena actual
        // El SceneManager tb incluye el cambio de escena, pero no es recomendable segun
        // la docu manejarlo a traves de el
        this.currentScene = scene;
        this.runningScenes = new Set();

        this.i18next = this.currentScene.plugins.get('rextexttranslationplugin');
        this.dispatcher = EventDispatcher.getInstance();

        // Blackboard de variables de todo el juego
        this.blackboard = new Map();

        // Escena de la UI
        this.UIManager = null;
        // Escena del ordenador
        this.computerScene = null;

        // Informacion del usuario
        this.userInfo = null;

        // Dia de la semana. Empieza en 0 porque al iniciarse la escena de la alarma, se va actualizando
        this.day = 0;

        // Configuracion de texto por defecto
        this.textConfig = {
            fontFamily: 'Arial',        // Fuente (tiene que estar precargada en el html o el css)
            fontSize: 25 + 'px',        // Tamano de la fuente del dialogo
            fontStyle: 'normal',        // Estilo de la fuente
            backgroundColor: null,      // Color del fondo del texto
            color: '#ffffff',           // Color del texto
            stroke: '#000000',          // Color del borde del texto
            strokeThickness: 0,         // Grosor del borde del texto 
            align: 'left',              // Alineacion del texto ('left', 'center', 'right', 'justify')
            wordWrap: null,
            padding: null               // Separacion con el fondo (en el caso de que haya fondo)
        }

    }

    // metodo para generar y coger la instancia
    static create(scene) {
        if (instance === null) {
            instance = new GameManager(scene);
        }
        return instance;
    }

    // metodo para generar y coger la instancia
    static getInstance() {
        return this.create();
    }
    


    ///////////////////////////////////////
    /// Metodos para cambiar de escena ///
    //////////////////////////////////////


    // TEST
    startTestScene() {
        this.blackboard.clear();
        this.day = 0;
        this.userInfo = {
            name: "testName",
            gender: "male"    
        }
        this.i18next.changeLanguage("es");
        // IMPORTANTE: Hay que lanzar primero el UIManager para que se inicialice
        // el DialogManager y las escenas puedan crear los dialogos correctamente
        let UIsceneName = 'UIManager';
        this.currentScene.scene.launch(UIsceneName);
        this.UIManager = this.currentScene.scene.get(UIsceneName);

        // Pasa a la escena inicial con los parametros text, onComplete y onCompleteDelay
        let sceneName = 'TextOnlyScene';
        let params = {
            text: this.i18next.t("startingBlackScreen.test", { ns: "testTextOnly", returnObjects: true }),
            onComplete: () => {
                this.changeScene("TestScene", null);
            },
            onCompleteDelay: 500
        };
        
        this.changeScene(sceneName, params);
    }


    /**
     * Metodo para borrar y cerrar todas las escenas activas
     */
    clearRunningScenes() {
        this.runningScenes.forEach(sc => {
            // Si la escena es hija de BaseScene, se tiene que llamar a su shutdown 
            // antes de detener la escena para evitar problemas al borrar los retratos
            if (sc instanceof BaseScene) {
                if (typeof sc.shutdown === 'function') {
                    sc.shutdown();
                }
            }
            sc.scene.stop(sc);
        });
        this.runningScenes.clear();
    }

    /**
    * Metodo para cambiar de escena
    * @param {String} scene - key de la escena a la que se va a pasar
    * @param {Object} params - informacion que pasar a la escena (opcional)
    * @param {Boolean} cantReturn - true si se puede regresar a la escena anterior, false en caso contrario
    */
    changeScene(scene, params, canReturn = false) {
        // Si no se puede volver a la escena anterior, se detienen todas las
        // escenas que ya estaban creadas porque ya no van a hacer falta 
        if (!canReturn) {
            this.clearRunningScenes();
        }
        // Si no, se se duerme la escena actual en vez de destruirla ya que
        // habria que mantener su estado por si se quiere volver a ella
        else {
            this.currentScene.scene.sleep();
        }
        
        // Se inicia y actualiza la escena actual
        this.currentScene.scene.run(scene, params);
        this.currentScene = this.currentScene.scene.get(scene);

        // Se anade la escena a las escenas que estan ejecutandose
        this.runningScenes.add(this.currentScene);
    }

    
    // Tiene los campos: name, username, password, gender
    setUserInfo(userInfo) {
        this.userInfo = userInfo;
        this.blackboard.set("gender", userInfo.gender);
    }
    getUserInfo() {
        return this.userInfo;
    }


    ///////////////////////////////////////
    ///// Metodos para la blackboard /////
    //////////////////////////////////////
    /**
    * Devuelve el valor buscado en la blackboard
    * @param {String} key - valor buscado
    * @param {Map} blackboard - blackboard en la que se busca el valor. Por defecto es la del gameManager 
    * @returns {object} - el objeto buscado en caso de que exista. null en caso contrario
    */
    getValue(key, blackboard = this.blackboard) {
        if (blackboard.has(key)) {
            return blackboard.get(key);
        }
        return null;
    }

    /**
    * Metodo que setea un valor en la blackboard
    * @param {String} key - valor que se va a cambiar
    * @param {Object} value - valor que se le va a poner al valor a cambiar
    * @param {Map} blackboard - blackboard en la que se cambia el valor. Por defecto es la del gameManager 
    * @returns {boolean} - true si se ha sobrescrito un valor. false en caso contrario
    */
    setValue(key, value, blackboard = this.blackboard) {
        let exists = false;
        if (blackboard.has(key)) {
            exists = true;
        }
        blackboard.set(key, value);
        return exists;
    }

    /**
    * Indica si un valor existe o no en la blackboard
    * @param {String} key - valor buscado
    * @param {Map} blackboard - blackboard en la que se busca el valor. Por defecto es la del gameManager
    * @returns {boolean} - true si existe el valor. false en caso contrario
    */
    hasValue(key, blackboard = this.blackboard) {
        return blackboard.has(key);
    }

    /**
     * Modifica el valor de amistad del personaje indicado
     * @param {String} character - personaje al que cambiar el valor de amistad
     * @param {Number} amount - cantidad de amistad que sumarle
     */
    changeFriendship(character, amount) {
        let varName = character + "FS";

        // Si no se encuentra el personaje en la blackboard, se anade con 50 de amistad por defecto
        if (!this.getValue(varName)) {
            this.setValue(varName, 50);
        }

        // Obtiene la cantidad a establecer y la actualiza
        let val = this.getValue(varName)
        val += amount;
        this.setValue(varName, val);

        // Actualiza el valor tambien en la pantalla de relaciones del movil
        this.UIManager.phoneManager.phone.updateRelationShip(character, val);
    }
}
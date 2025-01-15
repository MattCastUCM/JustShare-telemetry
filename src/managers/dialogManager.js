import TextBox from '../UI/dialog/textBox.js';
import OptionBox from '../UI/dialog/optionBox.js';
import GameManager from './gameManager.js';

/*
PARA ARREGLAR NODOS DE EVENTO SI SE sALTAN LOS DIALOGOS:
SEGUN SE VAN LEYENDO LOS EVENTOS, GUARDARLOS EN UNA LISTA.
SEGUN SE VAN PROCESANDO, SACARLOS DE LA LISTA.
SI EL NODO ACTUAL SE VUELVE NULL, PROCESAR EL SIGUIENTE NODO DE LA LISTA

** NO SIRVE (SI HAY EVENTOS EN RAMIFICACIONES, NO SE PUEDE SABER QUE RAMA SE HA ESCOGIDO SI SE QUEDA PILLADO ANTES)
*/

export default class DialogManager {
    /**
    * Gestor de los dialogos. Crea la caja de texto/opciones con su texto y se encarga de actualizarlos.
    * Los nodos de dialogos tienen que estar creados con antelacion (deberia hacerse en la constructora de la escena)
    */
    constructor(scene) {
        this.scene = scene;

        this.gameManager = GameManager.getInstance();
        this.dispatcher = this.gameManager.dispatcher;

        this.textbox = null;                // Instancia de la caja de dialogo
        this.lastCharacter = "";            // Ultimo personaje que hablo
        this.options = [];                  // Cajas de opcion multiple
        this.currNode = null;               // Nodo actual

        this.portraits = new Map();         // Mapa para guardar los retratos en esta escena
        this.portraitsImages = new Map();   // Mapa para guardar las imagenes de los retratos en esta escena

        this.textbox = new TextBox(scene, this);

        this.PORTRAIT_ANIM_TIME = 200;

        // Anade un rectangulo para bloquear la interaccion con los elementos del fondo
        this.bgBlock = scene.add.rectangle(0, 0, this.scene.CANVAS_WIDTH, this.scene.CANVAS_HEIGHT, 0xfff, 0).setOrigin(0, 0);
        this.bgBlock.setDepth(this.textbox.box.depth - 1);
        this.bgBlock.on('pointerdown', () => {
            if (this.textbox.box.input.enabled && this.textbox.box.alpha > 0.9) {
                this.nextDialog();
            }
            else if (this.textbox.box.input.enabled && this.currNode.type === "text") {
                this.setNode(null, this.portraits);
            }
        });

        this.textbox.activate(false);
        this.bgBlock.disableInteractive();
        this.activateOptions(false);
    }


    /**
     * Metodo que elimina de esta escena todos los retratos guardados
     * anteriormente para que no de error al destruir las escenas 
     */
    clearScene() {
        this.portraits.clear();
    }

    /**
    * Metodo que se llama cuando se llama al changeScene de una escena 
    * @param {Phaser.Scene} scene - escena a la que se va a pasar
    */
    changeScene(scene) {
        // Desactiva la caja de texto y las opciones (por si acaso)
        if (this.textbox) {
            this.textbox.activate(false);
        }
        this.activateOptions(false);

        this.portraits.clear();
        // Coge las imagenes de todos los retratos, las copia en esta escena, y las pone detras de la caja de texto
        scene.portraits.forEach((value, key) => {
            value.setAlpha(0);

            let p = this.scene.add.existing(value.img);
            p.setDepth(this.textbox.box.depth - 1)
            this.portraitsImages.set(key, p);
        });
    }

    setPortraits(portraits) {
        // Guarda los retratos de los personajes que participan en el dialogo, los muestra, y se pone que no estan hablando
        this.portraits.clear();
        portraits.forEach((value) => {
            let key = value.getKey()
            this.portraits.set(key, value);
            value.setTalking(false);
            value.activate(true, this.PORTRAIT_ANIM_TIME);
        });
    }

    /**
    * Cambia el texto de la caja
    * @param {String} text - texto a escribir
    * @param {Boolean} animate - si se va a animar el texto o no
    */
    setText(dialogInfo, animate) {
        this.textbox.setText(dialogInfo, animate);
    }

    /**
    * Devuelve si el texto de la caja supera la altura maxima
    * @returns {boolean} - true si la caja supera la altura maxima, false en caso contrario
    */
    textTooBig() {
        return (this.textbox.textTooBig());
    }

    /**
    * Cambia el nodo actual por el indicado
    * @param {DialogNode} node - nodo que se va a poner como nodo actual
    * @param {Map} portraits - mapa con los retratos de los personajes que interactuan en la conversacion 
    */
    setNode(node, portraits, hidePortraits) {
        let animTime = this.PORTRAIT_ANIM_TIME * 2;
        if (portraits.length == 0) {
            animTime = 0;
        }

        if (hidePortraits == null) {
            hidePortraits = true;
        }

        // Si no hay ningun dialogo/nodo activo y el nodo a poner es valido
        if (!this.isTalking() && node != null) {
            this.setPortraits(portraits);

            // Desactiva la caja de texto y las opciones (por si acaso)
            if (this.textbox) {
                this.textbox.activate(false);
                this.bgBlock.disableInteractive();
            }
            this.activateOptions(false);

            // Cambia el nodo por el indicado (despues de que hayan aparecido los personajes)
            setTimeout(() => {
                this.currNode = node;
                this.lastCharacter = null;
                this.processNode(node);
            }, animTime);
        }
        else {
            // Se resetea la configuracion del texto de la caja por si se habia cambiado a la de por defecto
            this.currNode = null;
            this.textbox.resetTextConfig();
            this.textbox.activate(false);
            
            this.portraits.forEach((value) => {
                let key = value.getKey()
                this.portraits.set(key, value);
                value.setTalking(false, this.PORTRAIT_ANIM_TIME);
            });
            
            if (hidePortraits) {
                // Desactiva los personajes (despues de que haya desaparecido la caja de texto)
                setTimeout(() => {
                    this.portraits.forEach((value) => {
                        value.activate(false, this.PORTRAIT_ANIM_TIME);
                    });
                    this.bgBlock.disableInteractive();
                }, animTime);
            }
            else {
                this.bgBlock.disableInteractive();
            }
        }
    }

    /**
     * Procesa el nodo de condicion que se le pase como parametro
     * @param {DialogNode} node - Nodo a procesar 
     * @returns {Number} - indice del siguiente nodo
     */
    processConditionNode(node) {
        let conditionMet = false;
        let i = 0;

        // Recorre todas las condiciones hasta que se haya cumplido la primera
        while (i < node.conditions.length && !conditionMet) {
            let allConditionsMet = true;
            let j = 0;

            // Se recorren todas las variables de la condicion mientras se cumplan todas
            while (j < node.conditions[i].length && allConditionsMet) {
                // Coge el nombre de la variable, el operador y el valor esperado 
                let variable = node.conditions[i][j].key;
                let operator = node.conditions[i][j].operator;
                let expectedValue = node.conditions[i][j].value;

                // Busca el valor de la variable en la blackboard indicada. 
                // Si no es valida, buscara por defecto en el gameManager
                let variableValue = this.gameManager.getValue(variable, node.conditions[i][j].blackboard);
                // console.log(variable + " " + variableValue);

                if (operator === "equal") {
                    conditionMet = variableValue === expectedValue;
                }
                else if (operator === "greater") {
                    conditionMet = variableValue >= expectedValue;

                }
                else if (operator === "lower") {
                    conditionMet = variableValue <= expectedValue;

                }
                else if (operator === "different") {
                    conditionMet = variableValue !== expectedValue;
                }
                // Se habran cumplido todas las condiciones si todas las condiciones
                // se han cumplido anteriormente y esta tambien se ha cumplido
                allConditionsMet &= conditionMet;

                j++;
            }

            // Si no se ha cumplido ninguna condicion, pasa a la siguiente
            if (!conditionMet) i++;
        }
        return i;
    }

    /**
     * Procesa el nodo de evento que se le pasa como parametro
     * @param {DialogNode} node - nodo a procesar 
     */
    processEventNode(node) {
        // Recorre todos los eventos del nodo y les hace dispatch con el delay establecido (si tienen)
        for (let i = 0; i < node.events.length; i++) {
            let evt = node.events[i];
            
            let delay = 0
            if (evt.delay) {
                delay = evt.delay;
            }
            setTimeout(() => {
                this.dispatcher.dispatch(evt.name, evt);

                // Si el evento establece el valor de una variable, lo cambia en la 
                // blackboard correspondiente (la de la escena o la del gameManager)
                let blackboard = this.gameManager.blackboard;
                if (evt.global !== undefined && evt.global === false) {
                    blackboard = evt.blackboard;
                }
                if (evt.variable && evt.value !== undefined) {
                    this.gameManager.setValue(evt.variable, evt.value, blackboard);
                }
            }, delay);
        }
    }
    
    // Procesa el nodo actual dependiendo de su tipo
    processNode() {
        // Si el nodo actual es valido
        if (this.currNode) {
            let delay = 0;
            if (this.currNode.nextDelay != null) {
                delay = this.currNode.nextDelay;
            }

            this.bgBlock.setInteractive();

                if (this.currNode.type === "condition") {
                    let i = this.processConditionNode(this.currNode);
                    // El indice del siguiente nodo sera el primero que cumpla una de las condiciones
                    this.currNode = this.currNode.next[i];
                    // Pasa al siguiente nodo
                    this.processNextNode(delay);
                }
                else if (this.currNode.type === "choice") {
                    // Si el personaje anterior esta en el mapa de retratos, se oscurece
                    if (this.portraits.get(this.lastCharacter)) {
                        this.portraits.get(this.lastCharacter).setTalking(false, this.PORTRAIT_ANIM_TIME);
                        this.lastCharacter = "";
                    }
    
                    this.createOptions(this.currNode.choices);
                    this.activateOptions(true);
                }
                else if (this.currNode.type === "text") {
                    // Si el nodo no tiene texto, se lo salta y pasa al siguiente nodo
                    // IMPORTANTE: DESPUES DE UN NODO DE DIALOGO SOLO HAY UN NODO, POR LO QUE 
                    // EL SIGUIENTE NODO SERA EL PRIMER NODO DEL ARRAY DE NODOS SIGUIENTES
                    if (this.currNode.dialogs[this.currNode.currDialog].text.length < 1) {
                        this.currNode = this.currNode.next[0];
                        this.processNextNode(delay);
                    }
                    else {
                        // Funcion a ejecutar para mostrar la caja. Actualiza el retrato y el texto y activa la caja
                        let showBox = () => {
                            this.textbox.centerText(this.currNode.centered);
                            this.setText(this.currNode.dialogs[this.currNode.currDialog], true);
                            this.textbox.activate(true);
                        }
                        
                        // Si el ultimo personaje que hablo es distinto del que habla ahora, se oculta la caja y luego se muestra
                        if (this.currNode.character !== this.lastCharacter) {
                            // Si el personaje anterior esta en el mapa de retratos, se oscurece
                            if (this.portraits.get(this.lastCharacter)) {
                                this.portraits.get(this.lastCharacter).setTalking(false, this.PORTRAIT_ANIM_TIME);
                            }
    
                            // Si el personaje actual esta en el mapa de retratos, se aclara
                            if (this.portraits.get(this.currNode.character)) {
                                this.portraits.get(this.currNode.character).setTalking(true, this.PORTRAIT_ANIM_TIME);
                            }
    
    
                            this.textbox.activate(false, () => {
                                showBox();
                            }, 0);
                        }
                        // Si no, se muestra directamente. Si la caja ya estaba activa, no vuelve a mostrarla
                        else {
                            showBox();
                        }
                    }
                }
                else if (this.currNode.type === "event") {
                    this.processEventNode(this.currNode);
    
                    // IMPORTANTE: DESPUES DE UN NODO DE EVENTO SOLO HAY UN NODO, POR LO QUE 
                    // EL SIGUIENTE NODO SERA EL PRIMER NODO DEL ARRAY DE NODOS SIGUIENTES
                    this.currNode = this.currNode.next[0];
    
                    this.processNextNode(delay);
                }
                else if (this.currNode.type === "chatMessage") {
                    if (this.currNode.phone) {
                        this.scene.phoneManager.phone.setChatNode(this.currNode.chat, this.currNode);
                    }
                    else {
                        this.gameManager.computer.socialMediaScreen.setChatNode(this.currNode.chat, this.currNode);   
                    }
                    this.bgBlock.disableInteractive();
                }
                else if (this.currNode.type === "commentary") {
                    this.gameManager.computer.socialMediaScreen.setCommentaryNode(this.currNode.post, this.currNode);
                    this.bgBlock.disableInteractive();
                } 
        }
        // Se ha acabado el dialogo o se ha pasado un nodo invalido
        else {
            this.setNode(null, this.portraits);
        }
    }

    // Pasa al siguiente dialogo
    // (llamado al hacer click en la caja de texto)
    nextDialog() {
        if (this.currNode.type === "text") {
            // Si aun no ha acabado de mostrarse todo el texto, lo muestra de golpe
            if (!this.textbox.finished) {
                this.textbox.forceFinish();
            }
            // Si ha acabado de mostrarse todo el dialogo
            else {
                // Actualiza el dialogo que se esta mostrando del nodo actual
                this.currNode.currDialog++;
                // Si aun no se han mostrado todos los dialogos del nodo, muestra el siguiente dialogo
                if (this.currNode.currDialog < this.currNode.dialogs.length) {
                    this.setText(this.currNode.dialogs[this.currNode.currDialog], true);
                }
                // Si ya se han mostrado todos los dialogos
                else {
                    let delay = 0;
                    if (this.currNode.nextDelay != null) {
                        delay = this.currNode.nextDelay;
                    }

                    // Actualiza el ultimo personaje que ha balado
                    this.lastCharacter = this.currNode.character;

                    // Se reinicia el dialogo del nodo actual y actualiza el nodo al siguiente
                    // IMPORTANTE: DESPUES DE UN NODO DE DIALOGO SOLO HAY UN NODO, POR LO QUE 
                    // EL SIGUIENTE NODO SERA EL PRIMER NODO DEL ARRAY DE NODOS SIGUIENTES
                    this.currNode.currDialog = 0;
                    this.currNode = this.currNode.next[0];
                    this.processNextNode(delay);
                }
            }

        }
    }

    processNextNode(delay) {
        setTimeout(() => {
            this.processNode();
        }, delay);
    }

    /**
    * Crea las opciones de eleccion multiple
    * @param {Array} opts - array con los strings/opciones a mostrar
    */
    createOptions(opts) {
        // Limpia las opciones que hubiera anteriormente
        for (let i = 0; i < this.options.length; i++) {
            this.options[i].activate(false);
        }
        this.options = [];

        // Crea las opciones y las guarda en el array
        for (let i = 0; i < opts.length; i++) {
            this.options.push(new OptionBox(this.scene, this, i, opts.length, opts[i].text));
        }

    }

    /**
    * Activa/desactiva las cajas de opcion multiple
    * @param {Boolean} active - si se van a activar o no las opciones
    * @param {Function} onComplete - funcion a la que llamar cuando acabe la animacion
    * @param {Number} delay - tiempo en ms que tarda en llamarse a onComplete
    */
    activateOptions(active, onComplete = {}, delay = 0, instant = false) {
        // Dependiendo de si es instantaneo o no, se ocultan las opciones con animacion o sin ella. 
        // Oculta primero la caja de texto por si acaso y luego muestra las opciones
        this.textbox.activate(false, () => {
            for (let i = 0; i < this.options.length; i++) {
                if (instant) {
                    this.options[i].box.visible = active;
                    this.options[i].text.visible = active;
                }
                else {
                    this.options[i].activate(active);
                }
            }

            // Si la funcion es valida, se ejecuta con el retardo indicado
            if (onComplete !== null && typeof onComplete === 'function') {
                setTimeout(() => {
                    onComplete();
                }, delay);
            }
        });
    }

    /**
    * Elige la opcion sobre la que se ha hecho click (llamado desde la instancia correspondiente de OptionBox)
    * @param {Number} index - indice elegido
    */
    selectOption(index) {
        // Desactiva las opciones
        this.activateOptions(false);

        let next = this.currNode.next[index];

        // Si la opcion no se puede elegir de nuevo, elimina tanto la opcion
        // como el nodo al que lleva de sus arrays correspondientes
        if (!this.currNode.choices[index].repeat) {
            this.currNode.choices.splice(index, 1);
            this.currNode.next.splice(index, 1);
        }

        // Actualiza el nodo actual y lo procesa            
        this.currNode.selectedOption = index;
        this.currNode = next;

        let delay = 0;
        if (this.currNode && this.currNode.nextDelay != null) {
            delay = this.currNode.nextDelay;
        }
        this.processNextNode(delay);
    }

    /**
    * Metodo para comprobar si un dialogo esta activo o no
    * @returns {boolean} - true si hay un dialogo activo, false en caso contrario
    */
    isTalking() {
        return this.textbox.box.visible && this.textbox.box.alpha > 0 && this.currNode != null;
    }
}
import TrackerEvent from "./trackerEvent.js";
import Accesible from "./accessible.js"
import Alternative from "./alternative.js"
import Completable from "./completable.js";
import GameObject from "./gameObject.js";
import Verb from './verb.js'
import Object from "./object.js";
import Context from "./context.js";
import Result from "./result.js";


export default class Tracker {
    constructor(lrs, actor, batchLength = 3, batchTimeout = 180000) {
        this.pendingQueue = [];
        this.sendingQueue = [];

        this.lrs = lrs;
        this.actor = actor;
        this.context = new Context('https://w3id.org/xapi/seriousgame');

        this.batchLength = batchLength;
        this.batchTimeout = batchTimeout;

        this.accesible = new Accesible(this);
        this.alternative = new Alternative(this);
        this.completable = new Completable(this);
        this.gameObject = new GameObject(this);
        this.sending = false;

        window.addEventListener('beforeunload', () => {
            this.close();
        });

        this.timer = null;
        this.resetTimer();

        // TRACKER EVENT
        // console.log("Inicio de sesion") 
        this.completable.initialized(this.completable.types.level, "Session");
    }

    resetTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            this.timer = null;
            this.sendEvents();
        }, this.batchTimeout);
    }

    close() {
        // TRACKER EVENT
        console.log("Cierre de sesion") 
        this.completable.completed(this.completable.types.level, "Session");

        while (this.sending && this.pendingQueue.length > 0) {
            console.log("Waiting for pending events to be sent before closing...");
        }

        this.sendEvents();

        // Se cierra la sesion para que el usuario tenga que volvera a iniciarla
        this.lrs.logout();
    }

    // Valida los parámetros de un evento
    validateParams(params) {
        const REQUIRED = ['verb', 'object'];
        return REQUIRED.every(f => params.hasOwnProperty(f));
    }

    // Agregar un evento a la cola
    addEvent(params) {
        if (this.validateParams(params)) {
            let eventParams = {
                actor: this.actor,
                verb: new Verb(params.verb),
                object: new Object(params.object),
                context: this.context
            }
            if (params.result) {
                eventParams.result = new Result(params.result);
            }

            let event = new TrackerEvent(eventParams);
            this.pendingQueue.push(event);
            if (this.pendingQueue.length >= this.batchLength) {
                this.sendEvents();
            }
        }
    }

    async sendEvents() {
        this.resetTimer();

        if (!this.sending && this.pendingQueue.length > 0) {
            this.sendingQueue.push(...this.pendingQueue);
            this.pendingQueue = [];

            try {
                console.log(`Sending ${this.sendingQueue.length} events`);
                let response = await this.lrs.saveStatements(this.sendingQueue);
                this.sendingQueue = [];
                return response;
            }
            catch (error) {
                console.error(error.message);
            }
            finally {
                this.sending = false;
            }
        }
    }
}

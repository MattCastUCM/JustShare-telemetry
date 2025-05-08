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
    constructor(lrs, actor, batchLength = 10, batchTimeout = 1000, debug = true) {
        this.queue = [];

        this.lrs = lrs;
        this.actor = actor;
        this.context = new Context('https://w3id.org/xapi/seriousgame');

        this.batchLength = batchLength
        this.batchTimeout = batchTimeout

        this.debug = debug

        this.accesible = new Accesible(this);
        this.alternative = new Alternative(this);
        this.completable = new Completable(this);
        this.gameObject = new GameObject(this);
    }

    // Valida los parámetros de un evento.
    validateParams(params) {
        const REQUIRED = ['verb', 'object'];
        return REQUIRED.every(f => params.hasOwnProperty(f));
    }

    /**
     * Añade un evento a la cola.
     * @param {TrackerEvent} event Evento a añadir.
     */
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
            this.queue.push(event);
            if (this.queue.length >= this.batch_size) {
                if (this.debug) {
                    this.sendEvents();
                }
            }
        }
    }

    async sendEventsInternal() {
        try {
            let data = await this.lrs.saveStatements(this.queue)
            this.queue = []
            return data
        }
        catch (error) {
            console.error(error.message)
        }
    }

    // Envía los eventos guardados a una lrs.
    sendEvents() {
        this.sendEventsInternal()
    }
}

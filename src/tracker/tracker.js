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
    constructor(lrs, actor, batchLength = 10, batchTimeout = 1000) {
        this.queue = [];

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
            this.closed();
        });

        this.timer = null;
        this.createTimer();
    }

    createTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            this.timer = null;
            this.sendEvents();
        }, this.batchTimeout);
    }

    closed() {
        while (this.sending) { }
        this.sendEvents();
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
            this.queue.push(event);
            if (this.queue.length >= this.batch_size) {
                this.sendEvents();
            }
        }
    }

    // Envía los eventos guardados a una lrs
    async sendEvents() {
        this.createTimer();
        let length = this.queue.length;
        if (!this.sending && length > 0) {
            this.sending = true;
            try {
                let data = await this.lrs.saveStatements(this.queue.slice(0, length));
                this.queue.splice(0, length);
                return data;
            }
            catch (error) {
                console.error(error.message);
            }
            this.sending = false;
        }
    }
}

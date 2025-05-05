import TrackerEvent from "./trackerEvent.js";
import Accesible from "./accessible.js"
import Alternative from "./alternative.js"
import Completable from "./completable.js";
import GameObject from "./gameObject.js";
import Accessible from "./accessible.js"
import Alternative from "./alternative.js"
import { Verb, Object, Context, Result } from './parameters.js'

const MAX_TRACKER_EVENTS = 10;
const MAX_TRACKER_IDLE_TIME = 10; // s

export default class Tracker {
    constructor(lrs, actor) {
        this.queue = [];
        this.lrs = lrs;
        this.actor = actor;

        this.context = new Context('https://w3id.org/xapi/seriousgame');

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
        if(this.validateParams(params)) {
            let eventParams = {
                actor: this.actor,
                verb: new Verb(params.verb),
                object: new Object(params.object),
                context: this.context
            }
            if(params.result) {
                eventParams.result = new Result(params.result);
            }

            let event = new TrackerEvent(eventParams);
            this.queue.push(event);
            if(this.queue.length >= MAX_TRACKER_EVENTS) {
                this.sendEvents();
            }
        }
    }

    // Envía los eventos guardados a una lrs.
    sendEvents() {
        this.lrs.saveStatements(this.queue, (data) => {
            this.queue = [];
            console.log(data)
        }, error => console.log(error.message));
    }
}

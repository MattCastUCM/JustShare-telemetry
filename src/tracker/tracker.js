import TrackerEvent from "./trackerEvent";
import LRS from "./lrs";

const MAX_TRACKER_EVENTS = 10;
const MAX_TRACKER_IDLE_TIME = 10; // s

export default class Tracker {
    constructor(lrs, actor) {
        this.queue = [];
        this.lrs = lrs;
        this.actor = actor;
    }

    // Valida los parámetros de un evento.
    validateParams(params) {
        const REQUIRED = ['verb', 'object', 'id'];
        return REQUIRED.every(f => params.hasOwnProperty(f));
    }

    /**
     * Añade un evento a la cola.
     * @param {TrackerEvent} event Evento a añadir.
     */
    addEvent(event) {
        if(this.validateParams(event)) {
            event.actor = this.actor;
            this.queue.push(event);
            if(this.queue.length >= MAX_TRACKER_EVENTS) {
                this.sendEvents();
            }
        }
    }

    // Envía los eventos guardados a una lrs.
    sendEvents() {
        this.lrs.saveStatements(this.queue);
        this.queue = [];
    }
}

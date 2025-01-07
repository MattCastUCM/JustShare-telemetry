import Post from "./post.js";
import ListViewHit from "../UI/listView/listViewHit.js";

export default class FeedPost extends Post {
    constructor(socialMediaScreen, pfp, username, bioId, picture, width, messageOnClick, heartOnClick, likes = 0) {
        super(socialMediaScreen, 0, 0, pfp, username, bioId, picture, width, 'messageIcon', messageOnClick, heartOnClick, likes)

        this.hits = []

        this.init()
    }

    init() {
        super.init()

        // Propiedades
        let bounds = this.getBounds()
        this.h = bounds.height
    }

    addHit(animTarget, onClick) {
        let hit = new ListViewHit(this.scene, animTarget)
        this.hits.push(hit)
        this.scene.turnIntoButtonSizeAnim(animTarget, hit, onClick)
    }
}
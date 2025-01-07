import Post from "./post.js";
import VerticalListView from "../UI/listView/verticalListView.js";
import TextHeader from "./textHeader.js";

export default class SelectedPost extends Post {
    constructor(socialMediaScreen, x, y, pfp, username, bioId, picture, width, zoneBottomY, messageOnClick, heartOnClick, likes = 0) {
        super(socialMediaScreen, x, y, pfp, username, bioId, picture, width, 'messageIconFilled', messageOnClick, heartOnClick, likes)

        this.zoneBottomY = zoneBottomY

        this.init()
    }

    init() {
        super.init()

        let bounds = this.getBounds()

        const ZONE_OFFSET_Y = 25
        const ZONE_Y = this.messageContainer.y + this.messageContainer.height + ZONE_OFFSET_Y
        const ZONE_HEIGHT = this.zoneBottomY - (ZONE_Y + this.y)
        
        this.createZone(this.textHeader.profilePicture.x, ZONE_Y, bounds.width, ZONE_HEIGHT)

        const COMMENTARIES_OFFSET_Y = 15
        const COMMENTARIES_Y = this.sendComment.y + this.sendComment.displayHeight + COMMENTARIES_OFFSET_Y
        const COMMENTARIES_HEIGHT = this.zoneBottomY - (COMMENTARIES_Y + this.y)

        this.createCommentaries(this.sendComment.x, COMMENTARIES_Y, 
            bounds.width, COMMENTARIES_HEIGHT)
    }

    createZone(x, y, width, height) {
        const ZONE_ARC = 25

        const SEND_OFFSET_Y = 25

        let zone = this.scene.add.graphics();

        zone.fillStyle(this.scene.colors.blue0.hex.get0x, 1)
        zone.fillRoundedRect(x, y, width, height, { tl: ZONE_ARC, tr: ZONE_ARC, bl: 0, br: 0 });
        this.add(zone)

        let sendComment = this.scene.add.image(x + width / 2, y + SEND_OFFSET_Y, 'sendComment')
        sendComment.setScale(0.95)
        sendComment.setOrigin(0.5, 0)
        this.add(sendComment)
        this.scene.turnIntoButtonColorAnim(sendComment, sendComment, null)

        this.sendComment = sendComment
    }

    createCommentaries(x, y, width, height) {
        const PADDING = 10
        const END_PADDING = 15

        let listView = new VerticalListView(this.scene, x, y,
            1, PADDING, { width: width, height: height }, null, false, END_PADDING, false);
        this.add(listView)

        listView.init()

        // Test
        let commentary = new TextHeader(this.socialMediaScreen, this.params.width, this.params.pfp, 
            this.params.username, this.params.bioId, 0.85)
        listView.addLastItem(commentary)

        commentary = new TextHeader(this.socialMediaScreen, this.params.width, this.params.pfp, 
            this.params.username, this.params.bioId, 0.85)
        listView.addLastItem(commentary)

        commentary = new TextHeader(this.socialMediaScreen, this.params.width, this.params.pfp, 
            this.params.username, this.params.bioId, 0.85)
        listView.addLastItem(commentary)
    }

    addHit(animTarget, onClick) {
        this.scene.turnIntoButtonSizeAnim(animTarget, animTarget, onClick)
    }
}
import VerticalListView from '../UI/listView/verticalListView.js';
import DualPost from './dualPost.js';
import BaseScreen from './baseScreen.js'
import DirectChat from './directChat.js';
import DirectMessage from './directMessage.js';

export default class SocialMediaScreen extends BaseScreen {
    constructor(scene) {
        super(scene, 'socialMedia')

        this.FIRST_LINE_X = 467
        this.SECOND_LINE_X = 1046
        this.FEED_WIDTH = (this.SECOND_LINE_X - this.FIRST_LINE_X)
        this.FEED_CENTER_X = this.FIRST_LINE_X + this.FEED_WIDTH / 2

        this.TOP_BAR_BOTTOM_Y = 111
        this.FEED_HEIGHT = 629
        this.TASK_BAR_TOP_Y = this.TOP_BAR_BOTTOM_Y + this.FEED_HEIGHT

        this.DM_TITLE_HEIGHT = 55
        this.DM_TITLE_BOTTOM_Y = this.TOP_BAR_BOTTOM_Y + this.DM_TITLE_HEIGHT
        this.DM_TITLE_CENTER_Y = this.DM_TITLE_BOTTOM_Y - this.DM_TITLE_HEIGHT / 2
        this.DM_ZONE_HEIGHT = this.TASK_BAR_TOP_Y - this.DM_TITLE_BOTTOM_Y
        this.DM_ZONE_WIDTH = 307
        this.DM_ZONE_CENTER_X = this.SECOND_LINE_X + this.DM_ZONE_WIDTH / 2

        this.selectedPosts = new Map();
        this.chats = new Map();

        // Feed
        this.feedListView = this.createFeed(this.FEED_CENTER_X, this.TOP_BAR_BOTTOM_Y, this.FEED_WIDTH, 
            this.FEED_HEIGHT, this.POST_WIDTH)

        this.addPost(1, 'unknownPfp', "Manuel", "Hola, mi nombre es juan, mucho gusto en conocerte uwu", 'loadscreen')

        // Mensajes directos
        this.createDirectMessageTitle(this.DM_ZONE_CENTER_X, this.DM_TITLE_CENTER_Y, [0.5, 0.5])

        this.dmZone = this.createDmZone(this.DM_ZONE_CENTER_X, this.DM_TITLE_BOTTOM_Y, 
            this.DM_ZONE_WIDTH, this.DM_ZONE_HEIGHT)

        this.addChat(1, "unknownPfp", "Js232")
    }

    addChat(id, pfp, username) {
        const DIRECT_MESSAGE_HEIGHT = 80

        if(!this.chats.has(id)) {        
            let directChat = new DirectChat(this, this.FEED_CENTER_X, this.TOP_BAR_BOTTOM_Y, pfp, username, 
                [this.FEED_WIDTH, this.FEED_HEIGHT], [this.DM_ZONE_WIDTH, DIRECT_MESSAGE_HEIGHT])
                
            this.add(directChat.chat)

            this.chats.set(id, directChat.chat)

            this.dmZone.addLastItem(directChat.dm, directChat.dm.hits)
        }
    }

    createDirectMessageTitle(x, y, origin = [0, 0]) {
        let style = { ...this.scene.style }
        style.color = this.scene.colors.white.hex.getNumberSign
        style.fontSize = '28px'

        let translation = this.translate("Mensajes")

        let title = this.scene.add.text(x, y, translation, style);
        title.setOrigin(origin[0], origin[1])

        this.add(title)
    }

    createDmZone(x, y, width, height) {
        let listView = new VerticalListView(this.scene, x, y,
            1, 0, { width: width, height: height }, null, true);

        this.add(listView)

        return listView
    }

    createFeed(x, y, width, height) {
        const PADDING = 50
        const END_PADDING = 20

        let listView = new VerticalListView(this.scene, x, y,
            1, PADDING, { width: width, height: height }, null, true, END_PADDING, false);

        this.add(listView)

        return listView
    }

    addPost(id, pfp, username, bioId, picture) {
        const POST_WIDTH = 430
        const SELECTED_POST_OFFSET_Y = 10

        if(!this.selectedPosts.has(id)) {            
            let post = new DualPost(this, this.FEED_CENTER_X, this.TOP_BAR_BOTTOM_Y + SELECTED_POST_OFFSET_Y, pfp, username,
                bioId, picture, POST_WIDTH, this.TASK_BAR_TOP_Y)
                
            this.selectedPosts.set(id, post.selected)

            this.add(post.selected)
            
            this.feedListView.addLastItem(post.feed, post.feed.hits)
        }
    }

    setSelectedPostsVisible(enable) {
        this.selectedPosts.forEach((value, key) => {
            value.setVisible(enable)
        });
    }

    setFeedVisible(enable) {
        this.feedListView.setVisible(enable)
    }

    setFeedAndPostsVisible(enable) {
        this.setFeedVisible(enable)
        this.setSelectedPostsVisible(enable)
    }

    createImageWithSideText(x, y, img, transId, scale = 1) {
        let container = this.scene.add.container(x, y)

        let image = this.scene.add.image(0, 0, img)
        image.setOrigin(0, 0)
        container.add(image)

        const TEXT_OFFSET_X = 12

        let style = { ...this.scene.style }
        style.fontSize = '37px'

        let translate = this.scene.translate(transId)
        let text = this.scene.add.text(image.displayWidth + TEXT_OFFSET_X, image.displayHeight / 2, translate, style);
        text.setOrigin(0, 0.5);
        container.add(text)

        container.setScale(scale)

        // Propiedades
        let bounds = container.getBounds()
        container.setSize(bounds.width, bounds.height)

        this.centerContainerItems(container, 0, bounds.width / 2, 0, bounds.height / 2)

        return container
    }

    centerContainerItems(container, oldCenterX, newCenterX, oldCenterY, newCenterY) {
        // Centrar elmentos
        let diffX = oldCenterX - newCenterX;
        let diffY = oldCenterY - newCenterY

        container.list.forEach((item) => {
            item.x += diffX / container.scale
            item.y += diffY / container.scale
        });
    }
}
import DirectMessage from "./directMessage.js"
import Chat from "./chat.js"

export default class DirectChat {
    constructor(socialMediaScreen, x, y, pfp, username, feedDims, dmZoneDims) {

        this.chat = new Chat(socialMediaScreen, x, y, pfp, username, feedDims[0], feedDims[1])
        
        this.dm = new DirectMessage(socialMediaScreen, pfp, username, dmZoneDims[0], dmZoneDims[1], () => {
            socialMediaScreen.setFeedAndPostsVisible(false)
            this.setChatVisible(true)
            this.dm.clearNotifications()
        })

        this.setChatVisible(false)
    }

    addMessage(text, character, name) {
        if(!this.chat.visible && character != "player") {
            this.dm.addNotification()
        }
        this.chat.addMessage(text, character, name)
    }

    setChatVisible(enable) {
        this.chat.setVisible(enable)
    }
}
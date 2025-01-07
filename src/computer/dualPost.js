import SelectedPost from "./selectedPost.js"
import FeedPost from "./feedPost.js"

export default class DualPost {
    constructor(socialMediaScreen, x, y, pfp, username, bioId, picture, width, zoneBottomY) {
        this.socialMediaScreen = socialMediaScreen
        this.scene = socialMediaScreen.scene

        let likes = this.scene.getRandomInt(0, 10)

        this.selected = new SelectedPost(socialMediaScreen, x, y, pfp, username, bioId, picture, width, zoneBottomY, likes)
        this.feed = new FeedPost(socialMediaScreen, pfp, username, bioId, picture, width, likes)

        this.selected.setMessageIconOnClick(() => {
            this.showSelectedPost(false)
        })
        this.selected.setHeartIconOnClick(() => {
            this.feed.toggleLike()
        })

        this.feed.setMessageIconOnClick(() => {
            this.showSelectedPost(true)
        })
        this.feed.setHeartIconOnClick(() => {
            this.selected.toggleLike()
        })

        this.selected.setVisible(false)
    }

    showSelectedPost(enable) {
        this.socialMediaScreen.setFeedVisible(!enable)
        this.selected.setVisible(enable)
    }

    setVisible(enable) {
        this.selected.setVisible(enable)
        this.feed.setVisible(enable)
    }
}
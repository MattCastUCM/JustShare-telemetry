export default class TextHeader extends Phaser.GameObjects.Container {
    constructor(socialMediaScreen, width, pfp, username, bioId, scale = 1) {
        super(socialMediaScreen.scene, 0, 0)

        this.scene.add.existing(this)

        this.socialMediaScreen = socialMediaScreen

        const NAME_OFFSET_X = 10
        const BIO_OFFSET_Y = 10

        this.profilePicture = this.createProfilePicture(0, 0, pfp)
        
        this.name = this.createName(this.profilePicture.displayWidth + NAME_OFFSET_X, this.profilePicture.y, username, [0, 0.5]) 
        
        this.bio = this.createBio(this.name.x, this.name.y + this.name.displayHeight / 2 + BIO_OFFSET_Y, width, bioId)

        this.setScale(scale)

        let bounds = this.getBounds()
        this.h = bounds.height

        // Centrar elmentos
        this.socialMediaScreen.centerContainerItems(this, 0, bounds.width / 2, 0, -this.name.displayHeight / 2)
    }

    createProfilePicture(x, y, pfp, origin = [0, 0]) {
        let profilePicture = this.scene.add.image(x, y, pfp)
        profilePicture.setOrigin(origin[0], origin[1])
        profilePicture.setScale(0.9)
        this.add(profilePicture)

        return profilePicture
    }

    createName(x, y, username, origin = [0, 0]) {
        let style = { ...this.scene.style }
        style.fontSize = '25px'

        // let translate = this.socialMediaScreen.translate(nameId)
        let name = this.scene.add.text(x, y, username, style);
        name.setOrigin(origin[0], origin[1]);
        this.add(name)

        return name
    }

    createBio(x, y, width, bioId, origin = [0, 0]) {
        let style = { ...this.scene.style }
        style.fontSize = '23px';
        style.wordWrap = {
            width: width,
            useAdvancedWrap: true 
        }

        let translate = this.socialMediaScreen.translate(bioId)
        let bio = this.scene.add.text(x, y, translate, style);
        bio.setOrigin(origin[0], origin[1]);
        this.add(bio)

        let debug = this.scene.sys.game.debug;
        if(debug.enable) {
            let rect = this.scene.add.rectangle(bio.x, bio.y, width, bio.displayHeight, debug.color);
            rect.alpha = 0.5
            rect.setOrigin(bio.originX, bio.originY);
            this.add(rect)
        }

        return bio
    }
}
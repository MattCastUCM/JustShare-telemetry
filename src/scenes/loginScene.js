
import ComputerBaseScene from './computerBaseScene.js'
import TextInput from '../UI/textInput.js'
import RadioButtonGroup from '../UI/radioButtonGroup.js'
import CheckBox from '../UI/checkbox.js'

export default class LoginScene extends ComputerBaseScene {
    /**
     * Pantalla principal
     * @extends Phaser.Scene
     */
    constructor() {
        super("LoginScene", "loginScene", null)
    }
    
    create() {
        super.create();
        
        const MAX_NAME_CHARS = 10;
        const X = this.CANVAS_WIDTH / 3;
        const Y = 2.55 * this.CANVAS_HEIGHT / 7;
        const OFFSET_X = 70;
        const OFFSET_Y = 20;
        let style = { ...this.config.style };
        style.fontSize = '50px';
        style.fontFamily = this.config.fontFamilyBlack;

        // Texto de error si alguno de los parametros es incorrecto
        let errorStyle = { ...this.config.style };
        errorStyle.fontSize = '30px';
        errorStyle.color = '#ff0000';

        let container = this.add.container(X, Y);

        let contNameInput = this.createNameInputBox(0, 0, style, errorStyle);
        container.add(contNameInput);

        let contGender = this.createGenderOptions(OFFSET_X, contNameInput.h * 1.25 + OFFSET_Y, style, errorStyle,
            'genderBoxes', true);
        container.add(contGender);

        let contSexuality = this.createGenderOptions(OFFSET_X, contGender.y + contGender.h + OFFSET_Y, style, errorStyle,
            'sexualityBoxes', false);
        container.add(contSexuality);

        let acceptButton = this.createButton(0, contSexuality.y + contSexuality.h + OFFSET_Y * 1.5, "acceptButton", 0.8, () => {
            let errors = this.handleErrors(contNameInput, contGender, contSexuality, MAX_NAME_CHARS);
            if(!errors) {
                let harasserGender = ""
                if(contSexuality.boxes[0].checkBox.checked && contSexuality.boxes[1].checkBox.checked) {
                    harasserGender = this.getRandomInt(2) === 0 ? "male" : "female"
                }
                else if(contSexuality.boxes[0].checkBox.checked) {
                    harasserGender = "male"
                }
                else if(contSexuality.boxes[1].checkBox.checked) {
                    harasserGender = "female"
                }

                let userInfo = {
                    name: contNameInput.textInput.getText(),
                    gender: contGender.group.getIndexSelButton() === 0 ? "male" : "female",
                    harasser: harasserGender
                }
                this.gameManager.startGame(userInfo);
            }
        });
        container.add(acceptButton);

        container.setScale(0.8);
    }

    handleErrors(contNameInput, contGender, contSexuality, maxCharsName) {
        const DURATION = 20;
        
        let errors = false;

        if (!contNameInput.textInput.isValid()) {
            this.makeTextAppear(contNameInput.error, "invalidName", DURATION);
            errors = true;
        }
        else if (contNameInput.textInput.getText().length > maxCharsName) {
            let text = this.i18next.t("shorterName", { ns: this.namespace, number: maxCharsName })
            this.makeTextAppear(contNameInput.error, text, DURATION, false);
            errors = true;
        }
        else {
            this.makeTextDisappear(contNameInput.error, DURATION);
        }

        if (contGender.group.getIndexSelButton() === -1) {
            this.makeTextAppear(contGender.error, "invalidGender", DURATION);
            errors = true;
        }
        else {
            this.makeTextDisappear(contGender.error, DURATION);
        }

        if (!contSexuality.boxes[0].checkBox.checked && !contSexuality.boxes[1].checkBox.checked) {
            this.makeTextAppear(contSexuality.error, "invalidSexuality", DURATION);
            errors = true;
        }
        else {
            this.makeTextDisappear(contSexuality.error, DURATION);
        }

        return errors;
    }

    createNameInputBox(x, y, style, errorStyle) {
        const TEXT_OFFSET = -10;
        const NAME_INPUT_OFFSET = 23;
        const ERROR_TEXT_OFFSET = 30;
        
        let translation = this.translate("nameInput")

        let container = this.add.container(x, y);

        let text = this.add.text(TEXT_OFFSET, 0, translation, style);
        text.setOrigin(1, 0.5);
        container.add(text);

        let textInput = new TextInput(this, 0, 0, 1, translation, NAME_INPUT_OFFSET, { R: 200, G: 200, B: 200 },
            this.gameManager.inputBox.fill.name, this.gameManager.inputBox.border.name, this.config.style.fontFamily,
            {
                area: new Phaser.Geom.Rectangle(this.gameManager.inputBox.offset, this.gameManager.inputBox.offset, this.gameManager.inputBox.width, this.gameManager.inputBox.height),
                callback: Phaser.Geom.Rectangle.Contains
            });
        container.add(textInput);

        container.textInput = textInput;

        let errorText = this.add.text(textInput.x + this.gameManager.inputBox.width + ERROR_TEXT_OFFSET, 0, " ", errorStyle);
        errorText.setOrigin(0, 0.5);
        errorText.alpha = 0;
        container.add(errorText);

        container.h = this.gameManager.inputBox.height;
        container.error = errorText;

        return container;
    }

    createGenderOptions(x, y, style, errorStyle, textId, radioGroup) {
        const TEXT_OFFSET = -80;
        const ERROR_TEXT_OFFSET = 15;
        
        let translation = this.translate(textId)

        let container = this.add.container(x, y);

        let text = this.add.text(TEXT_OFFSET, 0, translation, style);
        text.setOrigin(1, 0.5);
        container.add(text);

        // Cajas de seleccion de genero
        let manBox = this.createGenderCheckbox(0, 0, 'manIcon');
        container.add(manBox);
        let womanBox = this.createGenderCheckbox(manBox.x + manBox.w, 0, 'womanIcon');
        container.add(womanBox);

        let errorText = this.add.text(womanBox.x + womanBox.w / 2 + ERROR_TEXT_OFFSET, 0, " ", errorStyle);
        errorText.setOrigin(0, 0.5);
        errorText.alpha = 0;
        container.add(errorText);

        container.h = manBox.h
        container.error = errorText

        if(radioGroup) {
            let checkBoxes = [];
            checkBoxes.push(manBox.checkBox);
            checkBoxes.push(womanBox.checkBox);
            let radioButtonGroup = new RadioButtonGroup(checkBoxes);
            container.group = radioButtonGroup;
        }
        else {
            container.boxes = [manBox, womanBox];
        }
        return container
    }

    /**
     * Crear una caja de seleccion de genero. Clicando en la imagen se activa la checkbox
     */
    createGenderCheckbox(x, y, genderSprite) {
        const GENDER_SPRITE_SCALE = 0.15;

        // Container para poder moverlo todo junto facilmente
        let container = this.add.container(x, y);
        
        let containerIcon = this.add.container(0, 0)

        let border = this.add.image(0, 0, this.gameManager.roundedSquare.border.name);
        containerIcon.add(border);

        let genderIcon = this.add.image(0, 0, genderSprite);
        genderIcon.setScale(GENDER_SPRITE_SCALE);
        containerIcon.add(genderIcon);

        containerIcon.w = border.displayWidth;
        containerIcon.h = border.displayHeight;

        container.add(containerIcon);

        let checkBoxParams = {
            offsetX: -50,
            offsetY: -50,
            scale: 0.3
        }
        // Hay que modificar el area de colision de la checkbox para que sea los iconos
        let w = containerIcon.w / checkBoxParams.scale - this.gameManager.roundedSquare.offset / checkBoxParams.scale;
        let h = containerIcon.h / checkBoxParams.scale - this.gameManager.roundedSquare.offset / checkBoxParams.scale;
        let rectangle = new Phaser.Geom.Rectangle(0, 0, w, h);
        // Inicialmente el centro del checkbox y del icono coinciden
        // Entonces, sabiendo eso, se coloca el centro del area de colision en esa posicion y luego, se mueve respecto a como
        // este la checkbox desplazada de su centro
        rectangle.centerX = this.gameManager.roundedSquare.width / 2 + 
            this.gameManager.roundedSquare.offset - checkBoxParams.offsetX / checkBoxParams.scale;
        rectangle.centerY = this.gameManager.roundedSquare.height / 2 + 
            this.gameManager.roundedSquare.offset - checkBoxParams.offsetY / checkBoxParams.scale;

        let checkBox = new CheckBox(this, checkBoxParams.offsetX, checkBoxParams.offsetY, checkBoxParams.scale, this.config.style.color,
            { R: 200, G: 200, B: 200 }, this.gameManager.roundedSquare.fill.name, this.gameManager.roundedSquare.border.name,
            {
                area: rectangle,
                callback: Phaser.Geom.Rectangle.Contains
            }).setVisible(true);

        container.add(checkBox);
        
        container.checkBox = checkBox
        container.w = containerIcon.w;
        container.h = containerIcon.h;

        return container
    }
}
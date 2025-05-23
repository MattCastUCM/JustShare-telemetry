import GameManager from '../managers/gameManager.js';

export default class BootScene extends Phaser.Scene {
    /**
    * Escena inicial en la que se cargan todos los recursos
    * @extends Phaser.Scene
    */
    constructor() {
        super({
            key: 'BootScene',
            // Se carga el plugin i18next
            pack: {
                files: [{
                    type: 'plugin',
                    key: 'rextexttranslationplugin',
                    url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexttranslationplugin.min.js',
                    start: true,
                    // Add text-translation plugin to `scene.translation`
                    mapping: 'translation'
                }]
            }
        });
    }

    createLoadingBar() {
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        // Fondo escalado en cuanto al canvas
        let bg = this.add.image(width / 2, height / 2, 'loadscreen');
        let scale = width / bg.width;
        bg.setScale(scale);

        let progressBox = this.add.graphics();
        let progressBar = this.add.graphics();

        const BAR_W = width * 0.6;
        const BAR_H = 70;
        const BAR_OFFSET = 40;
        const FILL_OFFSET = 20;
        const TEXT_OFFSET = 70;
        let bgCol = 0x9c9edf;
        let fillCol = 0x7274b3;
        let borderCol = 0x000000;
        let borderThickness = 2;
        let radius = Math.min(BAR_W, BAR_H) * 0.25;

        progressBox.fillStyle(bgCol, 1).fillRoundedRect(width / 2 - BAR_W / 2, height / 2 - BAR_H / 2 - BAR_OFFSET, BAR_W, BAR_H, radius)
            .lineStyle(borderThickness, borderCol, 1).strokeRoundedRect(width / 2 - BAR_W / 2, height / 2 - BAR_H / 2 - BAR_OFFSET, BAR_W, BAR_H, radius)

        let textStyle = {
            fontFamily: 'roboto-regular',
            fontSize: '30px',
            fill: '#000000',
            fontStyle: 'bold'
        }
        // Texto de la palabra cargando
        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - TEXT_OFFSET - BAR_OFFSET,
            text: 'Loading...',
            style: textStyle
        });
        loadingText.setOrigin(0.5, 0.5);

        // Texto con el porcentaje de los assets cargados
        textStyle.fontSize = '20px';
        textStyle.fill = '#ffffff';
        let percentText = this.make.text({
            x: width / 2,
            y: height / 2 - BAR_OFFSET,
            text: '0%',
            style: textStyle
        });
        percentText.setOrigin(0.5, 0.5);

        // Texto para el nombre de los archivos
        textStyle.fill = '#000000';
        let assetText = this.make.text({
            x: width / 2,
            y: height / 2 + TEXT_OFFSET - BAR_OFFSET,
            text: '',
            style: textStyle
        });
        assetText.setOrigin(0.5, 0.5);

        // Se va actualizando la barra de progreso y el texto con el porcentaje
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');

            progressBar.clear();
            progressBar.fillStyle(fillCol, 1);
            progressBar.fillRoundedRect(width / 2 - (BAR_W - FILL_OFFSET) / 2, height / 2 - (BAR_H - FILL_OFFSET) / 2 - BAR_OFFSET, (BAR_W - FILL_OFFSET) * value, BAR_H - FILL_OFFSET, radius);
        });

        // Cuando carga un archivo, muestra el nombre del archivo debajo de la barra
        this.load.on('fileprogress', function (file) {
            // console.log(file.key);
            assetText.setText('Loading asset: ' + file.key);
        });

        // Cuando se termina de cargar todo, se borran los elementos de la barra
        this.load.once('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
            bg.destroy();
        });
    }

    loadLoadingBarAssets() {
        this.load.setPath('assets/computer');

        this.load.image('loadscreen', 'loadscreen.png');
    }

    loadUIAssets() {
        this.load.setPath('assets/UI');

        this.load.image('interactable', 'interactable.png');
        this.load.image('pointer', 'pointer.png');
        this.load.image('enter', 'door-enter.png');
        this.load.image('exit', 'door-exit.png');
        this.load.image('myBubble', 'myBubble.png');
        this.load.image('othersBubble', 'othersBubble.png');
    }

    loadComputerAssets() {
        this.load.setPath('assets/computer');

        this.load.image('loginScreen', 'loginScreen.png')
        this.load.image('titleScreen', 'titleScreen.png')
        this.load.image('socialMediaScreen', 'socialMediaScreen.png')
        this.load.image('creditsScreen', 'creditsScreen.png')

        this.load.image('powerIcon', 'powerIcon.png')
        this.load.image('heartIcon', 'heartIcon.png')
        this.load.image('heartIconFilled', 'heartIconFilled.png')
        this.load.image('messageIcon', 'messageIcon.png')
        this.load.image('messageIconFilled', 'messageIconFilled.png')
        this.load.image('manIcon', 'manIcon.png')
        this.load.image('womanIcon', 'womanIcon.png')
        this.load.image('homeIcon', 'homeIcon.png')
        this.load.image('optionsIcon', 'optionsIcon.png')

        this.load.image('sendComment', 'sendComment.png')
        this.load.image('sendDirectMessage', 'sendDirectMessage.png')
        this.load.image('chatBar', 'chatBar.png')

        this.load.image('seaPicture', 'seaPicture.png')
        this.load.image('puzzleBooblePicture', 'puzzleBooblePicture.jpeg')

        this.load.setPath('localization/structure/computer');
        this.load.json('profilePictures', 'profilePictures.json');
    }

    loadPhoneAssets() {
        this.load.setPath('assets/UI/phone');

        this.load.image('phone', 'phone.png');
        this.load.image('phoneIcon', 'phoneIcon.png');
        this.load.image('returnButton', 'returnButton.png');
        this.load.image('messageListBg', 'messageListBg.png');
        this.load.image('chatButton', 'chatButton.png');
        this.load.image('chatBg', 'chatBg.png');
        this.load.image('chatTextBox', 'chatTextBox.png');
        this.load.image('chatReturnButton', 'chatReturnButton.png');
    }

    loadFlags() {
        this.load.setPath('assets/UI/flags');

    }

    loadAvatars() {
        this.load.setPath('assets/UI/avatars');

        this.load.image('dadPfp', 'dadPfp.png');
        this.load.image('harasserPfp', 'harasserPfp.png');
        this.load.image('lauraPfp', 'lauraPfp.png');
        this.load.image('momPfp', 'momPfp.png');
        this.load.image('unknownPfp', 'unknownPfp.png');
    }

    loadi18next(dialogsAndNamespaces, onlyNamespaces) {
        let namespaces = dialogsAndNamespaces.concat(onlyNamespaces);

        for (let i = 0; i < namespaces.length; ++i) {
            // IMPORTANTE: EN EL PLUGIN I18NEXT PARA LAS RUTAS HAY QUE USAR '\\' EN VEZ DE '/'
            namespaces[i] = namespaces[i].replace(/\//g, '\\');
        }

        // i18next es un framework de internalizacion ampiamente usado en javascript
        // PAGINA DONDE DESCARGARLO -> https://rexrainbow.github.io/phaser3-rex-notes/docs/site/i18next/
        // DOCUMENTACION OFICIAL -> https://www.i18next.com/

        // Se inicializa el plugin
        // Inicialmente solo se carga el idioma inicial y los de respaldo
        // Luego, conforme se usan tambien se cargan el resto
        this.plugins.get('rextexttranslationplugin').initI18Next(this, {
            // Idioma inicial
            lng: 'es',
            // en caso de que no se encuentra una key en otro idioma se comprueba en los siguientes en orden
            fallbackLng: 'es',
            // Idiomas permitidos
            // Sin esta propiedad a la hora de buscar las traducciones se podria buscar
            // en cualquier idioma (aunque no existiese)
            supportedLngs: ['es'],
            // IMPORTANTE: hay que precargar los namespaces de todos los idiomas porque sino a la hora
            // de usar un namespace por primera vez no le da tiempo a encontrar la traduccion
            // y termina usando la del idioma de respaldo
            preload: ['es'],
            // Namespaces que se cargan para cada uno de los idiomas
            ns: namespaces,
            // Mostrar informacion de ayuda por consola
            debug: false,
            // Cargar las traducciones de un servidor especificado en vez de ponerlas directamente
            backend: {
                // La ruta desde donde cargamos las traducciones
                // {{lng}} --> nombre carpeta de cada uno de los idiomas
                // {{ns}} --> nombre carpeta de cada uno de los namespaces
                loadPath: 'localization/{{lng}}/{{ns}}.json'
            }
        })
    }

    loadDialogs(dialogsAndNamespaces) {
        this.load.setPath('assets/UI/dialog');

        // Assets de la caja de texto y de opcion multiple
        this.load.image('textbox', 'textbox.png');
        this.load.image('optionBox', 'optionBox.png');

        // Archivos de dialogos (estructura)
        this.load.setPath('localization/structure');

        dialogsAndNamespaces.forEach((dialog) => {
            // Quedarse con la ultima parte del path, que corresponde con el id del archivo
            let subPaths = dialog.split('/');
            let name = subPaths[subPaths.length - 1];
            // Ruta completa (dentro de la carpeta structure y con el extension .json)
            let wholePath = dialog + ".json";
            this.load.json(name, wholePath);
        });
    }

    loadCharacters() {
        // Personajes planos sin animaciones
        this.load.setPath('assets/characters');

        this.load.image('mom', 'mom.png');
        this.load.image('dad', 'dad.png');
        this.load.image('teacher', 'teacher.png');
        this.load.image('laura', 'laura.png');
        this.load.image('paula', 'paula.png');
        this.load.image('harasser', 'harasser.png');
        this.load.image('officer', 'officer.png');
    }

    loadBackgrounds() {
        this.load.setPath('assets/backgrounds');

        // Clase
        this.load.image('classBg', 'classroom.png');

        // Cafeteria
        this.load.image('canteenBg', 'canteen.png');

        // Salon
        this.load.image('livingroomInsideBg', 'livingroomInside.png');
        this.load.image('livingroomOutsideBg', 'livingroomOutside.png');

        // Habitacion
        this.load.image('bedroomBg', 'bedroom.png');
        this.load.image('bedroomNightBg', 'bedroomNight.png');
        this.load.image('dream', 'dream.png');

        // Casa de la amiga
        this.load.image('frontyardBg', 'frontyard.png');
        this.load.image('backyardBg', 'backyard.png');
        this.load.image('garageBg', 'garage.png');

        // Casa del acosador
        this.load.image('portalBg', 'portal.png');
        this.load.image('harasserHouseBg', 'harasserHouse.png');

        this.load.image('policeStationBg', 'policeStation.png');

    }

    loadPhotos() {
        this.load.setPath('assets/photos');

        // Influencer
        this.load.image('toniPhoto', 'toniPhoto.png');

        // Escena 3
        this.load.image('harasserPhoto1Male', 'scene3/harasserPhoto1Male.png');
        this.load.image('harasserPhoto1Female', 'scene3/harasserPhoto1Female.png');

        this.load.image('playerPhoto1SmileMale', 'scene3/playerPhoto1SmileMale.png');
        this.load.image('playerPhoto1SmileFemale', 'scene3/playerPhoto1SmileFemale.png');
        this.load.image('playerPhoto1TongueMale', 'scene3/playerPhoto1TongueMale.png');
        this.load.image('playerPhoto1TongueFemale', 'scene3/playerPhoto1TongueFemale.png');

        // Escena 4
        this.load.image('harasserPhoto2Male', 'scene4/harasserPhoto2Male.png');
        this.load.image('harasserPhoto2Female', 'scene4/harasserPhoto2Female.png');

        this.load.image('playerPhoto2SmileMale', 'scene4/playerPhoto2SmileMale.png');
        this.load.image('playerPhoto2SmileFemale', 'scene4/playerPhoto2SmileFemale.png');
        this.load.image('playerPhoto2TongueMale', 'scene4/playerPhoto2TongueMale.png');
        this.load.image('playerPhoto2TongueFemale', 'scene4/playerPhoto2TongueFemale.png');


        // Escena 5
        this.load.image('harasserPhoto3Male', 'scene5/harasserPhoto3Male.png');
        this.load.image('harasserPhoto3Female', 'scene5/harasserPhoto3Female.png');
        this.load.image('harasserPhoto4Male', 'scene5/harasserPhoto4Male.png');
        this.load.image('harasserPhoto4Female', 'scene5/harasserPhoto4Female.png');

        this.load.image('playerPhoto3Male', 'scene5/playerPhoto3Male.png');
        this.load.image('playerPhoto3Female', 'scene5/playerPhoto3Female.png');
        this.load.image('playerPhoto4Male', 'scene5/playerPhoto4Male.png');
        this.load.image('playerPhoto4Female', 'scene5/playerPhoto4Female.png');
        this.load.image('playerPhoto5Male', 'scene5/playerPhoto5Male.png');
        this.load.image('playerPhoto5Female', 'scene5/playerPhoto5Female.png');


        // Escena 6
        this.load.image('playerPhoto6Male', 'scene6/playerPhoto6Male.png');
        this.load.image('playerPhoto6Female', 'scene6/playerPhoto6Female.png');
    }

    loadCreditsSceneAssets() {
        this.load.setPath('assets/UI/creditsScene');
    }

    loadRestAssets() {
        this.createLoadingBar();

        // Son tanto archivos de dialogos como namespaces del plugin i18next
        // Ruta archivo dialogo --> structure/test/dialog.json
        // Id archivo dialogo --> dialog
        // Namespace --> test\\dialog.json
        let dialogsAndNamespaces = [
            "generalDialogs",
            "scene1/scene1Classroom",
            "scene1/scene1Break",
            "scene1/scene1Lunch1",
            "scene1/scene1Bedroom1",
            "scene1/scene1Lunch2",
            "scene1/scene1Bedroom2",

            "scene2/scene2Break",
            "scene2/scene2Bedroom",

            "scene3/scene3Break",
            "scene3/scene3Bedroom",

            "scene4/scene4Frontyard",
            "scene4/scene4Backyard",
            "scene4/scene4Garage",
            "scene4/scene4Bedroom",

            "scene5/scene5Livingroom",
            "scene5/scene5Bedroom",

            "scene6/scene6Livingroom",
            "scene6/scene6Bedroom",
            "scene6/routeA/scene6BedroomRouteA1",
            "scene6/routeA/scene6BedroomRouteA2",
            "scene6/routeA/scene6LunchRouteA",
            "scene6/routeA/scene6PortalRouteA",
            "scene6/routeA/scene6EndingRouteA",

            "scene6/routeB/scene6LunchRouteB",
            "scene6/routeB/scene6BedroomRouteB",
            "scene6/routeB/scene6PoliceStationRouteB",
            "scene6/routeB/scene6EndingRouteB",

            "scene7/scene7Bedroom",

            "test"
        ]
        // Solo son namespaces del plugin i18next
        // Namespace --> test\\dialog.json
        let onlyNamespaces = [
            "names",

            "transitions",

            "deviceInfo",

            "menus/titleScene",
            "menus/loginScene",
            "menus/creditsScene",

            "computer/loginScreen",
            "computer/socialMediaScreen",
            "computer/captions",
            "computer/usernames"
        ]

        this.loadUIAssets();
        this.loadComputerAssets();
        this.loadPhoneAssets();
        this.loadFlags();
        this.loadAvatars();
        this.loadDialogs(dialogsAndNamespaces);
        this.loadCharacters();
        this.loadBackgrounds();
        this.loadPhotos();
        this.loadCreditsSceneAssets();


        this.load.setPath('assets');

        this.loadi18next(dialogsAndNamespaces, onlyNamespaces);

        // Indicar a LoaderPlugin que hay que cargar los assets que se encuentran en la cola
        // Nota: despues del preload este metodo se llama automaticamente, pero si se quieren cargar assets en otra parte hay que llamarlo manualmente
        this.load.start();

        this.load.once('complete', () => {
            this.events.emit('start');
        });
    }

    preload() {
        this.loadLoadingBarAssets();

        // Nota: aunque este metodo se encuentra en el preload, verdaderamente se ejecuta en la etapa de create
        this.load.once('complete', () => {
            this.loadRestAssets();
        });
    }

    create() {
        this.events.once('start', () => {
            let gameManager = GameManager.create(this);

            // TEST
            // gameManager.startTestScene();

            gameManager.startTitleScene();
        })
    }
}
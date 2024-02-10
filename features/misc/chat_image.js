import { request } from "../../../axios";

const BufferedImage = Java.type('java.awt.image.BufferedImage');
const Color = Java.type('java.awt.Color');
const RenderingHints = Java.type('java.awt.RenderingHints');
const Font = Java.type('java.awt.Font');
const ImageIO = Java.type('javax.imageio.ImageIO');
const ByteArrayOutputStream = Java.type('java.io.ByteArrayOutputStream');
const Base64 = Java.type('java.util.Base64');
const Toolkit = Java.type('java.awt.Toolkit');
const StringSelection = Java.type('java.awt.datatransfer.StringSelection');

/**
 * Upload image to imgur.
 * @param {BufferedImage} image 
 */
const uploadToImgur = (image) => {
    const os = new ByteArrayOutputStream();
    ImageIO.write(image, 'png', os);
    const encodedImage = Base64.getEncoder().encodeToString(os.toByteArray());
    request({
        url: 'https://api.imgur.com/3/image',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-fomr-urlencoded',
            Authorization: 'Client-ID 05105dd3e4fcca6'
        },
        body: {
            image: encodedImage
        }
    }).then((res) => {
        const data = res.data;
        const link = data.data.link;
        const selection = new StringSelection(link);
        Toolkit.getDefaultToolkit().getSystemClipboard().setContents(selection, null);
    });
}

/**
 * Create chat component image.
 * @param {string} chatText 
 */
const createChatImage = (chatText) => {
    const textLength = chatText.length;
    const chatTextUnformatted = chatText.removeFormatting();
    let remainingText = chatTextUnformatted;
    const fontRenderer = Renderer.getFontRenderer();
    const chatWindowWidth = Client.getChatGUI().func_146228_f();  // GuiNewChat.getChatWidth()
    let currentStringWidth = 0;
    let rows = 1;
    for (let i = 0; i < textLength; i++) {
        currentStringWidth = Renderer.getStringWidth(remainingText.substring(0, i + 1));
        if (currentStringWidth > chatWindowWidth) {
            rows++;
            currentStringWidth = 0;
            remainingText = remainingText.substring(i);
        }
    }
    const image = new BufferedImage(chatWindowWidth, 16 * rows, BufferedImage.TYPE_4BYTE_ABGR);
    const g2d = image.createGraphics();
    g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
    g2d.setBackground(Color.BLACK);
    g2d.clearRect(0, 0, chatWindowWidth, 16 * rows);

    let charWidth = 0;
    let currentX = 0;
    let currentY = 0;
    let currentRow = 0;
    let obfuscatedStart = [];
    let obfuscatedEnd = [];
    // let boldEnd = [];
    let strikethroughStart = [];
    let strikethroughEnd = [];
    let underlinedStart = [];
    let underlinedEnd = [];
    let currentFormatting = {
        obfuscated: false,
        bold: false,
        strikethrough: false,
        underlined: false,
        italic: false,
        color: Color.white
    };
    const resetFormatting = (i) => {
        if (currentFormatting.obfuscated) {
            obfuscatedEnd.push(i);
            currentFormatting.obfuscated = false;
        }
        if (currentFormatting.strikethrough) {
            strikethroughEnd.push(i);
            currentFormatting.strikethrough = false;
        }
        if (currentFormatting.underlined) {
            underlinedEnd.push(i);
            currentFormatting.underlined = false;
        }
        currentFormatting.bold = false;
        currentFormatting.italic = false;
        currentFormatting.color = Color.white;
    }
    for (let i = 0; i < textLength; i++) {
        if (chatText[i] === '§') {
            switch (chatText[i + 1]) {
                case '0':
                    currentFormatting.color = Color.decode('#000000');
                    break;
                case '1':
                    currentFormatting.color = Color.decode('#0000AA');
                    break;
                case '2':
                    currentFormatting.color = Color.decode('#00AA00');
                    break;
                case '3':
                    currentFormatting.color = Color.decode('#00AAAA');
                    break;
                case '4':
                    currentFormatting.color = Color.decode('#AA0000');
                    break;
                case '5':
                    currentFormatting.color = Color.decode('#AA00AA');
                    break;
                case '6':
                    currentFormatting.color = Color.decode('#FFAA00');
                    break;
                case '7':
                    currentFormatting.color = Color.decode('#AAAAAA');
                    break;
                case '8':
                    currentFormatting.color = Color.decode('#555555');
                    break;
                case '9':
                    currentFormatting.color = Color.decode('#5555FF');
                    break;
                case 'a':
                    currentFormatting.color = Color.decode('#55FF55');
                    break;
                case 'b':
                    currentFormatting.color = Color.decode('#55FFFF');
                    break;
                case 'c':
                    currentFormatting.color = Color.decode('#FF5555');
                    break;
                case 'd':
                    currentFormatting.color = Color.decode('#FF55FF');
                    break;
                case 'e':
                    currentFormatting.color = Color.decode('#FFFF55');
                    break;
                case 'f':
                    currentFormatting.color = Color.decode('#FFFFFF');
                    break;
                case 'k':
                    currentFormatting.obfuscated = true;
                    obfuscatedStart.push(i);
                    break;
                case 'l':
                    currentFormatting.bold = true;
                    break;
                case 'm':
                    currentFormatting.strikethrough = true;
                    strikethroughStart.push(i)
                    break;
                case 'n':
                    currentFormatting.underlined = true;
                    underlinedStart.push(i);
                    break;
                case 'o':
                    currentFormatting.italic = true;
                    break;
                case 'r':
                    resetFormatting(i);
                    break;
                default:
                    break;
            }
            i++;
        }
        else {
            currentY = 16 * (currentRow + 1);
            charWidth = fontRenderer.func_78263_a(chatTextUnformatted[i]);  // getCharWidth
            g2d.setColor(currentFormatting.color);
            if (currentFormatting.bold && currentFormatting.italic) {
                g2d.setFont(new Font('Arial', Font.BOLD | Font.ITALIC, 16));
            } else if (currentFormatting.bold) {
                g2d.setFont(new Font('Arial', Font.BOLD, 16));
            } else if (currentFormatting.italic) {
                g2d.setFont(new Font('Arial', Font.ITALIC, 16));
            }
            g2d.drawString(chatTextUnformatted[i], currentX, currentY);
            if (currentX + charWidth < chatWindowWidth) {
                currentX += charWidth;
            } else {
                currentX = 0;
                currentRow++;
            }
        }
    }
    uploadToImgur(image);
}

register('command', () => {
    createChatImage('test string hereeeeeeeeeeeeeeeeeeeeaaaaaaaaaaaaaaaaaaaaaa');
}).setCommandName('debugcreateimage');

register('chatComponentClicked', (component, event) => {
    const cs = component.chatComponentText.func_150253_a();
    cs.forEach((c) => {
        ChatLib.chat(c.func_150261_e());
    })
});
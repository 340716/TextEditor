export class Editor {
    caretIndex = 0; // 

    caretPosition: number = 0; // in px

    dom: HTMLDivElement = document.createElement('div');

    private currentElement: HTMLElement = this.dom;

    private caretElement: HTMLDivElement;
    
    private sizeInvestigator: HTMLDivElement;

    static makeParagraph(): HTMLParagraphElement {
        const el = document.createElement('p');
        el.style.fontSize = '15px';
        el.style.fontFamily = 'Times New Roman';
        el.style.wordWrap = 'false';
        el.style.overflowX = 'auto';
        return el;
    }

    static makeSizeInvestigator(): HTMLDivElement {
        const el = document.createElement('div');

        const s = el.style;
        s.width = 'fit-content';
        s.height = 'fit-content';
        s.position = 'absolute';
        s.right = '0';
        s.bottom = '0';
        
        return el;
    }

    createCaretElement() {
        const el = document.createElement('div');

        const s = el.style;
        s.width = '1px';
        s.position = 'absolute';
        s.background = 'black';
        s.left = this.caretPosition + 'px';

        return el;
    }

    constructor(parent: Element) {
        parent.appendChild(this.dom);
        this.dom.appendChild(this.currentElement = Editor.makeParagraph());
        this.dom.appendChild(this.sizeInvestigator = Editor.makeSizeInvestigator());
        
        this.dom.appendChild(this.caretElement = this.createCaretElement());
        
        document.addEventListener('keydown', (event) => {
            let { key } = event;
            // if (key === ' ')
            //     key = '&nbsp;'
            console.log(`Key pressed is "${key}"`);
            if (key.length === 1) {
                this.currentElement.textContent = this.currentElement.textContent?.substring(0, this.caretIndex) + key + this.currentElement.textContent?.substring(this.caretIndex);

                const info = this.getCharInformation(key, this.getFont().typeface, this.getFont().font);
                
                this.caretPosition += info.charWidth;
                this.caretIndex++;
                this.reloadCaret();
            } else if (key === 'ArrowLeft') {
                const char: string = this.getPrecedingChar();
                
                this.caretPosition -= this.getCharInformation(char, this.getFont().typeface, this.getFont().font).charWidth;
                this.caretIndex--;

                this.reloadCaret();
            } else if (key === 'ArrowRight') {
                const char: string = this.getFollowingChar();
                
                this.caretPosition += this.getCharInformation(char, this.getFont().typeface, this.getFont().font).charWidth;
                this.caretIndex++;

                this.reloadCaret();
            } else if (key === 'Backspace') {
                const char: string = this.getPrecedingChar();
                
                this.caretPosition -= this.getCharInformation(char, this.getFont().typeface, this.getFont().font).charWidth;
                this.caretIndex--;

                this.currentElement.textContent = this.currentElement.textContent.substring(0,this.caretIndex) + this.currentElement.textContent.substring(this.caretIndex+1);

                this.reloadCaret();
            } 
        });
    }

    getFont(): { typeface: string, font: number} {
        return {
            typeface: this.currentElement.style.fontFamily,
            font: parseInt(this.currentElement.style.fontSize)
        };
    }

    reloadCaret() {
        this.caretElement.style.left = this.caretPosition + 'px';
        this.caretElement.style.height = this.getCharInformation('a', this.getFont().typeface, this.getFont().font).charHeight + 'px';
    }

    getCharInformation(char: string, typeface: string, font: number): { charWidth: number, charHeight: number } {
        console.log('Getting character informatino.');
        
        this.sizeInvestigator.textContent = char;
        if (char === ' ')
            this.sizeInvestigator.innerHTML = '&nbsp;';
        this.sizeInvestigator.style.fontFamily = typeface;
        this.sizeInvestigator.style.fontSize = `${font}px`;

        const { width, height } = this.sizeInvestigator.getBoundingClientRect();

        return {
            charWidth: width,
            charHeight: height
        };

    }
    getPrecedingChar(): string {
        if (this.caretIndex === 0)
            return this.currentElement.textContent.charAt(this.caretIndex);
        const char = this.currentElement.textContent.charAt(this.caretIndex - 1);
        console.log(`Preceding char is "${char}"`);
        
        if (char !== undefined)
            return char;

        throw new Error(`${char} is invalid`);
    }
    getFollowingChar(): string {
        const char = this.currentElement.textContent.charAt(this.caretIndex);
        console.log(`Following char is "${char}"`);
        
        if (char !== undefined)
            return char;
    
        throw new Error(`${char} is invalid`);
    }
}
import { Editor } from "./editor";

/**
 * Main method
 */
export function main_f() {
    const editor = new Editor(document.body);
    console.log(editor.getCharInformation('a', 'monospace',20));
}
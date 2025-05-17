// index.js
import * as fs from 'fs';
import { InputStream, CommonTokenStream } from 'antlr4';
import AnalizadorLexer from './generated/AnalizadorLexer.js';
import AnalizadorParser from './generated/AnalizadorParser.js';
import { MyErrorListener } from './CustomAnalizadorListener.js';
import { MyVisitor } from './CustomAnalizadorVisitor.js';

// Leer el archivo de entrada y mostrarlo
const input = fs.readFileSync('input.txt', 'utf8');
console.log("\nCódigo fuente:");
console.log(input);

// --- Fase 1: Análisis léxico para mostrar la tabla de tokens y lexemas ---
const inputStreamTokens = new InputStream(input);
const lexerTokens = new AnalizadorLexer(inputStreamTokens);
const tokenStreamTokens = new CommonTokenStream(lexerTokens);
tokenStreamTokens.fill();
const tokens = tokenStreamTokens.tokens;

console.log("\nTabla de Tokens y Lexemas:");
console.log("--------------------------------------------------");
console.log("| Lexema         | Token                         |");
console.log("--------------------------------------------------");

for (let token of tokens) {
   
    // Omitir el token EOF
    if ( token.text === "<EOF>") continue;
    
    let tokenType = AnalizadorLexer.symbolicNames[token.type] ||
                    AnalizadorLexer.literalNames[token.type] ||
                    `DESCONOCIDO (${token.type})`;
    console.log(`| ${token.text.padEnd(14)} | ${tokenType.padEnd(30)} |`);
}
console.log("--------------------------------------------------");

// --- Fase 2: Análisis sintáctico y reporte de errores ---
const inputStreamParser = new InputStream(input);
const lexerParser = new AnalizadorLexer(inputStreamParser);
const tokenStreamParser = new CommonTokenStream(lexerParser);
const parser = new AnalizadorParser(tokenStreamParser);

// Configurar el parser con el listener de errores personalizado
const errorListener = new MyErrorListener();
parser.removeErrorListeners();
parser.addErrorListener(errorListener);

// Construir el árbol sintáctico
const tree = parser.program();

if (errorListener.errors > 0) {
    console.error("\nSe encontraron errores de sintaxis en la entrada.");
} else {
    console.log("\nEntrada válida.");
    console.log(`Árbol de derivación: ${tree.toStringTree(parser.ruleNames)}`);

    // Interpretación: ejecutar el visitor que recorre el árbol
    const visitor = new MyVisitor();
    visitor.visit(tree);
}

// CustomAnalizadorListener.js
import { ErrorListener } from 'antlr4';

export class MyErrorListener extends ErrorListener {
  constructor() {
    super();
    this.errors = 0;
  }

  syntaxError(recognizer, offendingSymbol, line, column, msg, e) {
    console.error(`Error en línea ${line}, columna ${column}: ${msg}`);
    this.errors++;
  }
}

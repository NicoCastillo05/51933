// CustomAnalizadorVisitor.js
import AnalizadorVisitor from './generated/AnalizadorVisitor.js';

export class MyVisitor extends AnalizadorVisitor {
  visitProgram(ctx) {
    // Si la producción contiene una declaración de función, se procesa.
    // De lo contrario, se evalúa la expresión.
    if (ctx.functionDeclaration()) {
      return this.visit(ctx.functionDeclaration());
    } else if (ctx.expression()) {
      return this.visit(ctx.expression());
    }
    return null;
  }

  visitFunctionDeclaration(ctx) {
    // Procesa el cuerpo de la función
    return this.visit(ctx.functionBody());
  }

  visitFunctionBody(ctx) {
    let result;
    // Se evalúan los statements en orden
    for (let stmt of ctx.statement()) {
      result = this.visit(stmt);
    }
    return result;
  }

  visitExpressionStatement(ctx) {
    return this.visit(ctx.expression());
  }

  visitConsoleStatement(ctx) {
    // Evalúa la expresión dentro de console.log y la imprime
    let value = this.visit(ctx.expression());
    console.log("Salida (console.log):", value);
    return value;
  }

  visitExpression(ctx) {
    // Maneja operaciones aritméticas simples (suma y resta)
    let result = this.visit(ctx.term(0));
    for (let i = 1; i < ctx.term().length; i++) {
      let operator = ctx.getChild(2 * i - 1).getText();
      let right = this.visit(ctx.term(i));
      if (operator === '+') {
        result += right;
      } else if (operator === '-') {
        result -= right;
      }
    }
    return result;
  }

 visitTerm(ctx) {
  if (ctx.Number()) {
    return parseInt(ctx.Number().getText(), 10);
  } else if (ctx.Identifier()) {
    // Retorna el texto del identificador en lugar de 0.
    return ctx.Identifier().getText();
  } else if (ctx.expression()) {
    return this.visit(ctx.expression());
  }
}

}

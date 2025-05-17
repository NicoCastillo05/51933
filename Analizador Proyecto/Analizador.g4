grammar Analizador;

program: functionDeclaration EOF;

functionDeclaration: 'function' Identifier '(' parameterList? ')' '{' functionBody '}';

parameterList: Identifier (',' Identifier)*;

functionBody: statement*;

statement: expressionStatement
         | consoleStatement;

expressionStatement: expression ';';

consoleStatement: 'console' '.' 'log' '(' expression ')' ';';

expression: term (('+' | '-') term)*;

term: Identifier
    | Number
    | '(' expression ')';

// Tokens
Identifier: [a-zA-Z_] [a-zA-Z0-9_]*;
Number: [0-9]+;

WS: [ \t\r\n]+ -> skip;

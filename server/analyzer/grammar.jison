//	Después de compilar el archivo jison se agregaron las siguientes sentencias al archivo grammar.js para "recuperar errores"
/*	
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
		//	Esto de aquí
        let row = hash.loc.first_line;
        let column = hash.loc.first_column + 1;
        let newError = "<td><center>" + count.toString() + "</center></td>\n" +
            "<td><center>Sintáctico</center></td>\n" +
            "<td><center>" + row + "</center></td>\n" +
            "<td><center>" + column + "</center></td>\n" +
            "<td><center>Se esperaba "+ hash.expected +" pero se obtuvo token " + hash.token + ": \"" + hash.text + "\" </center></td>\n" +
            "</tr>\n" +
            "</center>\n";
        count+=1;
        console.log(newError);
        errors.push(newError);	//	Hasta aquí
        throw error;
    }
},
parse: function parse (input) {
    errors.length = 0;	//	Y esto también
    count = 1;			//	al igual que esto
*/

%{
let panic = false,
    count = 1,
    errors = new Array();
module.exports.errors = errors;
%}


//  Léxico
%lex
%options case-sensitive
number [0-9]+
decimal {number}("."{number})
character ('.')
stringliteral (\"[^"]*\")
identifier ([a-zA-Z_])[a-zA-Z0-9_]*
%%
"//".*						        /* skip comment */
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] /* skip comment */
\s+                         /* skip whitespaces */
//  Palabras reservadas
"int"           return  'R_INT';
"double"        return  'R_DOUBLE';
"char"          return  'R_CHAR';
"boolean"       return  'R_BOOLEAN';
"String"        return  'R_STRING';
"class"         return  'R_CLASS';
"import"        return  'R_IMPORT';
"true"          return  'R_TRUE';
"false"         return  'R_FALSE';
"if"            return  'R_IF';
"else"          return  'R_ELSE';
"switch"        return  'R_SWITCH';
"case"          return  'R_CASE';
"default"       return  'R_DEFAULT';
"while"         return  'R_WHILE';
"do"            return  'R_DO';
"for"           return  'R_FOR';
"break"         return  'R_BREAK';
"continue"      return  'R_CONTINUE';
"return"        return  'R_RETURN';
"void"          return  'R_VOID';
"System"        return  'R_SYSTEM';
"out"           return  'R_OUT';
"print"         return  'R_PRINT';
"println"       return  'R_PRINTLN';
//  Simbolos
";"             return  ';';
":"             return  ':';
","             return  ',';
"."             return  '.';
"{"             return  '{';
"}"             return  '}';
"("             return  '(';
")"             return  ')';
//  Operadores
"*"             return  '*';
"/"             return  '/';
"^"             return  '^';
"%"                return  '%';
"++"            return  '++';
"--"            return  '--';
"=="            return  '==';
"!="            return  '!=';
">="            return  '>=';
"<="            return  '<=';
"&&"            return  '&&';
"||"            return  '||';
">"             return  '>';
"<"             return  '<';
"!"             return  '!';
"="             return  '=';
"+"             return  '+';
"-"             return  '-';
{decimal}       return  'DECIMAL';
{number}        return  'NUMBER';
{identifier}    return  'ID';
{character}     return  'CHAR';
{stringliteral} return  'STRING';



<<EOF>>         return  'EOF';
.               { 
	let row = yylloc.first_line;
	let column = yylloc.first_column + 1;
	let newError = "<td><center>" + count.toString() + "</center></td>\n" +
                "<td><center>Léxico</center></td>\n" +
                "<td><center>" + row + "</center></td>\n" +
                "<td><center>" + column + "</center></td>\n" +
                "<td><center>El caracter \"" + yytext + "\" no pertenece al lenguaje</center></td>\n" +
                "</tr>\n" +
                "</center>\n";
	count+=1;
	errors.push(newError);
	console.log('Error lexico: \'' + yytext + '\'. En fila: ' + row + ', columna: ' + column + '.');
	}

/lex

%{
const OPERATION_TYPE = require('./instructions').OPERATION_TYPE;
const VALUE_TYPE = require('./instructions').VALUE_TYPE;
const API = require('./instructions').APIINSTRUCTIONS;
%}

%left '||'
%left '&&'
%left '==', '!='
%left '>=', '<=', '<', '>'
%left '+' '-'
%left '*' '/'
%left '^'
%left '%'
%left '++' '--'
%left '!' UMENOS

%start INITIAL

%%

INITIAL:            CLASS_DEFINITION  EOF  { return $1; }
        ;
CLASS_DEFINITION:   IMPORT_LIST CLASS_LIST                                          { $$ = API.newClassDefinition($1, $2); }
                |   CLASS_LIST                                                      { $$ = $1; }
                ;
CLASS_LIST:         CLASS_LIST CLASS                                                { $1.push($2); $$ = $1; }
            |       CLASS                                                           { $$ = [$1]; }
            ;
CLASS:              'R_CLASS' 'ID' '{' CLASS_INSTRUCTIONS '}'                       { $$ = API.newClass($2, $4); }
            |       'R_CLASS' 'ID' '{' '}'                                          { $$ = API.newClass($2, []); }
            ;
IMPORT_LIST:        IMPORT_LIST IMPORT                                              { $1.push($2); $$ = $1; }
            |       IMPORT                                                          { $$ = [$1]; }
            ; 
IMPORT:             'R_IMPORT' 'ID' ';'                                         { $$ = API.newImport($2); }
            ;
CLASS_INSTRUCTIONS: CLASS_INSTRUCTIONS CLASS_INSTRUCTION                        { $1.push($2); $$ = $1; }
                |   CLASS_INSTRUCTION                                           { $$ = [$1]; }
                ;
CLASS_INSTRUCTION:  'R_VOID' 'ID' '(' ')' BLOCK_INSTRUCTIONS                    { $$ = API.newVoid($2, $5); }
                |   'R_VOID' 'ID' '(' PARAMETERS_LIST ')' BLOCK_INSTRUCTIONS    { $$ = API.newVoidParams($2, $4, $6); }
                |   TYPE 'ID' '(' ')' BLOCK_INSTRUCTIONS                        { $$ = API.newMethod($1, $2, $5); }
                |   TYPE 'ID' '(' PARAMETERS_LIST ')' BLOCK_INSTRUCTIONS        { $$ = API.newMethodParams($1, $2, $4, $6); }
                |   DECLARATION                         { $$ = $1; }
                |   ASSIGNATION                         { $$ = $1; }
                ;
PARAMETERS_LIST:    PARAMETERS_LIST ',' PARAMETER   { $1.push($3); $$ = $1; }
                |   PARAMETER                       { $$ = [$1]; }
                ;
PARAMETER:          TYPE 'ID'                       { $$ = API.newParam($1, $2); }
        ;
ASSIGNATION:        ID '=' EXPRESSION ';'           { $$ = API.newAssignation($1, $3); }
        ;
DECLARATION:    TYPE ID_LIST ';'                    { $$ = API.newDeclaration($1, $2); }
            |   TYPE ID_LIST '=' EXPRESSION ';'     { $$ = API.newDeclarationExp($1, $2, $4); }
            ;
ID_LIST:    ID_LIST ',' 'ID'    { $1.push($3); $$ = $1; }
        |   'ID'                { $$ = [$1]; }
        ;
TYPE:   'R_INT'     { $$ = $1; }
    |   'R_DOUBLE'  { $$ = $1; }
    |   'R_STRING'  { $$ = $1; }
    |   'R_BOOLEAN' { $$ = $1; }
    |   'R_CHAR'    { $$ = $1; }
    ;
BLOCK_INSTRUCTIONS: '{' INSTRUCTIONS '}'    { $$ = $2; }
				|   '{'  '}'				{ $$ = []; }
                ;
INSTRUCTIONS:   INSTRUCTIONS INSTRUCTION    						{ $1.push($2); $$ = $1; }
            |   INSTRUCTION                 						{ $$ = [$1]; }
            |   INSTRUCTIONS INSTRUCTION ERROR_INSTRUCTIONS ';'   	{ $1.push($2); $$ = $1; }
            |   INSTRUCTION ERROR_INSTRUCTIONS ';'                	{ $$ = [$1]; }
            ;
// These productions are used to report a syntax error. 
// Are called in each production depending where can produce a new error.
// After the call it's necessary to have a recuperation token and should be parsed after the error is found.
ERROR_INSTRUCTIONS:	error
    {
        if($1!=';' && !panic){
			let row = this._$.first_line;
			let column = this._$.first_column + 1;
			let newError = "<td><center>" + count.toString() + "</center></td>\n" +
                "<td><center>Sintáctico</center></td>\n" +
                "<td><center>" + row + "</center></td>\n" +
                "<td><center>" + column + "</center></td>\n" +
                "<td><center>Se esperaba el inicio de una instrucción valida pero se obtuvo \"" + $1 + "\" </center></td>\n" +
                "</tr>\n" +
                "</center>\n";
			count+=1;
			errors.push(newError);
			console.log('Este es un error sintactico: ' + $1 + '. En la linea: '+ this._$.first_line + ', columna: '+this._$.first_column);
			panic = true;
        }
		else if($1==';'){
			panic = false;
		}
	}
;
INSTRUCTION:    DECLARATION                 { $$ = $1; }
            |   ASSIGNATION                 { $$ = $1; }
            |   IF                          { $$ = $1; }
            |   SWITCH                      { $$ = $1; }
            |   FOR                         { $$ = $1; }
            |   WHILE                       { $$ = $1; }
            |   DO                          { $$ = $1; }
            |   PRINT                       { $$ = $1; }
            |   'R_CONTINUE' ';'            { $$ = API.newContinue(this._$.first_line, this._$.first_column+1); }
            |   'R_BREAK'    ';'            { $$ = API.newBreak(this._$.first_line, this._$.first_column+1); }
            |   'R_RETURN' ';'              { $$ = API.newReturn(null, this._$.first_line, this._$.first_column+1);}
            |   'R_RETURN' EXPRESSION  ';'  { $$ = API.newReturn($2, this._$.first_line, this._$.first_column+1); }
            |   FUNCTION_CALL ';'           { $$ = $1; }        
            ;
IF: 'R_IF' '(' EXPRESSION ')' BLOCK_INSTRUCTIONS                                { $$ = API.newIf($3, $5, []); }
|   'R_IF' '(' EXPRESSION ')' BLOCK_INSTRUCTIONS 'R_ELSE' BLOCK_INSTRUCTIONS    { $$ = API.newIf($3, $5, $7); }
|   'R_IF' '(' EXPRESSION ')' BLOCK_INSTRUCTIONS 'R_ELSE' IF                    { $$ = API.newIf($3, $5, [$7]); }
;
SWITCH:     'R_SWITCH' '(' EXPRESSION ')' '{' '}'               { $$ = API.newSwitch($3, []); }
        |   'R_SWITCH' '(' EXPRESSION ')' '{' CASE_LIST '}'     { $$ = API.newSwitch($3, $6); }
        ;
CASE_LIST:  CASE_LIST DEFAULT       { $1.push($2); $$ = $1; }
        |   CASE_LIST CASE          { $1.push($2); $$ = $1; }
        |   DEFAULT                 { $$ = [$1]; }
        |   CASE                    { $$ = [$1]; }
        ;
DEFAULT:'R_DEFAULT' ':' INSTRUCTIONS                        { $$ = API.newDefaultCase($3); }
        ;
CASE:   'R_CASE' EXPRESSION ':' INSTRUCTIONS                { $$ = API.newCase($2, $4); }
        ;
WHILE:  'R_WHILE' '(' EXPRESSION ')' BLOCK_INSTRUCTIONS             { $$ = API.newWhile($3, $5); }
        ;
DO:     'R_DO' BLOCK_INSTRUCTIONS 'R_WHILE' '(' EXPRESSION ')' ';'  { $$ = API.newDoWhile($2, $5); }
        ;
FOR:    'R_FOR' '(' DECLARATION EXPRESSION ';' INC_DEC ')' BLOCK_INSTRUCTIONS   { $$ = API.newFor($3, $4, $6, $8); }
    |   'R_FOR' '(' ASSIGNATION EXPRESSION ';' INC_DEC ')' BLOCK_INSTRUCTIONS   { $$ = API.newFor($3, $4, $6, $8); }
    ;
INC_DEC:    ID '++'     { $$ = API.newUnitOperation($1, OPERATION_TYPE.INCREMENT); }
        |   ID '--'     { $$ = API.newUnitOperation($1, OPERATION_TYPE.DECREMENT); }
        ;
PRINT:  'R_SYSTEM' '.' 'R_OUT' '.' 'R_PRINT' '(' EXPRESSION ')' ';'     { $$ = API.newPrint($7); }
    |   'R_SYSTEM' '.' 'R_OUT' '.' 'R_PRINTLN' '(' EXPRESSION ')' ';'   { $$ = API.newPrintLine($7); }
    ;
FUNCTION_CALL:  'ID' '(' ')'                            { $$ = API.newFunctionCall($1, []); }
            |   'ID' '(' EXPRESSION_LIST ')'            { $$ = API.newFunctionCall($1, $3); }
            ;
EXPRESSION_LIST:    EXPRESSION_LIST ',' EXPRESSION      { $1.push($3); $$ = $1; }
            |       EXPRESSION                          { $$ = [$1]; }
            ;
EXPRESSION: EXPRESSION '+' EXPRESSION   { $$ = API.newBinOperation($1, $3, OPERATION_TYPE.SUM); }
        |   EXPRESSION '-' EXPRESSION   { $$ = API.newBinOperation($1, $3, OPERATION_TYPE.SUBSTR); }
        |   EXPRESSION '*' EXPRESSION   { $$ = API.newBinOperation($1, $3, OPERATION_TYPE.MULTIP);}
        |   EXPRESSION '/' EXPRESSION   { $$ = API.newBinOperation($1, $3, OPERATION_TYPE.DIVISION);}
        |   EXPRESSION '^' EXPRESSION   { $$ = API.newBinOperation($1, $3, OPERATION_TYPE.POWER); }
        |   EXPRESSION '%' EXPRESSION   { $$ = API.newBinOperation($1, $3, OPERATION_TYPE.MODULE); }
        |   EXPRESSION '==' EXPRESSION  { $$ = API.newBinOperation($1, $3, OPERATION_TYPE.EQUALITY); }
        |   EXPRESSION '!=' EXPRESSION  { $$ = API.newBinOperation($1, $3, OPERATION_TYPE.DISTINCT); }
        |   EXPRESSION '>' EXPRESSION   { $$ = API.newBinOperation($1, $3, OPERATION_TYPE.GREATER_THAN); }
        |   EXPRESSION '>=' EXPRESSION  { $$ = API.newBinOperation($1, $3, OPERATION_TYPE.GREATER_EQUAL); }
        |   EXPRESSION '<=' EXPRESSION  { $$ = API.newBinOperation($1, $3, OPERATION_TYPE.LESS_EQUAL); }
        |   EXPRESSION '<' EXPRESSION   { $$ = API.newBinOperation($1, $3, OPERATION_TYPE.LESS_THAN); }
        |   EXPRESSION '&&' EXPRESSION  { $$ = API.newBinOperation($1, $3, OPERATION_TYPE.AND); }
        |   EXPRESSION '||' EXPRESSION  { $$ = API.newBinOperation($1, $3, OPERATION_TYPE.OR); }
        |   EXPRESSION '++'             { $$ = API.newUnitOperation($1, OPERATION_TYPE.INCREMENT); }
        |   EXPRESSION '--'             { $$ = API.newUnitOperation($1, OPERATION_TYPE.DECREMENT); }
        |   '!' EXPRESSION              { $$ = API.newUnitOperation($2, OPERATION_TYPE.NOT); }
        |   '-' EXPRESSION %prec UMENOS { $$ = API.newUnitOperation($2, OPERATION_TYPE.NEGATIVE); }
        |   'ID'                        { $$ = API.newValue($1, VALUE_TYPE.ID); }
        |   'NUMBER'                    { $$ = API.newValue($1, VALUE_TYPE.NUMBER); }
        |   'DECIMAL'                   { $$ = API.newValue($1, VALUE_TYPE.DECIMAL); }
        |   'STRING'                    { $$ = API.newValue($1, VALUE_TYPE.STRING); }
        |   'CHAR'                      { $$ = API.newValue($1, VALUE_TYPE.CHAR); }
		|	'R_TRUE'					{ $$ = API.newValue($1, VALUE_TYPE.TRUE); }
		|	'R_FALSE'					{ $$ = API.newValue($1, VALUE_TYPE.FALSE); }
        |   '(' EXPRESSION ')'          { $$ = $2; }
        |   FUNCTION_CALL               { $$ = $1; }
        ;

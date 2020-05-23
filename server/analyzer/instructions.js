//  Constants for each 'value' type from the grammar.
const VALUE_TYPE = {
    NUMBER:     'NUMERO',
    DECIMAL:    'DECIMAL',
    ID:         'ID',
    STRING:     'STRING',
    CHAR:       'CHAR',
    TRUE:       'TRUE',
    FALSE:      'FALSE',
    FUNCTION:   'FUNCION'
}

//  Constants for each 'operation' that can be analyzed on the grammar.
const OPERATION_TYPE = {
    SUM:                'SUMA',
    SUBTR:              'RESTA',
    MULTIP:             'MULTIP',
    DIVISION:           'DIVISION',
    POWER:              'POTENCIA',
    MODULE:             'MODULO',
    EQUALITY:           'IGUALDAD',
    DISTINCT:           'DISTINTO',
    LESS_THAN:          'MENOR_QUE',
    LESS_EQUAL:         'MENOR_IGUAL',
    GREATER_THAN:       'MAYOR_QUE',
    GREATER_EQUAL:      'MAYOR_IGUAL',
    AND:                'AND',
    OR:                 'OR',
    NOT:                'NOT',
    NEGATIVE:           'NEGATIVO',
    INCREMENT:          'INCREMENTO',
    DECREMENT:          'DECREMENTO'
}
//  Constants for each 'instruction' type that are valid for the grammar.
const INSTRUCTIONS_TYPE = {
    IMPORT:                     'INSTRUCCION_IMPORT',
    CLASS_DECLARATION:          'INSTRUCCION_DECLARACION_CLASE',
    VOID_DECLARATION:           'INSTRUCCION_DECLARACION_FUNCION',
    METHOD_DECLARATION:         'INSTRUCCION_DECLARACION_METODO',
    DECLARATION:                'INSTRUCCION_DECLARACION',
    ASSIGNATION:                'INSTRUCCION_ASIGNACION',
    IF:                         'INSTRUCCION_IF',
    SWITCH:                     'INSTRUCCION_SWITCH',
    FOR:                        'INSTRUCCION_FOR',
    WHILE:                      'INSTRUCCION_WHILE',
    DO:                         'INSTRUCCION_DO',
    BREAK:                      'INSTRUCCION_BREAK',
    CONTINUE:                   'INSTRUCCION_CONTINUE',
    FUNCTION_CALL:              'INSTRUCCION_FUNC_CALL',
    RETURN:                     'INSTRUCCION_RETURN',
    PRINT:                      'INSTRUCCION_PRINT',
    PRINTLINE:                  'INSTRUCCION_PRINTLINE'
}
//  Constants for the Switch Instruction's options
const OPTION_SWITCH = {
    CASE:       'CASE',
    DEFAULT:    'DEFAULT'
}


/**
 * Creates a new 'Operation' type object
 * @param {*} opLeft 
 * @param {*} opRight 
 * @param {*} type 
 */
function newOperation(opLeft, opRight, type){
    return {
        Tipo:   type,
        Operador_izquierda: opLeft,
        Operador_derecha: opRight
    }
}
//  Constant used to share the necessary functions to build new operations and instructions.
const APIINSTRUCTIONS = {
    /**
     * Creates a new Binary Operation type object.
     * @param {*} opLeft 
     * @param {*} opRight 
     * @param {*} type 
     */
    newBinOperation: function(opLeft, opRight, type){
        return newOperation(opLeft, opRight, type);
    },
    /**
     * Creates a new Unit Operation type object.
     * @param {*} operand 
     * @param {*} type 
     */
    newUnitOperation: function(operand, type){
        return newOperation(operand, undefined, type);
    },
    /**
     * Creates a new Value type object.
     * @param {*} value 
     * @param {*} type 
     */
    newValue: function(value, type){
        return {
            Tipo: type,
            Valor: value
        }
    },
    /*FROM HERE, EVERY FUNCTION CREATES A NEW INSTRUCTION TYPE OBJECT*/

    newClassDefinition: function(importList, _class){
        return{
            Lista_Imports:importList,
            Lista_Clases:_class
        }
    },

    newImport: function(idImport){
        return{
            Tipo: INSTRUCTIONS_TYPE.IMPORT,
            ID_Import: idImport
        };
    },

    newClass: function(idClass, instructions){
        return{
            Tipo:INSTRUCTIONS_TYPE.CLASS_DECLARATION,
            ID_Clase: idClass,
            Lista_Instrucciones: instructions
        }
    },

    newVoid: function(idVoid, instructions){
        return{
            Tipo:INSTRUCTIONS_TYPE.VOID_DECLARATION,
            ID_Funcion: idVoid,
            Lista_Instrucciones: instructions
        }
    },
    
    newVoidParams: function(idVoid, parametersList, instructions){
        return{
            Tipo:INSTRUCTIONS_TYPE.VOID_DECLARATION,
            ID_Funcion: idVoid,
            Lista_Parametros: parametersList,
            Lista_Instrucciones: instructions
        }
    },

    newMethod: function(returnType, idMethod, instructions){
        return{
            Tipo:INSTRUCTIONS_TYPE.METHOD_DECLARATION,
            Tipo_Retorno: returnType,
            ID_Metodo: idMethod,
            Lista_Instrucciones: instructions
        }
    },

    newMethodParams: function(returnType, idMethod, parametersList, instructions){
        return{
            Tipo:INSTRUCTIONS_TYPE.METHOD_DECLARATION,
            Tipo_Retorno: returnType,
            ID_Metodo: idMethod,
            Lista_Parametros: parametersList,
            Lista_Instrucciones: instructions
        }
    },

    newParam: function(type, id){
        return{
            Tipo_Parametro: type,
            ID_Parametro: id,
        }
    },

    newParametersList: function(type, id, parametersList){
        return{
            Parametro: newParam(type, id),
            Lista_Parametros: parametersList
        }
    },

    newDeclarationExp: function(type, id, expression){
        return{
            Tipo:INSTRUCTIONS_TYPE.DECLARATION,
            Tipo_Dato:type,
            ID:id,
            Expresion:expression
        }
    },

    newDeclaration: function(type, id){
        return{
            Tipo:INSTRUCTIONS_TYPE.DECLARATION,
            Tipo_Dato:type,
            ID:id
        }
    },

    newAssignation: function(id, expression){
        return{
            Tipo:INSTRUCTIONS_TYPE.ASSIGNATION,
            ID:id,
            Expresion:expression
        }
    },

    newIf: function(condition, instructionsIf, instructionsElse){
        return{
            Tipo:INSTRUCTIONS_TYPE.IF,
            Expresion:condition,
            Instrucciones_If:instructionsIf,
            Instrucciones_Else:instructionsElse
        }
    },

    newSwitch: function(expression, caseList){
        return{
            Tipo: INSTRUCTIONS_TYPE.SWITCH,
            Expresion: expression,
            Lista_Casos: caseList
        }
    },

    newCaseList: function(_case){
        var caseList = [];
        caseList.push(_case);
        return caseList;
    },

    newCase: function(expression, instructions){
        return{
            Tipo: OPTION_SWITCH.CASE,
            Expresion: expression,
            Lista_Instrucciones: instructions
        }
    },

    newDefaultCase: function(instructions){
        return{
            Tipo: OPTION_SWITCH.DEFAULT,
            Lista_Instrucciones: instructions
        }
    },

    newWhile: function(expression, instructions){
        return{
            Tipo: INSTRUCTIONS_TYPE.WHILE,
            Expresion: expression,
            Lista_Instrucciones: instructions
        }
    },

    newDoWhile: function(instructions, expression){
        return{
            Tipo: INSTRUCTIONS_TYPE.DO,
            Expression_While: expression,
            Lista_Instrucciones: instructions
        }
    },

    newFor: function(declaration, expression, unary_operator, instructions){
        return{
            Tipo: INSTRUCTIONS_TYPE.FOR,
            Operacion: declaration,
            Expresion: expression,
            Operador_Unario: unary_operator,
            Lista_Instrucciones: instructions
        }
    },

    newPrint: function(expression){
        return{
            Tipo: INSTRUCTIONS_TYPE.PRINT,
            Expresion: expression,
        }
    },

    newPrintLine: function(expression){
        return{
            Tipo: INSTRUCTIONS_TYPE.PRINTLINE,
            Expresion: expression,
        }
    },

    newContinue: function(row, column){
        return{
            Tipo: INSTRUCTIONS_TYPE.CONTINUE,
            Fila: row,
            Columna: column
        }
    },

    newBreak: function(row, column){
        return{
            Tipo: INSTRUCTIONS_TYPE.BREAK,
            Fila: row,
            Columna: column
        }
    },

    newReturn: function(expression, row, column){
        return{
            Tipo: INSTRUCTIONS_TYPE.RETURN,
            Valor_Retorno: expression,
            Fila: row,
            Columna: column
        }
    },

    newFunctionCall: function(id, expressionList){
        return{
            Tipo: INSTRUCTIONS_TYPE.FUNCTION_CALL,
            ID: id,
            Lista_Expresiones: expressionList
        }
    }
}
module.exports.INSTRUCTIONS_TYPE = INSTRUCTIONS_TYPE;
module.exports.OPERATION_TYPE = OPERATION_TYPE;
module.exports.OPTION_SWITCH = OPTION_SWITCH;
module.exports.VALUE_TYPE = VALUE_TYPE;
module.exports.APIINSTRUCTIONS = APIINSTRUCTIONS;
//  
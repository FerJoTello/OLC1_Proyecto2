//  Constants for each 'value' type from the grammar.
const VALUE_TYPE = {
    NUMBER:     'VAL_NUMBER',
    DECIMAL:    'VAL_DECIMAL',
    ID:         'VAL_ID',
    STRING:     'VAL_STRING',
    CHAR:       'VAL_CHAR',
    TRUE:       'VAL_TRUE',
    FALSE:      'VAL_FALSE',
    FUNCTION:   'VAL_FUNCTION'
}

//  Constants for each 'operation' that can be analyzed on the grammar.
const OPERATION_TYPE = {
    SUM:                'OP_SUM',
    SUBTR:              'OP_SUBTR',
    MULTIP:             'OP_MULTIP',
    DIVISION:           'OP_DIVISION',
    POWER:              'OP_POWER',
    MODULE:             'OP_MODULE',
    EQUALITY:           'OP_EQUALITY',
    DISTINCT:           'OP_DISTINCT',
    LESS_THAN:          'OP_LESS_THAN',
    LESS_EQUAL:         'OP_LESS_EQUAL',
    GREATER_THAN:       'OP_GREATER_THAN',
    GREATER_EQUAL:      'OP_GREATER_EQUAL',
    AND:                'OP_AND',
    OR:                 'OP_OR',
    NOT:                'OP_NOT',
    NEGATIVE:           'OP_NEGATIVE',
    INCREMENT:          'OP_INCREMENT',
    DECREMENT:          'OP_DECREMENT'
}
//  Constants for each 'instruction' type that are valid for the grammar.
const INSTRUCTIONS_TYPE = {
    IMPORT:                     'INSTR_IMPORT',
    CLASS_DECLARATION:          'INSTR_CLASS_DECLA',
    VOID_DECLARATION:           'INSTR_VOID_DECLA',
    METHOD_DECLARATION:         'INSTR_METHOD_DECLA',
    DECLARATION:                'INSTR_DECLARATION',
    ASSIGNATION:                'INSTR_ASSIGN',
    IF:                         'INSTR_IF',
    SWITCH:                     'INSTR_SWITCH',
    FOR:                        'INSTR_FOR',
    WHILE:                      'INSTR_WHILE',
    DO:                         'INSTR_DO',
    BREAK:                      'INSTR_BREAK',
    CONTINUE:                   'INSTR_CONTINUE',
    FUNCTION_CALL:              'INSTR_FUNC_CALL',
    RETURN:                     'INSTR_RETURN',
    PRINT:                      'INSTR_PRINT',
    PRINTLINE:                  'INSTR_PRINTLINE'
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
        leftOperator: opLeft,
        rightOperator: opRight,
        type:   type
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
            type: type,
            value: value
        }
    },
    /*FROM HERE, EVERY FUNCTION CREATES A NEW INSTRUCTION TYPE OBJECT*/

    newClassDefinition: function(importList, _class){
        return{
            imports:importList,
            class:_class
        }
    },

    newImport: function(idImport){
        return{
            type: INSTRUCTIONS_TYPE.IMPORT,
            idImport: idImport
        };
    },

    newClass: function(idClass, instructions){
        return{
            type:INSTRUCTIONS_TYPE.CLASS_DECLARATION,
            idClass: idClass,
            instructions: instructions
        }
    },

    newVoid: function(idVoid, instructions){
        return{
            type:INSTRUCTIONS_TYPE.VOID_DECLARATION,
            idVoid: idVoid,
            instructions: instructions
        }
    },
    
    newVoid: function(idVoid, parametersList, instructions){
        return{
            type:INSTRUCTIONS_TYPE.VOID_DECLARATION,
            idVoid: idVoid,
            parametersList: parametersList,
            instructions: instructions
        }
    },

    newMethod: function(returnType, idMethod, instructions){
        return{
            type:INSTRUCTIONS_TYPE.METHOD_DECLARATION,
            returnType: returnType,
            idMethod: idMethod,
            instructions: instructions
        }
    },

    newMethod: function(returnType, idMethod, parametersList, instructions){
        return{
            type:INSTRUCTIONS_TYPE.METHOD_DECLARATION,
            returnType: returnType,
            idMethod: idMethod,
            parametersList, parametersList,
            instructions: instructions
        }
    },

    newParam: function(type, id){
        return{
            typeParam: type,
            idParam: id,
        }
    },

    newParametersList: function(type, id, parametersList){
        return{
            parameter: newParam(type, id),
            parametersList: parametersList
        }
    },

    newDeclaration: function(type, id, expression){
        return{
            type:INSTRUCTIONS_TYPE.DECLARATION,
            data_type:type,
            id:id,
            expression:expression
        }
    },

    newDeclaration: function(type, id){
        return{
            type:INSTRUCTIONS_TYPE.DECLARATION,
            data_type:type,
            id:id
        }
    },

    newAssignation: function(id, expression){
        return{
            type:INSTRUCTIONS_TYPE.ASSIGNATION,
            id:id,
            expression:expression
        }
    },

    newIf: function(condition, instructionsIf, instructionsElse){
        return{
            type:INSTRUCTIONS_TYPE.IF,
            condition:condition,
            instructionsIf:instructionsIf,
            instructionsElse:instructionsElse
        }
    },

    newSwitch: function(expression, caseList){
        return{
            type: INSTRUCTIONS_TYPE.SWITCH,
            expression: expression,
            caseList: caseList
        }
    },

    newCaseList: function(_case){
        var caseList = [];
        caseList.push(_case);
        return caseList;
    },

    newCase: function(expression, instructions){
        return{
            type: OPTION_SWITCH.CASE,
            expression: expression,
            instructions: instructions
        }
    },

    newDefaultCase: function(instructions){
        return{
            type: OPTION_SWITCH.DEFAULT,
            instructions: instructions
        }
    },

    newWhile: function(expression, instructions){
        return{
            type: INSTRUCTIONS_TYPE.WHILE,
            expression: expression,
            instructions: instructions
        }
    },

    newDoWhile: function(instructions, expression){
        return{
            type: INSTRUCTIONS_TYPE.DO,
            while_Expression: expression,
            instructions: instructions
        }
    },

    newFor: function(declaration, expression, unary_operator, instructions){
        return{
            type: INSTRUCTIONS_TYPE.FOR,
            operation: declaration,
            expression: expression,
            unary_operator: unary_operator,
            instructions: instructions
        }
    },

    newPrint: function(expression){
        return{
            type: INSTRUCTIONS_TYPE.PRINT,
            expression: expression,
        }
    },

    newPrintLine: function(expression){
        return{
            type: INSTRUCTIONS_TYPE.PRINTLINE,
            expression: expression,
        }
    },

    newContinue: function(){
        return{
            type: INSTRUCTIONS_TYPE.CONTINUE
        }
    },

    newBreak: function(){
        return{
            type: INSTRUCTIONS_TYPE.BREAK
        }
    },

    newReturn: function(expression){
        return{
            type: INSTRUCTIONS_TYPE.RETURN,
            returnedValue: expression
        }
    },

    newFunctionCall: function(id, expressionList){
        return{
            type: INSTRUCTIONS_TYPE.FUNCTION_CALL,
            id: id,
            expressionList: expressionList
        }
    }
}
module.exports.INSTRUCTIONS_TYPE = INSTRUCTIONS_TYPE;
module.exports.OPERATION_TYPE = OPERATION_TYPE;
module.exports.VALUE_TYPE = VALUE_TYPE;
module.exports.APIINSTRUCTIONS = APIINSTRUCTIONS;
//  
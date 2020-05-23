const INSTRUCTIONS_TYPE = require('./instructions').INSTRUCTIONS_TYPE,
    VALUE_TYPE = require('./instructions').VALUE_TYPE,
    OPERATION_TYPE = require('./instructions').OPERATION_TYPE,
    OPTION_SWITCH = require('./instructions').OPTION_SWITCH;

let cicleCounter = 0,
    isVoid = false,
    isMethod = false,
    isCaseOrDefault = false,
    errorsList = [],
    errorsCount = 0;
function processBlock(instructions, symbolTable) {
    //console.log(instructions);
    instructions.forEach(instruction => {
        switch (instruction.Tipo) {
            case INSTRUCTIONS_TYPE.IMPORT: {
                //  Does nothing :p
                break;
            }
            case INSTRUCTIONS_TYPE.CLASS_DECLARATION: {
                //  Processing...
                processBlock(instruction.Lista_Instrucciones, symbolTable);
                break;
            }
            case INSTRUCTIONS_TYPE.VOID_DECLARATION: {
                //  Processing...
                isVoid = true;
                processBlock(instruction.Lista_Instrucciones, symbolTable);
                isVoid = false;
                break;
            }
            case INSTRUCTIONS_TYPE.METHOD_DECLARATION: {
                //  Processing...
                isMethod = true;
                processBlock(instruction.Lista_Instrucciones, symbolTable);
                isMethod = false;
                break;
            }
            case INSTRUCTIONS_TYPE.DECLARATION: {
                //  Processing...
                //  Does nothing :p
                break;
            }
            case INSTRUCTIONS_TYPE.ASSIGNATION: {
                //  Processing...
                //  Does nothing :p
                break;
            }
            case INSTRUCTIONS_TYPE.IF: {
                //  Processing...
                processBlock(instruction.Instrucciones_If, symbolTable);
                processBlock(instruction.Instrucciones_Else, symbolTable);
                break;
            }
            case INSTRUCTIONS_TYPE.SWITCH: {
                //  Processing...
                processBlock(instruction.Lista_Casos, symbolTable);
                break;
            }
            case OPTION_SWITCH.CASE: {
                //  Processing...
                isCaseOrDefault = true;
                processBlock(instruction.Lista_Instrucciones, symbolTable);
                isCaseOrDefault = false;
                break;
            }
            case OPTION_SWITCH.DEFAULT: {
                //  Processing...
                isCaseOrDefault = true;
                processBlock(instruction.Lista_Instrucciones, symbolTable);
                isCaseOrDefault = false;
                break;
            }
            case INSTRUCTIONS_TYPE.FOR: {
                //  Processing...
                cicleCounter++;
                processBlock(instruction.Lista_Instrucciones, symbolTable);
                cicleCounter--;
                break;
            }
            case INSTRUCTIONS_TYPE.WHILE: {
                //  Processing...
                cicleCounter++;
                processBlock(instruction.Lista_Instrucciones, symbolTable);
                cicleCounter--;
                break;
            }
            case INSTRUCTIONS_TYPE.DO: {
                //  Processing...
                cicleCounter++;
                processBlock(instruction.Lista_Instrucciones, symbolTable);
                cicleCounter--;
                break;
            }
            case INSTRUCTIONS_TYPE.BREAK: {
                //  Processing...
                if (cicleCounter == 0 && !isCaseOrDefault) {
                    let newError = "<td><center>" + errorsCount.toString() + "</center></td>\n" +
                        "<td><center>Semántico</center></td>\n" +
                        "<td><center>" + instruction.Fila + "</center></td>\n" +
                        "<td><center>" + instruction.Columna + "</center></td>\n" +
                        "<td><center>No se puede validar \"break\", no forma parte de un bloque válido</center></td>\n" +
                        "</tr>\n" +
                        "</center>\n";
                    errorsCount += 1;
                    //console.log(newError);
                    errorsList.push(newError);
                }
                break;
            }
            case INSTRUCTIONS_TYPE.CONTINUE: {
                //  Processing...
                if (cicleCounter == 0) {
                    let newError = "<td><center>" + errorsCount.toString() + "</center></td>\n" +
                        "<td><center>Semántico</center></td>\n" +
                        "<td><center>" + instruction.Fila + "</center></td>\n" +
                        "<td><center>" + instruction.Columna + "</center></td>\n" +
                        "<td><center>No se puede validar \"continue\", no forma parte de un bloque válido</center></td>\n" +
                        "</tr>\n" +
                        "</center>\n";
                    errorsCount += 1;
                    //console.log(newError);
                    errorsList.push(newError);
                }
                break;
            }
            case INSTRUCTIONS_TYPE.FUNCTION_CALL: {
                //  Processing...
                break;
            }
            case INSTRUCTIONS_TYPE.RETURN: {
                //  Processing...
                if (isMethod) {
                    if (instruction.Valor_Retorno==null) {
                        let newError = "<td><center>" + errorsCount.toString() + "</center></td>\n" +
                            "<td><center>Semántico</center></td>\n" +
                            "<td><center>" + instruction.Fila + "</center></td>\n" +
                            "<td><center>" + instruction.Columna + "</center></td>\n" +
                            "<td><center>No se puede validar \"return\", no contiene ningun valor a retornar.</center></td>\n" +
                            "</tr>\n" +
                            "</center>\n";
                        errorsCount += 1;
                        //console.log(newError);
                        errorsList.push(newError);
                    }
                }
                else if (isVoid) {
                    if (instruction.Valor_Retorno!=null) {
                        let newError = "<td><center>" + errorsCount.toString() + "</center></td>\n" +
                            "<td><center>Semántico</center></td>\n" +
                            "<td><center>" + instruction.Fila + "</center></td>\n" +
                            "<td><center>" + instruction.Columna + "</center></td>\n" +
                            "<td><center>No se puede validar \"return\", no puede tener un valor a retornar.</center></td>\n" +
                            "</tr>\n" +
                            "</center>\n";
                        errorsCount += 1;
                        //console.log(newError);
                        errorsList.push(newError);
                    }
                }
                else {
                    let newError = "<td><center>" + errorsCount.toString() + "</center></td>\n" +
                        "<td><center>Semántico</center></td>\n" +
                        "<td><center>" + instruction.Fila + "</center></td>\n" +
                        "<td><center>" + instruction.Columna + "</center></td>\n" +
                        "<td><center>No se puede validar \"return\", no pertenece a un bloque válido.</center></td>\n" +
                        "</tr>\n" +
                        "</center>\n";
                    errorsCount += 1;
                    //console.log(newError);
                    errorsList.push(newError);
                }
                break;
            }
            case INSTRUCTIONS_TYPE.PRINT: {
                //  Processing...
                break;
            }
            case INSTRUCTIONS_TYPE.PRINTLINE: {
                //  Processing...
                break;
            }
            default:
                throw 'ERROR: tipo de instrucción no válido: ' + instruction;
        }
    });
}
module.exports.errors = errorsList;
module.exports.count = errorsCount;
module.exports.processAST = function (ast, errors, count) {
    errorsList = errors;
    errorsCount = count + 1;
    try {
        if (ast.Lista_Clases == undefined) {
            processBlock(ast, null);
        }
        else {
            processBlock(ast.Lista_Clases, null);
        }
    } catch (e) {
        console.log("se encontro este error:")
        console.log(e);
    }
};
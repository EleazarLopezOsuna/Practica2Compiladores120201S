//Expresiones regulares
const comentarioLinea = /\/\/.*/g
const comentarioMultiLinea = /\/\*[^\*\/]*\*\//g
const identificador = /^[a-zA-Z][\w_]*$/
const cadena = /^\"[^\"]*\"$/
const caracter = /^'[^']'$/
const entero = /^\d+$/
const html = /^'[^']*'$/
const boleano = /^true|false$/
const doble = /^\d+\.\d+$/
const mmm = /^@(SIMPLE|MULTI)_\d+$/

//Palabras reservadas
const rVoid = "void"
const rMain = "main"
const rIf = "if"
const rElse = "else"
const rSwitch = "switch"
const rCase = "case"
const rDefault = "default"
const rFor = "for"
const rWhile = "while"
const rDo = "do"
const rConsole = "Console"
const rWrite = "Write"
const rInt = "int"
const rDouble = "double"
const rChar = "char"
const rBool = "bool"
const rString = "string"
const rReturn = "return"
const rBreak = "break"
const rContinue = "continue"

//Valores a retornar
var listaTokens = []
var listaErrores = []
var comentarios = []

//Token
function Token(nombre, lexema, linea, columna){
  this.nombre = nombre
  this.lexema = lexema
  this.linea = linea
  this.columna = columna
}

//Error
function Error(tipo, lexema, linea, columna, mensaje){
  this.tipo = tipo
  this.lexema = lexema
  this.linea = linea
  this.columna = columna
  this.mensaje = mensaje
}

function obtenerComentarios(){
  return comentarios
}

function obtenerTokens(){
  return listaTokens
}

function obtenerErrores(){
  return listaErrores
}

function buscarNombre(lexema){
  switch(lexema){
    case rVoid:
      return "void"
    case rMain:
      return "main"
    case rIf:
      return "if"
    case rElse:
      return "else"
    case rSwitch:
      return "switch"
    case rCase:
      return "case"
    case rDefault:
      return "default"
    case rFor:
      return "for"
    case rWhile:
      return "while"
    case rDo:
      return "do"
    case rConsole:
      return "console"
    case rWrite:
      return "write"
    case rInt:
      return "int"
    case rChar:
      return "char"
    case rString:
      return "string"
    case rDouble:
      return "double"
    case rBool:
      return "bool"
    case rReturn:
      return "return"
    case rBreak:
      return "break"
    case rContinue:
      return "continue"
    default:
      if(lexema.match(mmm)){
        return "comentario"
      }else if(lexema.match(boleano)){
        return "boleano"
      }else if(lexema.match(identificador)){
        return "identificador";
      }else if(lexema.match(entero)){
        return "entero";
      }else if(lexema.match(cadena)){
        return "cadena";
      }else if(lexema.match(caracter)){
        return "caracter";
      }else if(lexema.match(html)){
        return "html";
      }else if(lexema.match(doble)){
        return "doble"
      }else{
        return "error"
      }
  }
}

function iniciarAnalisisLexico(texto){
  //Limpiamos las listas
  listaErrores = []
  listaTokens = []

  //Eliminamos los comentarios del texto a analizar
  var matchs = texto.match(comentarioLinea)
  var analizar = texto
  if(matchs !== null){
    for(var i = 0; i < matchs.length; i++){
      analizar = analizar.replace(matchs[i], "@SIMPLE_" + i)
      comentarios.push(["@SIMPLE_" + i, matchs[i]])
    }
  }

  matchs = texto.match(comentarioMultiLinea)
  if(matchs !== null){
    for(var i = 0; i < matchs.length; i++){
      analizar = analizar.replace(matchs[i], "@MULTI_" + i)
      comentarios.push(["@MULTI_" + i, matchs[i]])
    }
  }

  //Seteamos los valores para el analizador lexico
  var linea = 0;
  var columna = 0;
  var lexema = "";
  var line = 0;

  //Obtenemos todas las lineas que estan en el texto
  var lines = analizar.match(/^.*((\r\n|\n|\r)|$)/gm);

  //Recorremos las lineas para obtener las filas
  for(linea = 0; linea < lines.length; linea++){
    //Recorremos cada linea caracter por caracter para obtener la columna
    for(columna = 0; columna < lines[linea].length; columna++){
      switch(lines[linea].charAt(columna)){

        //#region Espacio en blanco
        case " ":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, line + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
            }
            lexema = "";
          }
          break;
        //#endregion

        //#region Salto de linea
        case "\n":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, line + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
            }
            lexema = "";
          }
          break;
        //#endregion

        //#region Retorno de Carro
        case "\r":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, line + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
            }
            lexema = "";
          }
          break;
        //#endregion
        
        //#region Comilla Doble
        case "\"":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, line + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
            }
            lexema = "";
          }

          do{
            lexema += lines[linea].charAt(columna);
            if(columna === (lines[linea].length) - 1){
              break;
            }
            columna++;
          }while(lines[linea].charAt(columna) !== "\"")
          lexema += lines[linea].charAt(columna);

          if(buscarNombre(lexema) === "error"){
            listaErrores.push(new Error("Sintactico", lexema, line + 1, columna, "Se esperaba comillas al final de la cadena "))
          }else{
            listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
          }
          lexema = "";
          break;
        //#endregion

        //#region Comilla Simple
        case "\'":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, line + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
            }
            lexema = "";
          }
          do{
            lexema += lines[linea].charAt(columna);
            if(columna === (lines[linea].length) - 1){
              break;
            }
            columna++;
          }while(lines[linea].charAt(columna) !== "\'")
          lexema += lines[linea].charAt(columna);

          if(buscarNombre(lexema) === "error"){
            listaErrores.push(new Error("Sintactico", lexema, line + 1, columna, "Se esperaba comillas al final de la cadena "))
          }else{
            listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
          }
          lexema = "";
          break;
        //#endregion

        //#region Parentesis Abierto
        case "(":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, line + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
            }
            lexema = "";
          }
          listaTokens.push(new Token("parenA", "(", line + 1, columna));
          break;
        //#endregion

        //#region Parentesis Cerrado
        case ")":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, line + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
            }
            lexema = "";
          }
          listaTokens.push(new Token("parenC", ")", line + 1, columna));
          break;
        //#endregion

        //#region Llave Abierta
        case "{":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, line + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
            }
            lexema = "";
          }
          listaTokens.push(new Token("llaveA", "{", line + 1, columna));
          break;
        //#endregion

        //#region Llave Cerrada
        case "}":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, line + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
            }
            lexema = "";
          }
          listaTokens.push(new Token("llaveC", "}", line + 1, columna));
          break;
        //#endregion

        //#region Coma
        case ",":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, line + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
            }
            lexema = "";
          }
          listaTokens.push(new Token("coma", ",", line + 1, columna));
          break;
        //#endregion

        //#region Dos Puntos
        case ":":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, line + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
            }
            lexema = "";
          }
          listaTokens.push(new Token("dosPuntos", ":", line + 1, columna));
          break;
        //#endregion

        //#region Punto
        case ".":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, line + 1, columna, "Caracter no valido en la cadena "))
            }else{
              if(lexema === "Console"){
                listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
                listaTokens.push(new Token("punto", ".", line + 1, columna));
                lexema = "";
              }else{
                lexema = lexema + lines[linea].charAt(columna)
              }
            }
          }
          break;
        //#endregion

        //#region Punto y Coma
        case ";":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, line + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
            }
            lexema = "";
          }
          listaTokens.push(new Token("puntoComa", ";", line + 1, columna));
          break;
        //#endregion

        //#region Igual
        case "=":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, line + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
            }
            lexema = "";
          }
          if(lines[linea].charAt(columna + 1) === "="){
            listaTokens.push(new Token("igualdad", "==", line + 1, columna))
            columna++
          }else{
            listaTokens.push(new Token("igual", "=", line + 1, columna))
          }
          break;
        //#endregion

        //#region Mas
        case "+":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, line + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
            }
            lexema = "";
          }
          if(lines[linea].charAt(columna + 1) === "+"){
            listaTokens.push(new Token("incremento", "++", line + 1, columna))
            columna++
          }else{
            listaTokens.push(new Token("suma", "+", line + 1, columna))
          }
          break;
        //#endregion

        //#region Menos
        case "-":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, line + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
            }
            lexema = "";
          }
          if(lines[linea].charAt(columna + 1) === "-"){
            listaTokens.push(new Token("decremento", "--", line + 1, columna))
            columna++;
          }else{
            listaTokens.push(new Token("resta", "-", line + 1, columna))
          }
          break;
        //#endregion

        //#region Asterisco
        case "*":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, line + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
            }
            lexema = "";
          }
          listaTokens.push(new Token("multiplicacion", "*", line + 1, columna));
          break;
        //#endregion

        //#region Diagonal
        case "/":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, line + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
            }
            lexema = "";
          }
          listaTokens.push(new Token("division", "/", line + 1, columna));
          break;
        //#endregion

        //#region Amperson
        case "&":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, line + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
            }
            lexema = "";
          }
          if(lines[linea].charAt(columna + 1) === "&"){
              listaTokens.push(new Token("and", "&&", line + 1, columna));
              columna++;
          }else{
            listaErrores.push(new Error("Lexico", lexema, line + 1, columna))
          }
          break;
        //#endregion

        //#region Barra
        case "|":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, line + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
            }
            lexema = "";
          }
          if(lines[linea].charAt(columna + 1) === "|"){
              listaTokens.push(new Token("or", "||", line + 1, columna));
              columna++;
          }else{
            listaErrores.push(new Error("Lexico", lexema, line + 1, columna))
          }
          break;
        //#endregion

        //#region Admiracion
        case "!":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, line + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
            }
            lexema = "";
          }
          if(lines[linea].charAt(columna + 1) === "="){
            listaTokens.push(new Token("distinto", "!=", line + 1, columna))
            columna++;
          }else{
            listaTokens.push(new Token("not", "!", line + 1, columna))
          }
          break;
        //#endregion

        //#region Mayor
        case ">":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, line + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
            }
            lexema = "";
          }
          if(lines[linea].charAt(columna + 1) === "="){
            listaTokens.push(new Token("mayorIgual", ">=", line + 1, columna))
            columna++;
          }else{
            listaTokens.push(new Token("mayor", ">", line + 1, columna))
          }
          break;
        //#endregion

        //#region Menor
        case "<":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, line + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, line + 1, columna));
            }
            lexema = "";
          }
          if(lines[linea].charAt(columna + 1) === "="){
            listaTokens.push(new Token("menorIgual", "<=", line + 1, columna))
            columna++;
          }else{
            listaTokens.push(new Token("menor", "<", line + 1, columna))
          }
          break;
        //#endregion

        //#region Tabulacion
        case "\t":
          break;
        //#endregion

        //#region Default
        default:
          lexema = lexema + lines[linea].charAt(columna)
          break;
        //#endregion
      }
    }
    line++;
  }
}
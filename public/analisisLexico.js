//Expresiones regulares
const comentarioLinea = /\/\/.*/gm
const comentarioMultiLinea = /\/\*[^\*\/]*\*\//gm
const identificador = /^[a-zA-Z][\w_]*$/
const cadena = /^\"[^\"]*\"$/
const caracter = /^'[^']'$/
const entero = /^\d+$/
const html = /^'[^']*'$/
const boleano = /^true|false$/
const doble = /^\d+\.\d+$/

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
      if(lexema.match(boleano)){
        return "boleano"
      }
      if(lexema.match(identificador)){
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
  var analizar = texto.replace(comentarioLinea, "")
  analizar = analizar.replace(comentarioMultiLinea, "")

  //Seteamos los valores para el analizador lexico
  var linea = 0;
  var columna = 0;
  var lexema = "";

  //Obtenemos todas las lineas que estan en el texto
  var lines = analizar.match(/^.*((\r\n|\n|\r)|$)/gm);

  //Recorremos las lineas para obtener las filas
  for(linea = 0; linea < lines.length; linea++){
    //Recorremos cada linea caracter por caracter para obtener la columna
    for(columna = 0; columna < lines[linea].length; columna++){
      switch(lines[linea].charAt(columna)){
        //Encontro un espacio en blanco, termino el lexema si no esta en cadena

        //#region Espacio en blanco
        case " ":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, linea + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
            }
            lexema = "";
          }
          break;
        //#endregion

        //#region Salto de linea
        case "\n":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, linea + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
            }
            lexema = "";
          }
          break;
        //#endregion

        //#region Retorno de Carro
        case "\r":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, linea + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
            }
            lexema = "";
          }
          break;
        //#endregion
        
        //#region Comilla Doble
        case "\"":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, linea + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
            }
            listaTokens.push(nuevoToken);
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
            listaErrores.push(new Error("Sintactico", lexema, linea + 1, columna, "Se esperaba comillas al final de la cadena "))
          }else{
            listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
          }
          lexema = "";
          break;
        //#endregion

        //#region Comilla Simple
        case "\'":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, linea + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
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
            listaErrores.push(new Error("Sintactico", lexema, linea + 1, columna, "Se esperaba comillas al final de la cadena "))
          }else{
            listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
          }
          lexema = "";
          break;
        //#endregion

        //#region Parentesis Abierto
        case "(":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, linea + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
            }
            lexema = "";
          }
          listaTokens.push(new Token("parenA", "(", linea + 1, columna));
          break;
        //#endregion

        //#region Parentesis Cerrado
        case ")":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, linea + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
            }
            lexema = "";
          }
          listaTokens.push(new Token("parenC", ")", linea + 1, columna));
          break;
        //#endregion

        //#region Llave Abierta
        case "{":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, linea + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
            }
            lexema = "";
          }
          listaTokens.push(new Token("llaveA", "{", linea + 1, columna));
          break;
        //#endregion

        //#region Llave Cerrada
        case "}":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, linea + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
            }
            lexema = "";
          }
          listaTokens.push(new Token("llaveC", "}", linea + 1, columna));
          break;
        //#endregion

        //#region Coma
        case ",":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, linea + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
            }
            lexema = "";
          }
          listaTokens.push(new Token("coma", ",", linea + 1, columna));
          break;
        //#endregion

        //#region Dos Puntos
        case ":":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, linea + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
            }
            lexema = "";
          }
          listaTokens.push(new Token("dosPuntos", ":", linea + 1, columna));
          break;
        //#endregion

        //#region Punto
        case ".":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, linea + 1, columna, "Caracter no valido en la cadena "))
            }else{
              if(lexema === "Console"){
                listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
                listaTokens.push(new Token("punto", ".", linea + 1, columna));
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
              listaErrores.push(new Error("Lexico", lexema, linea + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
            }
            lexema = "";
          }
          listaTokens.push(new Token("puntoComa", ";", linea + 1, columna));
          break;
        //#endregion

        //#region Igual
        case "=":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, linea + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
            }
            lexema = "";
          }
          columna++;
          if(lines[linea].charAt(columna) === "="){
            listaTokens.push(new Token("igualdad", "==", linea + 1, columna))
          }else{
            listaTokens.push(new Token("igual", "=", linea + 1, columna))
          }
          break;
        //#endregion

        //#region Mas
        case "+":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, linea + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
            }
            lexema = "";
          }
          columna++;
          if(lines[linea].charAt(columna) === "+"){
            listaTokens.push(new Token("incremento", "++", linea + 1, columna))
          }else{
            listaTokens.push(new Token("suma", "+", linea + 1, columna))
          }
          break;
        //#endregion

        //#region Menos
        case "-":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, linea + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
            }
            lexema = "";
          }
          columna++;
          if(lines[linea].charAt(columna) === "-"){
            listaTokens.push(new Token("decremento", "--", linea + 1, columna))
          }else{
            listaTokens.push(new Token("resta", "-", linea + 1, columna))
          }
          break;
        //#endregion

        //#region Asterisco
        case "*":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, linea + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
            }
            lexema = "";
          }
          listaTokens.push(new Token("multiplicacion", "*", linea + 1, columna));
          break;
        //#endregion

        //#region Diagonal
        case "/":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, linea + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
            }
            lexema = "";
          }
          listaTokens.push(new Token("division", "/", linea + 1, columna));
          break;
        //#endregion

        //#region Amperson
        case "&":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, linea + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
            }
            lexema = "";
          }
          columna++;
          if(lines[linea].charAt(columna) === "&"){
              listaTokens.push(new Token("and", "&&", linea + 1, columna));
          }else{
            listaErrores.push(new Error("Lexico", lexema, linea + 1, columna))
          }
          break;
        //#endregion

        //#region Barra
        case "|":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, linea + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
            }
            lexema = "";
          }
          columna++;
          if(lines[linea].charAt(columna) === "|"){
              listaTokens.push(new Token("or", "||", linea + 1, columna));
          }else{
            listaErrores.push(new Error("Lexico", lexema, linea + 1, columna))
          }
          break;
        //#endregion

        //#region Admiracion
        case "!":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, linea + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
            }
            lexema = "";
          }
          columna++;
          if(lines[linea].charAt(columna) === "="){
            listaTokens.push(new Token("distinto", "!=", linea + 1, columna))
          }else{
            listaTokens.push(new Token("not", "!", linea + 1, columna))
          }
          break;
        //#endregion

        //#region Mayor
        case ">":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, linea + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
            }
            lexema = "";
          }
          columna++;
          if(lines[linea].charAt(columna) === "="){
            listaTokens.push(new Token("mayorIgual", ">=", linea + 1, columna))
          }else{
            listaTokens.push(new Token("mayor", ">", linea + 1, columna))
          }
          break;
        //#endregion

        //#region Menor
        case "<":
          if(lexema !== ""){
            if(buscarNombre(lexema) === "error"){
              listaErrores.push(new Error("Lexico", lexema, linea + 1, columna, "Caracter no valido en la cadena "))
            }else{
              listaTokens.push(new Token(buscarNombre(lexema), lexema, linea + 1, columna));
            }
            lexema = "";
          }
          columna++;
          if(lines[linea].charAt(columna) === "="){
            listaTokens.push(new Token("menorIgual", "<=", linea + 1, columna))
          }else{
            listaTokens.push(new Token("menor", "<", linea + 1, columna))
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
  }
}
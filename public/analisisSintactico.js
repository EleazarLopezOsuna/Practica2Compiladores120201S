var operandos = [
  "entero", "caracter", "doble", "cadena", "boleano", "html", "identificador"
]

var operadores = [
  "suma", "resta", "multiplicacion", "division", "and", "or", "not", "distinto",
  "mayor", "mayorIgual", "menor", "menorIgual", "igualdad"
]

var tipos = [
  "int", "char", "bool", "string", "double"
]

var comentarios = []

class nodoArbol {
  constructor(nombre, valor, tipo, hijos, linea) {
    this.nombre = nombre
    this.valor = valor
    this.tipo = tipo
    this.hijos = hijos
    this.linea = linea
  }
}

var contador = 0;
let raiz

function imprimirRaiz(nodo, cadena){
  cadena += (nodo.nombre + "[label=\"" + nodo.valor.replace(/\"/g, "").replace(/\'/g, "") + "\"];\n")
  for(var i = 0; i < nodo.hijos.length; i++){
    cadena += (nodo.nombre + " -> " + nodo.hijos[i].nombre + ";\n")
    cadena += imprimirRaiz(nodo.hijos[i], "")
  }
  return cadena
}

function iniciarAnalisisSintactico(tokens, errores, comments){
  comentarios = comments
  let retorno = []
  raiz = new nodoArbol("INICIO_" + contador++, "INICIO", "inicio" ,[])
  for(var i = 0; i < tokens.length; i++){
    var tokenAnalizar = tokens[i];
    switch(tokenAnalizar.nombre){

      //#region FUNCION IMPRIMIR
      case "console":
        retorno = comprobarImprimir(tokens, i + 1, errores);
        i = retorno[0]
        raiz.hijos.push(retorno[1])
        break;
      //#endregion

      //#region FUNCION DECLARACION DE VARIABLES
      case "int":
      case "char":
      case "double":
      case "string":
      case "bool":
        retorno = comprobarDeclaracion(tokens, i + 1, errores, 
          new nodoArbol("TIPO_" + contador++, tokenAnalizar.lexema, tokenAnalizar.nombre, [], tokenAnalizar.linea));
        i = retorno[0];
        raiz.hijos.push(retorno[1])
        break;
      //#endregion

      //#region FUNCION REASIGNACION DE VARIABLES
      case "identificador":
        retorno = comprobarReasignacion(tokens, i + 1, errores, 
          new nodoArbol("OPERANDO_" + contador++, tokenAnalizar.lexema, tokenAnalizar.nombre, [], tokenAnalizar.linea));
        i = retorno[0];
        raiz.hijos.push(retorno[1])
        break;
      //#endregion

      //#region FUNCION METODO
      case "void":
        retorno = comprobarMetodo(tokens, i + 1, errores);
        i = retorno[0];
        raiz.hijos.push(retorno[1])
        break;
      //#endregion

      //#region FUNCION WHILE
      case "while":
        retorno = comprobarWhile(tokens, i + 1, errores);
        i = retorno[0];
        raiz.hijos.push(retorno[1])
        break;
      //#endregion
    
      //#region FUNCION DO-WHILE
      case "do":
        retorno = comprobarDoWhile(tokens, i + 1, errores);
        i = retorno[0];
        raiz.hijos.push(retorno[1])
        break;
      //#endregion
    
      //#region FUNCION SWITCH
      case "switch":
        retorno = comprobarSwitch(tokens, i + 1, errores);
        i = retorno[0];
        raiz.hijos.push(retorno[1])
        break;
      //#endregion

      //#region FUNCION IF
      case "if":
        retorno = comprobarIf(tokens, i + 1, errores);
        i = retorno[0];
        raiz.hijos.push(retorno[1])
        break;
      //#endregion
    
      //#region FUNCION FOR
      case "for":
        retorno = comprobarFor(tokens, i + 1, errores);
        i = retorno[0];
        raiz.hijos.push(retorno[1])
        break;
      //#endregion

      //#region COMENTARIOS
      case "comentario":
        for(var j = 0; j < comentarios.length; j++){
          if(comentarios[j][0] === tokenAnalizar.lexema){
            if(tokenAnalizar.lexema.startsWith("@S")){
              raiz.hijos.push(new nodoArbol("COMENTARIO_" + contador++, comentarios[j][1], "linea", []))
            }else{
              raiz.hijos.push(new nodoArbol("COMENTARIO_" + contador++, comentarios[j][1], "multi", []))
            }
            break;
          }
        }
        break;
      //#endregion

      //#region ERROR
      default:
        errores.push(new Error("Sintactico", tokens[i].nombre, tokens[i].linea, tokens[i].columna, 
                "Se esperaba console, tipo, identificador, void, while, do, switch o if, se encontro: "))
        break;
      //#endregion
    }
    if(i === -1){
      break;
    }
  }
  console.log(imprimirRaiz(raiz, ""))
  return [errores, raiz]
}

function instrucciones(token, index, errores){
  var instruccion = new nodoArbol("INSTRUCCION_" + contador++, "INSTRUCCION", "instruccion" ,[])
  for(var i = index; i < token.length; i++){
    var tokenAnalizar = token[i];
    switch(tokenAnalizar.nombre){

      //#region FUNCION IMPRIMIR
      case "console":
        retorno = comprobarImprimir(token, i + 1, errores);
        i = retorno[0]
        instruccion.hijos.push(retorno[1])
        break;
      //#endregion

      //#region FUNCION DECLARACION DE VARIABLES
      case "int":
      case "char":
      case "double":
      case "string":
      case "bool":
        retorno = comprobarDeclaracion(token, i + 1, errores, 
          new nodoArbol("TIPO_" + contador++, tokenAnalizar.lexema, tokenAnalizar.nombre, [], tokenAnalizar.linea));
        i = retorno[0];
        instruccion.hijos.push(retorno[1])
        break;
      //#endregion

      //#region FUNCION REASIGNACION DE VARIABLES
      case "identificador":
        retorno = comprobarReasignacion(token, i + 1, errores, 
          new nodoArbol("OPERANDO_" + contador++, tokenAnalizar.lexema, tokenAnalizar.nombre, [], tokenAnalizar.linea));
        i = retorno[0];
        instruccion.hijos.push(retorno[1])
        break;
      //#endregion

      //#region FUNCION WHILE
      case "while":
        retorno = comprobarWhile(token, i + 1, errores);
        i = retorno[0];
        instruccion.hijos.push(retorno[1])
        break;
      //#endregion

      //#region FUNCION DO-WHILE
      case "do":
        retorno = comprobarDoWhile(token, i + 1, errores);
        i = retorno[0];
        instruccion.hijos.push(retorno[1])
        break;
      //#endregion

      //#region SALIDAS
      case "llaveC":
      case "case":
      case "default":
        return [i, instruccion, tokenAnalizar.nombre]
      //#endregion
    
      //#region FUNCION SWITCH
      case "switch":
        retorno = comprobarSwitch(token, i + 1, errores);
        i = retorno[0];
        instruccion.hijos.push(retorno[1])
        break;
      //#endregion
    
      //#region FUNCION IF
      case "if":
        retorno = comprobarIf(token, i + 1, errores);
        i = retorno[0];
        instruccion.hijos.push(retorno[1])
        break;
      //#endregion
    
      //#region FUNCION FOR
      case "for":
        retorno = comprobarFor(token, i + 1, errores);
        i = retorno[0];
        instruccion.hijos.push(retorno[1])
        break;
      //#endregion
    
      //#region FUNCION OTROS
      case "return":
      case "continue":
      case "break":
        retorno = comprobarOtros(token, i + 1, errores, tokenAnalizar.nombre);
        i = retorno[0];
        instruccion.hijos.push(retorno[1])
        break;
      //#endregion
    
      //#region COMENTARIOS
      case "comentario":
        for(var j = 0; j < comentarios.length; j++){
          if(comentarios[j][0] === tokenAnalizar.lexema){
            if(tokenAnalizar.lexema.startsWith("@S")){
              instruccion.hijos.push(new nodoArbol("COMENTARIO_" + contador++, comentarios[j][1], "linea", []))
            }else{
              instruccion.hijos.push(new nodoArbol("COMENTARIO_" + contador++, comentarios[j][1], "multi", []))
            }
            break;
          }
        }
        break;
      //#endregion

      //#region ERROR
      default:
        errores.push(new Error("Sintactico", tokenAnalizar.nombre, tokenAnalizar.linea, tokenAnalizar.columna, 
                "Se esperaba console, tipo, identificador, void, while, do, switch o if, se encontro: "))
        break;
      //#endregion
    }
    if(i === -1){
      break;
    }
  }
  return [-1, instruccion, 0]
}

function comprobarOtros(token, index, errores, nombre){
  let estado
  if(nombre === "return"){
    var funcReturn = new nodoArbol("RETURN_" + contador++, "RETURN", "return", [] , token[index].linea)
    estado = "RETURN"
    while(index !== token.length){
      switch(estado){
        case "RETURN":
          if(!operandos.includes(token[index].nombre)){
            errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
                "Se esperaba operando, se encontro: "))
                while(index !== token.length){
                  if(token[index].nombre === "puntoComa"){
                    estado = "R1"
                    index--
                    break
                  }
                  index++
                }
          }else{
            estado = "R1"
            funcReturn.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, [], token[index].linea));
          }
          break;
        case "R1":
          if(operadores.includes(token[index].nombre)){
            funcReturn.hijos.push(new nodoArbol("OPERADOR_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
            estado = "R2"
          }else if(token[index].nombre === "puntoComa"){
            estado = "R3"
          }else{
            errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
                "Se esperaba operador o punto y coma, se encontro: "))
                while(index !== token.length){
                  if(token[index].nombre === "puntoComa"){
                    estado = "R1"
                    index--
                    break
                  }
                  index++
                }
          }
          break;
        case "R2":
          if(!operandos.includes(token[index].nombre)){
            errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
                "Se esperaba operando, se encontro: "))
                while(index !== token.length){
                  if(token[index].nombre === "puntoComa"){
                    estado = "R1"
                    index--
                    break
                  }
                  index++
                }
          }else{
            estado = "R1"
            funcReturn.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
          }
          break;
      }
      if(estado === "R3"){
        return [index, funcReturn]
      }
      index++;
    }
    return [-1, funcReturn]
  }else if(nombre === "continue"){
    var funcReturn = new nodoArbol("CONTINUE_" + contador++, "CONTINUE", "continue", [] , token[index].linea)
    estado = "CONTINUE"
    while(index !== token.length){
      switch(estado){
        case "CONTINUE":
          if(token[index].nombre === "puntoComa"){
            estado = "R3"
          }else{
            errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
                "Se esperaba operando, se encontro: "))
                while(index !== token.length){
                  if(token[index].nombre === "puntoComa"){
                    estado = "CONTINUE"
                    index--
                    break
                  }
                  index++
                }
          }
          break;
      }
      if(estado === "R3"){
        return [index, funcReturn]
      }
      index++;
    }
    return [-1, funcReturn]
  }else{
    var funcReturn = new nodoArbol("BREAK_" + contador++, "break", "break", [] , token[index].linea)
    estado = "BREAK"
    while(index !== token.length){
      switch(estado){
        case "BREAK":
          if(token[index].nombre === "puntoComa"){
            estado = "R3"
          }else{
            errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
                "Se esperaba operando, se encontro: "))
                while(index !== token.length){
                  if(token[index].nombre === "puntoComa"){
                    estado = "BREAK"
                    index--
                    break
                  }
                  index++
                }
          }
          break;
      }
      if(estado === "R3"){
        return [index, funcReturn]
      }
      index++;
    }
    return [-1, funcReturn]
  }
}

function comprobarFor(token, index, errores){
  let estado = "FOR"
  var inicio = new nodoArbol("INICIALIZACION_" + contador++, "INICIALIZACION", "inicializacion", [] , token[index].linea)
  var medio = new nodoArbol("CONDICION_" + contador++, "CONDICION", "condicion", [] , token[index].linea)
  var final = new nodoArbol("UPDATE_" + contador++, "UPDATE", "update", [] , token[index].linea)
  var valor
  var funcFor = new nodoArbol("FOR_" + contador++, "FOR", "for", [inicio, medio, final])
  while(index !== token.length){
    switch(estado){
      case "FOR":
        if(token[index].nombre !== "parenA"){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
            "Se esperaba parentesis abierto, se encontro: "))
            while(index !== token.length){
              if(token[index].nombre === "parenA"){
                estado = "FOR"
                index--
                break
              }else if(token[index].nombre === "parenC"){
                estado = "F11"
                index--
                break
              }else if(token[index].nombre === "llaveA"){
                estado = "F12"
                index--
                break
              }else if(token[index].nombre === "llaveC"){
                estado = "F_IN"
                index--
                break
              }
              index++
            }
        }else{
          estado = "F1"
        }
        break;
      case "F1":
        if(!tipos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba tipo, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "FOR"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "F11"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "F12"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "F_IN"
                  index--
                  break
                }
                index++
              }
        }else{
          inicio.hijos.push(new nodoArbol("TIPO_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
          estado = "F2"
        }
        break;
      case "F2":
        if(token[index].nombre !== "identificador"){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
            "Se esperaba identificador, se encontro: "))
            while(index !== token.length){
              if(token[index].nombre === "parenA"){
                estado = "FOR"
                index--
                break
              }else if(token[index].nombre === "parenC"){
                estado = "F11"
                index--
                break
              }else if(token[index].nombre === "llaveA"){
                estado = "F12"
                index--
                break
              }else if(token[index].nombre === "llaveC"){
                estado = "F_IN"
                index--
                break
              }
              index++
            }
        }else{
          inicio.hijos.push(new nodoArbol("NOMBRE_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
          estado = "F3"
        }
        break;
      case "F3":
        if(token[index].nombre !== "igual"){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
            "Se esperaba igual, se encontro: "))
            while(index !== token.length){
              if(token[index].nombre === "parenA"){
                estado = "FOR"
                index--
                break
              }else if(token[index].nombre === "parenC"){
                estado = "F11"
                index--
                break
              }else if(token[index].nombre === "llaveA"){
                estado = "F12"
                index--
                break
              }else if(token[index].nombre === "llaveC"){
                estado = "F_IN"
                index--
                break
              }
              index++
            }
        }else{
          valor = new nodoArbol("VALOR_" + contador++, "VALOR", "valor", [] , token[index].linea)
          estado = "F4"
        }
        break;
      case "F4":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "FOR"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "F11"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "F12"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "F_IN"
                  index--
                  break
                }
                index++
              }
        }else{
          estado = "F5"
          valor.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
        }
        break;
      case "F5":
        if(operadores.includes(token[index].nombre)){
          valor.hijos.push(new nodoArbol("OPERADOR_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
          estado = "F6"
        }else if(token[index].nombre === "puntoComa"){
          inicio.hijos.push(valor)
          estado = "F7"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operador o punto y coma, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "FOR"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "F11"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "F12"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "F_IN"
                  index--
                  break
                }
                index++
              }
        }
        break;
      case "F6":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "FOR"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "F11"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "F12"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "F_IN"
                  index--
                  break
                }
                index++
              }
        }else{
          estado = "F5"
          valor.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
        }
        break;
      case "F7":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "FOR"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "F11"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "F12"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "F_IN"
                  index--
                  break
                }
                index++
              }
        }else{
          estado = "F8"
          medio.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
        }
        break;
      case "F8":
        if(operadores.includes(token[index].nombre)){
          medio.hijos.push(new nodoArbol("OPERADOR_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
          estado = "F9"
        }else if(token[index].nombre === "puntoComa"){
          estado = "F10"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operador o punto y coma, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "FOR"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "F11"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "F12"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "F_IN"
                  index--
                  break
                }
                index++
              }
        }
        break;
      case "F9":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "FOR"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "F11"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "F12"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "F_IN"
                  index--
                  break
                }
                index++
              }
        }else{
          estado = "F8"
          medio.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
        }
        break;
      case "F10":
        if(token[index].nombre === "identificador"){
          final.hijos.push(new nodoArbol("VARIABLE_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
          index++;
          if(token[index].nombre === "incremento" || token[index].nombre === "decremento"){
            final.hijos.push(new nodoArbol("VARIABLE_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
            estado = "F11"
          }else{
            errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
                "Se esperaba incremento o decremento, se encontro: "))
                while(index !== token.length){
                  if(token[index].nombre === "parenA"){
                    estado = "FOR"
                    index--
                    break
                  }else if(token[index].nombre === "parenC"){
                    estado = "F11"
                    index--
                    break
                  }else if(token[index].nombre === "llaveA"){
                    estado = "F12"
                    index--
                    break
                  }else if(token[index].nombre === "llaveC"){
                    estado = "F_IN"
                    index--
                    break
                  }
                  index++
                }
          }
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba llave cerrada, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "FOR"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "F11"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "F12"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "F_IN"
                  index--
                  break
                }
                index++
              }
        }
        break;
      case "F11":
        if(token[index].nombre === "parenC"){
          estado = "F12"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba parentesis cerrado, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "FOR"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "F11"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "F12"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "F_IN"
                  index--
                  break
                }
                index++
              }
        }
        break;
      case "F12":
        if(token[index].nombre === "llaveA"){
          var inst = instrucciones(token, index + 1, errores);
          if(inst[0] === -1){
            return [-1, funcFor]
          }
          index = inst[0] - 1;
          funcFor.hijos.push(inst[1])
          estado = "F_IN"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba llave abierta, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "llaveC"){
                  estado = "F_IN"
                  index--
                  break
                }
                index++
              }
        }
        break;
      case "F_IN":
        if(token[index].nombre === "llaveC"){
          estado = "F14"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba llave cerrada, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "FOR"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "F11"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "F12"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "F_IN"
                  index--
                  break
                }
                index++
              }
        }
        break;
    }
    if(estado === "F14"){
        return [index, funcFor]
    }
    index++;
  }
  return [-1, funcFor]
}

function comprobarIf(token, index, errores){
  var legal = true
  let estado = "IF"
  var condicion = new nodoArbol("CONDICION_" + contador++, "CONDICION", "condicion", [] , token[index].linea)
  var funcIf = new nodoArbol("IF_" + contador++, "IF", "if", [condicion])
  while(index !== token.length){
    switch(estado){
      case "IF":
        if(token[index].nombre !== "parenA"){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
            "Se esperaba parentesis abierto, se encontro: "))
            while(index !== token.length){
              if(token[index].nombre === "parenA"){
                estado = "IF"
                index--
                break
              }else if(token[index].nombre === "parenC"){
                estado = "I2"
                index--
                break
              }else if(token[index].nombre === "llaveA"){
                estado = "I4"
                index--
                break
              }else if(token[index].nombre === "llaveC"){
                estado = "I_IN"
                index--
                break
              }
              index++
            }
        }else{
          estado = "I1"
        }
        break;
      case "I1":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "IF"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "I2"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "I4"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "I_IN"
                  index--
                  break
                }
                index++
              }
        }else{
          estado = "I2"
          condicion.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
        }
        break;
      case "I2":
        if(operadores.includes(token[index].nombre)){
          condicion.hijos.push(new nodoArbol("OPERADOR_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
          estado = "I3"
        }else if(token[index].nombre === "parenC"){
          estado = "I4"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operador o parentesis cerrado, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "IF"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "I2"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "I4"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "I_IN"
                  index--
                  break
                }
                index++
              }
        }
        break;
      case "I3":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "IF"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "I2"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "I4"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "I_IN"
                  index--
                  break
                }
                index++
              }
        }else{
          estado = "I2"
          condicion.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
        }
        break;
      case "I4":
        if(token[index].nombre === "llaveA"){
          var inst = instrucciones(token, index + 1, errores);
          if(inst[0] === -1){
            return [-1, funcIf]
          }
          index = inst[0] - 1;
          funcIf.hijos.push(inst[1])
          estado = "I_IN"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
            "Se esperaba llave abierta, se encontro: "))
            while(index !== token.length){
              if(token[index].nombre === "llaveC"){
                estado = "I_IN"
                index--
                break
              }
              index++
            }
        }
        break;
      case "I_IN":
        if(token[index].nombre === "llaveC"){
          estado = "I6"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba llave cerrada, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "IF"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "I2"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "I4"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "I_IN"
                  index--
                  break
                }
                index++
              }
        }
        break;
    }
    if(estado === "I6"){
      if((index + 1) < token.length){
        if(token[index + 1].nombre === "else"){
          if(token[index + 2].nombre === "if"){
            var funcElseIf2 = new nodoArbol("ELSEIF_" + contador++, "ELSEIF", "elseif", [] , token[index].linea)
            var funcElseIf = new nodoArbol("ELSEIF_" + contador++, "ELSEIF", "elseif", [funcElseIf2] , token[index].linea)
            var retorno = comprobarIf(token, index + 3, errores);
            var indx = index + 2
            index = retorno[0];
            if(legal){
              funcElseIf2.hijos = retorno[1].hijos
              funcIf.hijos.push(funcElseIf)
            }else{
              errores.push(new Error("Sintactico", token[indx].nombre, token[indx].linea, token[indx].columna, 
                "No se espera Else-If despues de Else"))
            }
            return [index, funcIf]
          }else if(token[index + 2].nombre === "llaveA"){
            legal = false
            var funcElse2 = new nodoArbol("ELSE_" + contador++, "ELSE", "else", [] , token[index].linea)
            var funcElse = new nodoArbol("ELSE_" + contador++, "ELSE", "else", [funcElse2] , token[index].linea)
            var inst = instrucciones(token, index + 3, errores);
            if(inst[0] === -1){
              return [-1, funcIf]
            }
            index = inst[0] - 1;
            funcElse2.hijos.push(inst[1])
            funcIf.hijos.push(funcElse)
            estado = "I_IN"
          }else{
            errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
                "Se esperaba if o llave abierta, se encontro: "))
                while(index !== token.length){
                  if(token[index].nombre === "parenA"){
                    estado = "IF"
                    index--
                    break
                  }else if(token[index].nombre === "parenC"){
                    estado = "I2"
                    index--
                    break
                  }else if(token[index].nombre === "llaveA"){
                    estado = "I4"
                    index--
                    break
                  }else if(token[index].nombre === "llaveC"){
                    estado = "I_IN"
                    index--
                    break
                  }
                  index++
                }
          }
        }else{
          return [index, funcIf]
        }
      }
    }
    index++;
  }
  return [-1, funcIf]
}

function comprobarSwitch(token, index, errores){
  let estado = "SWITCH"
  var funcCase = new nodoArbol("CASE_" + contador++, "CASE", "case", [] , token[index].linea)
  var condicion = new nodoArbol("CONDICION_" + contador++, "CONDICION", "condicion", [] , token[index].linea)
  var funcSwitch = new nodoArbol("SWITCH_" + contador++, "SWITCH", "switch", [condicion])
  while(index !== token.length){
    switch(estado){
      case "SWITCH":
        if(token[index].nombre !== "parenA"){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
            "Se esperaba parentesis abierto, se encontro: "))
            while(index !== token.length){
              if(token[index].nombre === "parenA"){
                estado = "SWITCH"
                index--
                break
              }else if(token[index].nombre === "parenC"){
                estado = "S2"
                index--
                break
              }else if(token[index].nombre === "llaveA"){
                estado = "S3"
                index--
                break
              }else if(token[index].nombre === "llaveC"){
                estado = "S_IN"
                index--
                break
              }else if(token[index].nombre === "dosPuntos"){
                estado = "S6"
                index--
                break
              }
              index++
            }
        }else{
          estado = "S1"
        }
        break;
      case "S1":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "SWITCH"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "S2"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "S3"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "S_IN"
                  index--
                  break
                }else if(token[index].nombre === "dosPuntos"){
                  estado = "S6"
                  index--
                  break
                }
                index++
              }
        }else{
          estado = "S2"
          condicion.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
        }
        break;
      case "S2":
        if(token[index].nombre !== "parenC"){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
            "Se esperaba parentesis cerrado, se encontro: "))
            while(index !== token.length){
              if(token[index].nombre === "parenA"){
                estado = "SWITCH"
                index--
                break
              }else if(token[index].nombre === "parenC"){
                estado = "S2"
                index--
                break
              }else if(token[index].nombre === "llaveA"){
                estado = "S3"
                index--
                break
              }else if(token[index].nombre === "llaveC"){
                estado = "S_IN"
                index--
                break
              }else if(token[index].nombre === "dosPuntos"){
                estado = "S6"
                index--
                break
              }
              index++
            }
        }else{
          estado = "S3"
        }
        break;
      case "S3":
        if(token[index].nombre !== "llaveA"){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
            "Se esperaba llave abierta, se encontro: "))
            while(index !== token.length){
              if(token[index].nombre === "parenA"){
                estado = "SWITCH"
                index--
                break
              }else if(token[index].nombre === "parenC"){
                estado = "S2"
                index--
                break
              }else if(token[index].nombre === "llaveA"){
                estado = "S3"
                index--
                break
              }else if(token[index].nombre === "llaveC"){
                estado = "S_IN"
                index--
                break
              }else if(token[index].nombre === "dosPuntos"){
                estado = "S6"
                index--
                break
              }
              index++
            }
        }else{
          estado = "S4"
        }
        break;
      case "S4":
        if(token[index].nombre !== "case"){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
            "Se esperaba case, se encontro: "))
            while(index !== token.length){
              if(token[index].nombre === "parenA"){
                estado = "SWITCH"
                index--
                break
              }else if(token[index].nombre === "parenC"){
                estado = "S2"
                index--
                break
              }else if(token[index].nombre === "llaveA"){
                estado = "S3"
                index--
                break
              }else if(token[index].nombre === "llaveC"){
                estado = "S_IN"
                index--
                break
              }else if(token[index].nombre === "dosPuntos"){
                estado = "S6"
                index--
                break
              }
              index++
            }
        }else{
          estado = "S5"
        }
        break;
      case "S5":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "SWITCH"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "S2"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "S3"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "S_IN"
                  index--
                  break
                }else if(token[index].nombre === "dosPuntos"){
                  estado = "S6"
                  index--
                  break
                }
                index++
              }
        }else{
          estado = "S6"
          funcCase = new nodoArbol("CASE_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea)
        }
        break;
      case "S6":
        if(token[index].nombre === "dosPuntos"){
          var inst = instrucciones(token, index + 1, errores);
          if(inst[0] === -1){
            return [-1, funcCase]
          }
          index = inst[0] - 1;
          funcCase.hijos.push(inst[1])
          funcSwitch.hijos.push(funcCase);
          estado = "S_IN"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
            "Se esperaba dos puntos, se encontro: "))
            while(index !== token.length){
              if(token[index].nombre === "llaveC"){
                estado = "S_IN"
                index--
                break
              }
              index++
            }
        }
        break;
      case "S_IN":
        if(token[index].nombre === "case"){
          estado = "S5"
        }else if(token[index].nombre === "default"){
          funcCase = new nodoArbol("CASE_" + contador++, "default", "default", [] , token[index].linea)
          estado = "S8"
        }else if(token[index].nombre === "llaveC"){
          estado = "S9"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba llave cerrada, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "SWITCH"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "S2"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "S3"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "S_IN"
                  index--
                  break
                }else if(token[index].nombre === "dosPuntos"){
                  estado = "S6"
                  index--
                  break
                }
                index++
              }
        }
        break;
      case "S8":
        if(token[index].nombre === "dosPuntos"){
          var inst = instrucciones(token, index + 1, errores);
          if(inst[0] === -1){
            return [-1, funcCase]
          }
          index = inst[0] - 1;
          funcCase.hijos.push(inst[1])
          funcSwitch.hijos.push(funcCase);
          estado = "S_IN"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
            "Se esperaba dos puntos, se encontro: "))
            while(index !== token.length){
              if(token[index].nombre === "parenA"){
                estado = "SWITCH"
                index--
                break
              }else if(token[index].nombre === "parenC"){
                estado = "S2"
                index--
                break
              }else if(token[index].nombre === "llaveA"){
                estado = "S3"
                index--
                break
              }else if(token[index].nombre === "llaveC"){
                estado = "S_IN"
                index--
                break
              }else if(token[index].nombre === "dosPuntos"){
                estado = "S6"
                index--
                break
              }
              index++
            }
        }
        break;
    }
    if(estado === "S9"){
      return [index, funcSwitch]
    }
    index++;
  }
  return [-1, funcSwitch]
}

function comprobarDoWhile(token, index, errores){
  let estado = "DOWHILE"
  var condicion = new nodoArbol("CONDICION_" + contador++, "CONDICION", "condicion", [] , token[index].linea)
  var funcDoWhile = new nodoArbol("DOWHILE_" + contador++, "DOWHILE", "dowhile", [] , token[index].linea)
  while(index !== token.length){
    switch(estado){
      case "DOWHILE":
        if(token[index].nombre !== "llaveA"){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
            "Se esperaba llave abierta, se encontro: "))
            while(index !== token.length){
              if(token[index].nombre === "llaveC"){
                estado = "D_IN"
                index--
                break
              }
              index++
            }
        }else{
          var inst = instrucciones(token, index + 1, errores);
          if(inst[0] === -1){
            return [-1, funcDoWhile]
          }
          index = inst[0] - 1;
          funcDoWhile.hijos.push(inst[1])
          estado = "D_IN"
        }
        break;
      case "D_IN":
        if(token[index].nombre === "llaveC"){
          estado = "D2"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
                "Se esperaba llave cerrada, se encontro: "))
                while(index !== token.length){
                  if(token[index].nombre === "parenA"){
                    estado = "D3"
                    index--
                    break
                  }else if(token[index].nombre === "parenC"){
                    estado = "D5"
                    index--
                    break
                  }else if(token[index].nombre === "llaveA"){
                    estado = "DOWHILE"
                    index--
                    break
                  }else if(token[index].nombre === "llaveC"){
                    estado = "D_IN"
                    index--
                    break
                  }else if(token[index].nombre === "puntoComa"){
                    estado = "D7"
                    index--
                    break
                  }
                  index++
                }
        }
        break;
      case "D2":
        if(token[index].nombre !== "while"){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba while, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "D3"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "D5"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "DOWHILE"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "D_IN"
                  index--
                  break
                }else if(token[index].nombre === "puntoComa"){
                  estado = "D7"
                  index--
                  break
                }
                index++
              }
        }else{
          estado = "D3"
        }
        break;
      case "D3":
        if(token[index].nombre !== "parenA"){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba parentesis abierto, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "D3"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "D5"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "DOWHILE"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "D_IN"
                  index--
                  break
                }else if(token[index].nombre === "puntoComa"){
                  estado = "D7"
                  index--
                  break
                }
                index++
              }
        }else{
          estado = "D4";
        }
        break;
      case "D4":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "D3"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "D5"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "DOWHILE"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "D_IN"
                  index--
                  break
                }else if(token[index].nombre === "puntoComa"){
                  estado = "D7"
                  index--
                  break
                }
                index++
              }
        }else{
          condicion.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
          estado = "D5" 
        }
        break;
      case "D5":
        if(operadores.includes(token[index].nombre)){
          condicion.hijos.push(new nodoArbol("OPERADOR_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
          estado = "D6"
        }else if(token[index].nombre === "parenC"){
          funcDoWhile.hijos.push(condicion)
          estado = "D7"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operador o parentesis cerrado, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "D3"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "D5"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "DOWHILE"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "D_IN"
                  index--
                  break
                }else if(token[index].nombre === "puntoComa"){
                  estado = "D7"
                  index--
                  break
                }
                index++
              }
        }
        break;
      case "D6":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "D3"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "D5"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "DOWHILE"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "D_IN"
                  index--
                  break
                }else if(token[index].nombre === "puntoComa"){
                  estado = "D7"
                  index--
                  break
                }
                index++
              }
        }else{
          condicion.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
          estado = "D5" 
        }
        break;
      case "D7":
        if(token[index].nombre !== "puntoComa"){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba punto y coma, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "D3"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "D5"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "DOWHILE"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "D_IN"
                  index--
                  break
                }else if(token[index].nombre === "puntoComa"){
                  estado = "D7"
                  index--
                  break
                }
                index++
              }
        }else{
          estado = "D8"
        }
        break;
    }
    if(estado === "D8"){
      return [index, funcDoWhile]
    }
    index++;
  }
  return [-1, funcDoWhile]
}

function comprobarWhile(token, index, errores){
  let estado = "WHILE"
  var condicion = new nodoArbol("CONDICION_" + contador++, "CONDICION", "condicion", [] , token[index].linea)
  var funcWhile = new nodoArbol("WHILE_" + contador++, "WHILE", "while", [condicion])
  while(index !== token.length){
    switch(estado){
      case "WHILE":
        if(token[index].nombre !== "parenA"){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
            "Se esperaba parentesis abierto, se encontro: "))
            while(index !== token.length){
              if(token[index].nombre === "parenA"){
                estado = "WHILE"
                index--
                break
              }else if(token[index].nombre === "parenC"){
                estado = "W2"
                index--
                break
              }else if(token[index].nombre === "llaveA"){
                estado = "W4"
                index--
                break
              }else if(token[index].nombre === "llaveC"){
                estado = "W_IN"
                index--
                break
              }
              index++
            }
        }else{
          estado = "W1"
        }
        break;
      case "W1":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "WHILE"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "W2"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "W4"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "W_IN"
                  index--
                  break
                }
                index++
              }
        }else{
          estado = "W2"
          condicion.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
        }
        break;
      case "W2":
        if(operadores.includes(token[index].nombre)){
          condicion.hijos.push(new nodoArbol("OPERADOR_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
          estado = "W3"
        }else if(token[index].nombre === "parenC"){
          estado = "W4"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operador o parentesis cerrado, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "WHILE"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "W2"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "W4"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "W_IN"
                  index--
                  break
                }
                index++
              }
        }
        break;
      case "W3":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "WHILE"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "W2"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "W4"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "W_IN"
                  index--
                  break
                }
                index++
              }
        }else{
          estado = "W2"
          condicion.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
        }
        break;
      case "W4":
        if(token[index].nombre === "llaveA"){
          var inst = instrucciones(token, index + 1, errores);
          if(inst[0] === -1){
            return [-1, funcWhile]
          }
          index = inst[0] - 1;
          funcWhile.hijos.push(inst[1])
          estado = "W_IN"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
            "Se esperaba llave abierta, se encontro: "))
            while(index !== token.length){
              if(token[index].nombre === "llaveC"){
                estado = "W_IN"
                index--
                break
              }
              index++
            }
        }
        break;
      case "W_IN":
        if(token[index].nombre === "llaveC"){
          estado = "W6"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba llave cerrada, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "WHILE"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "W2"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "W4"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "W_IN"
                  index--
                  break
                }
                index++
              }
        }
        break;
    }
    if(estado === "W6"){
      return [index, funcWhile]
    }
    index++;
  }
  return [-1, funcWhile]
}

function comprobarMetodo(token, index, errores){
  let estado = "METODO";
  var metodo = new nodoArbol("METODO_" + contador++, "METODO", "metodo", [] , token[index].linea)
  var parametros = new nodoArbol("PARAMETROS_" + contador++, "PARAMETROS", "parametros", [] , token[index].linea)
  while(index !== token.length){
    switch(estado){
      case "METODO":
          if(token[index].nombre === "identificador"){
            metodo.hijos.push(new nodoArbol("NOMBRE_" + contador++, "NOMBRE", "nombre", [
              new nodoArbol("NOMBRE_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea)]))
            metodo.hijos.push(parametros)
            estado = "M8";
          }else if(token[index].nombre === "main"){
            estado = "M9"
            metodo.hijos.push(new nodoArbol("MAIN_" + contador++, "MAIN", "main", [
              new nodoArbol("NOMBRE_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea)
            ]))
          }else{
            errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba identificador, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  if(token[index + 1].nombre === "main"){
                    estado = "M8"
                  }else{
                    estado = "M9"
                  }
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "M10"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "M5"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "M_IN"
                  index--
                  break
                }
                index++
              }
          }
      break;
      case "M9":
        if(token[index].nombre !== "parenA"){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
            "Se esperaba parentesis abierto, se encontro: "))
            while(index !== token.length){
              if(token[index].nombre === "parenA"){
                if(token[index + 1].nombre === "main"){
                  estado = "M8"
                }else{
                  estado = "M9"
                }
                index--
                break
              }else if(token[index].nombre === "parenC"){
                estado = "M10"
                index--
                break
              }else if(token[index].nombre === "llaveA"){
                estado = "M5"
                index--
                break
              }else if(token[index].nombre === "llaveC"){
                estado = "M_IN"
                index--
                break
              }
              index++
            }
        }else{
          estado = "M10"
        }
        break;
      case "M10":
        if(token[index].nombre !== "parenC"){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
            "Se esperaba parentesis cerrado, se encontro: "))
            while(index !== token.length){
              if(token[index].nombre === "parenA"){
                if(token[index + 1].nombre === "main"){
                  estado = "M8"
                }else{
                  estado = "M9"
                }
                index--
                break
              }else if(token[index].nombre === "parenC"){
                estado = "M10"
                index--
                break
              }else if(token[index].nombre === "llaveA"){
                estado = "M5"
                index--
                break
              }else if(token[index].nombre === "llaveC"){
                estado = "M_IN"
                index--
                break
              }
              index++
            }
        }else{
          estado = "M5"
        }
        break;
      case "M8":
        if(token[index].nombre !== "parenA"){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
            "Se esperaba parentesis abierto, se encontro: "))
            while(index !== token.length){
              if(token[index].nombre === "parenA"){
                if(token[index + 1].nombre === "main"){
                  estado = "M8"
                }else{
                  estado = "M9"
                }
                index--
                break
              }else if(token[index].nombre === "parenC"){
                estado = "M10"
                index--
                break
              }else if(token[index].nombre === "llaveA"){
                estado = "M5"
                index--
                break
              }else if(token[index].nombre === "llaveC"){
                estado = "M_IN"
                index--
                break
              }
              index++
            }
        }else{
          estado = "M1"
        }
      break;
      case "M1":
        if(tipos.includes(token[index].nombre)){
          estado = "M2"
        }else if(token[index].nombre === "parenC"){
          estado = "M5"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba tipo o parentesis cerrado, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  if(token[index + 1].nombre === "main"){
                    estado = "M8"
                  }else{
                    estado = "M9"
                  }
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "M10"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "M5"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "M_IN"
                  index--
                  break
                }
                index++
              }
        }
      break;
      case "M2":
        if(token[index].nombre !== "identificador"){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba identificador, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  if(token[index + 1].nombre === "main"){
                    estado = "M8"
                  }else{
                    estado = "M9"
                  }
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "M10"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "M5"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "M_IN"
                  index--
                  break
                }
                index++
              }
        }else{
          estado = "M3"
          parametros.hijos.push(new nodoArbol("PARAMETRO_" + contador++, token[index].lexema, token[index - 1].nombre, [] , token[index].linea))
        }
      break;
      case "M3":
        if(token[index].nombre === "coma"){
          estado = "M4"
        }else if(token[index].nombre === "parenC"){
          estado = "M5"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba coma o parentesis cerrado, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  if(token[index + 1].nombre === "main"){
                    estado = "M8"
                  }else{
                    estado = "M9"
                  }
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "M10"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "M5"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "M_IN"
                  index--
                  break
                }
                index++
              }
        }
      break;
      case "M4":
        if(tipos.includes(token[index].nombre)){
          estado = "M2"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba tipo, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  if(token[index + 1].nombre === "main"){
                    estado = "M8"
                  }else{
                    estado = "M9"
                  }
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "M10"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "M5"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "M_IN"
                  index--
                  break
                }
                index++
              }
        }
      break;
      case "M5":
        if(token[index].nombre === "llaveA"){
          var inst = instrucciones(token, index + 1, errores);
          if(inst[0] === -1){
            return [-1, metodo]
          }
          index = inst[0] - 1;
          metodo.hijos.push(inst[1])
          estado = "M_IN"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba llave abierta, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "llaveC"){
                  estado = "M_IN"
                  index--
                  break
                }
                index++
              }
        }
        break;
      case "M_IN":
        if(token[index].nombre === "llaveC"){
          estado = "M7"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba llave cerrada, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  if(token[index + 1].nombre === "main"){
                    estado = "M8"
                  }else{
                    estado = "M9"
                  }
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "M10"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "M5"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "M_IN"
                  index--
                  break
                }
                index++
              }
        }
        break;
    }
    if(estado === "M7"){
      return [index, metodo]
    }
    index++;
  }
  return [-1, metodo]
}

function comprobarReasignacion(token, index, errores, variable){
  let estado = "REASIGNACION"
  var variable = new nodoArbol("VARIABLE_" + contador++, "VARIABLE", "variable", [variable])
  var valor = new nodoArbol("VALOR_" + contador++, "VALOR", "valor", [] , token[index].linea)
  var reasignacion = new nodoArbol("REASIGNACION_" + contador++, "REASIGNACION", "reasignacion", [variable, valor])
  while(index !== token.length){
    switch(estado){
      case "REASIGNACION":
        if(token[index].nombre !== "igual"){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
            "Se esperaba igual, se encontro: "))
            while(index !== token.length){
              if(token[index].nombre === "puntoComa"){
                estado = "R2"
                index--
                break
              }
              index++
            }
        }else{
          estado = "R1"
        }
        break;
      case "R1":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "puntoComa"){
                  estado = "R2"
                  index--
                  break
                }
                index++
              }
        }else{
          estado = "R2"
          valor.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
        }
        break;
      case "R2":
        if(operadores.includes(token[index].nombre)){
          valor.hijos.push(new nodoArbol("OPERADOR_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
          estado = "R3"
        }else if(token[index].nombre === "puntoComa"){
          estado = "R4"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operador o punto y coma, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "puntoComa"){
                  estado = "R2"
                  index--
                  break
                }
                index++
              }
        }
        break;
      case "R3":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "puntoComa"){
                  estado = "R2"
                  index--
                  break
                }
                index++
              }
        }else{
          estado = "R2"
          valor.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
        }
        break;
    }
    if(estado === "R4"){
      return [index, reasignacion]
    }
    index++;
  }
  return [-1, reasignacion]
}

function comprobarDeclaracion(token, index, errores, tipo){
  let estado = "DECLARACION"
  var tam = errores.length
  var variables = new nodoArbol("NOMBRE_" + contador++, "NOMBRE", "nombre", [] , token[index].linea)
  var valor = new nodoArbol("VALOR_" + contador++, "VALOR", "valor", [] , token[index].linea)
  var declaracion = new nodoArbol("DECLARACION_" + contador++, "DECLARACION", "declaracion", [tipo, variables, valor])
  var parametros = new nodoArbol("PARAMETROS_" + contador++, "PARAMETROS", "parametros", [] , token[index].linea)
  while(index !== token.length){
    switch(estado){
      case "DECLARACION":
          if(token[index].nombre !== "identificador"){
            errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba identificador, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "V1"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "V10"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "V10"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "V_IN"
                  index--
                  break
                }else if(token[index].nombre === "puntoComa"){
                  estado = "V6"
                  index--
                  break
                }
                index++
              }
          }else{
            estado = "V1"
            variables.hijos.push(new nodoArbol("VARIABLE_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
          }
        break;
      case "V1":
          if(token[index].nombre === "coma"){
            estado = "V2"
          }else if(token[index].nombre === "igual"){
            estado = "V3"
          }else if(token[index].nombre === "parenA"){
            estado = "V5"
          }else if(token[index].nombre === "puntoComa"){
            estado = "V4"
          }else{
            errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba coma, igual, parentesis abierto o punto y coma, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "V1"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "V10"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "V10"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "V_IN"
                  index--
                  break
                }else if(token[index].nombre === "puntoComa"){
                  estado = "V6"
                  index--
                  break
                }
                index++
              }
          }
        break;
      case "V2":
        if(token[index].nombre !== "identificador"){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
            "Se esperaba identificador, se encontro: "))
            while(index !== token.length){
              if(token[index].nombre === "parenA"){
                estado = "V1"
                index--
                break
              }else if(token[index].nombre === "parenC"){
                estado = "V10"
                index--
                break
              }else if(token[index].nombre === "llaveA"){
                estado = "V10"
                index--
                break
              }else if(token[index].nombre === "llaveC"){
                estado = "V_IN"
                index--
                break
              }else if(token[index].nombre === "puntoComa"){
                estado = "V6"
                index--
                break
              }
              index++
            }
        }else{
          estado = "V1"
          variables.hijos.push(new nodoArbol("VARIABLE_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
        }
        break;
      case "V3":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "V1"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "V10"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "V10"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "V_IN"
                  index--
                  break
                }else if(token[index].nombre === "puntoComa"){
                  estado = "V6"
                  index--
                  break
                }
                index++
              }
        }else{
          estado = "V6"
          valor.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
        }
        break;
      case "V5":
        declaracion = new nodoArbol("FUNCION_" + contador++, "FUNCION", "funcion", [tipo, variables, parametros])
        if(tipos.includes(token[index].nombre)){
          estado = "V8"
        }else if(token[index].nombre === "parenC"){
          estado = "V10"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba tipo o parentesis cerrado, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "V1"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "V10"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "V10"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "V_IN"
                  index--
                  break
                }else if(token[index].nombre === "puntoComa"){
                  estado = "V6"
                  index--
                  break
                }
                index++
              }
        }
        break;
      case "V6":
        if(operadores.includes(token[index].nombre)){
          valor.hijos.push(new nodoArbol("OPERADOR_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
          estado = "V7"
        }else if(token[index].nombre === "puntoComa"){
          estado = "V4"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operador o punto y coma, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "V1"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "V10"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "V10"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "V_IN"
                  index--
                  break
                }else if(token[index].nombre === "puntoComa"){
                  estado = "V6"
                  index--
                  break
                }
                index++
              }
        }
        break;
      case "V7":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "V1"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "V10"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "V10"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "V_IN"
                  index--
                  break
                }else if(token[index].nombre === "puntoComa"){
                  estado = "V6"
                  index--
                  break
                }
                index++
              }
        }else{
          estado = "V6"
          valor.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
        }
        break;
      case "V8":
        if(token[index].nombre === "identificador"){
          parametros.hijos.push(new nodoArbol("PARAMETRO_" + contador++, token[index].lexema, token[index - 1].nombre, [] , token[index].linea))
          estado = "V9"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba identificador, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "V1"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "V10"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "V10"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "V_IN"
                  index--
                  break
                }else if(token[index].nombre === "puntoComa"){
                  estado = "V6"
                  index--
                  break
                }
                index++
              }
        }
        break;
      case "V9":
        if(token[index].nombre === "coma"){
          estado = "V11"
        }else if(token[index].nombre === "parenC"){
          estado = "V10"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba coma o parentesis cerrado, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "V1"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "V10"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "V10"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "V_IN"
                  index--
                  break
                }else if(token[index].nombre === "puntoComa"){
                  estado = "V6"
                  index--
                  break
                }
                index++
              }
        }
        break;
      case "V10":
        if(token[index].nombre === "llaveA"){
          var inst = instrucciones(token, index + 1, errores);
          if(inst[0] === -1){
            return [-1, declaracion]
          }
          index = inst[0] - 1;
          declaracion.hijos.push(inst[1])
          estado = "V_IN"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba llave abierta, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "llaveC"){
                  estado = "V_IN"
                  index--
                  break
                }
                index++
              }
        }
        break;
      case "V11":
        if(tipos.includes(token[index].nombre)){
          estado = "V8"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba tipo, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "V1"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "V10"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "V10"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "V_IN"
                  index--
                  break
                }else if(token[index].nombre === "puntoComa"){
                  estado = "V6"
                  index--
                  break
                }
                index++
              }
        }
        break;
      case "V_IN":
        if(token[index].nombre === "llaveC"){
          estado = "V12"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba llave cerrada, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "V1"
                  index--
                  break
                }else if(token[index].nombre === "parenC"){
                  estado = "V10"
                  index--
                  break
                }else if(token[index].nombre === "llaveA"){
                  estado = "V10"
                  index--
                  break
                }else if(token[index].nombre === "llaveC"){
                  estado = "V_IN"
                  index--
                  break
                }else if(token[index].nombre === "puntoComa"){
                  estado = "V6"
                  index--
                  break
                }
                index++
              }
        }
        break;
    }
    if(estado === "V4" || estado === "V12"){
      return [index, declaracion]
    }
    index++;
  }
  return [-1, declaracion]
}

function comprobarImprimir(token, index, errores){
  let estado = "PRINT";
  var imprimir = new nodoArbol("IMPRIMIR_" + contador++, "IMPRIMIR", "imprimir", [] , token[index].linea)
  while(index !== token.length){
    switch(estado){
      case "PRINT":
          if(token[index].nombre !== "punto"){
            errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba punto, se encontro: "))
            while(index !== token.length){
              if(token[index].nombre === "parenA"){
                estado = "P2"
                index--
                break;
              }else if(token[index].nombre === "parenC"){
                estado = "P4"
                index--
                break;
              }else if(token[index].nombre === "puntoComa"){
                estado = "P6"
                index--
                break;
              }
              index++
            }
          }else{
            estado = "P1"
          }
      break;
      case "P1":
        if(token[index].nombre !== "write"){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba write, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "P2"
                  index--
                  break;
                }else if(token[index].nombre === "parenC"){
                  estado = "P4"
                  index--
                  break;
                }else if(token[index].nombre === "puntoComa"){
                  estado = "P6"
                  index--
                  break;
                }
                index++
              }
        }else{
          estado = "P2"
        }
      break;
      case "P2":
        if(token[index].nombre !== "parenA"){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba parentesis abierto, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "P2"
                  index--
                  break;
                }else if(token[index].nombre === "parenC"){
                  estado = "P4"
                  index--
                  break;
                }else if(token[index].nombre === "puntoComa"){
                  estado = "P6"
                  index--
                  break;
                }
                index++
              }
        }else{
          estado = "P3"
        }
      break;
      case "P3":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "P2"
                  index--
                  break;
                }else if(token[index].nombre === "parenC"){
                  estado = "P4"
                  index--
                  break;
                }else if(token[index].nombre === "puntoComa"){
                  estado = "P6"
                  index--
                  break;
                }
                index++
              }
        }else{
          estado = "P4"
          imprimir.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
        }
      break;
      case "P4":
        if(token[index].nombre === "parenC"){
          estado = "P6"
          break;
        }else if(operadores.includes(token[index].nombre)){
          imprimir.hijos.push(new nodoArbol("OPERADOR_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
          estado = "P5"
          break;
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operador o parentesis cerrado, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "P2"
                  index--
                  break;
                }else if(token[index].nombre === "parenC"){
                  estado = "P4"
                  index--
                  break;
                }else if(token[index].nombre === "puntoComa"){
                  estado = "P6"
                  index--
                  break;
                }
                index++
              }
        }
      break;
      case "P5":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "P2"
                  index--
                  break;
                }else if(token[index].nombre === "parenC"){
                  estado = "P4"
                  index--
                  break;
                }else if(token[index].nombre === "puntoComa"){
                  estado = "P6"
                  index--
                  break;
                }
                index++
              }
        }else{
          estado = "P4"
          imprimir.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, [] , token[index].linea));
        }
        break;
      case "P6":
        if(token[index].nombre === "puntoComa"){
          estado = "P7"
        }else{
          errores.push(new Error("Sintactico", token[index].nombre, token[index].linea, token[index].columna, 
              "Se esperaba punto y coma, se encontro: "))
              while(index !== token.length){
                if(token[index].nombre === "parenA"){
                  estado = "P2"
                  index--
                  break;
                }else if(token[index].nombre === "parenC"){
                  estado = "P4"
                  index--
                  break;
                }else if(token[index].nombre === "puntoComa"){
                  estado = "P6"
                  index--
                  break;
                }
                index++
              }
        }
        break;
    }
    if(estado === "P7"){
      return [index, imprimir]
    }
    index++;
  }
  return [-1, imprimir]
}
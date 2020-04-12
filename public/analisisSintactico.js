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

class nodoArbol {
  constructor(nombre, valor, tipo, hijos) {
    this.nombre = nombre
    this.valor = valor
    this.tipo = tipo
    this.hijos = hijos
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

function iniciarAnalisisSintactico(tokens, errores){
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
          new nodoArbol("TIPO_" + contador++, tokenAnalizar.lexema, tokenAnalizar.nombre, []));
        i = retorno[0];
        raiz.hijos.push(retorno[1])
        break;
      //#endregion

      //#region FUNCION REASIGNACION DE VARIABLES
      case "identificador":
        retorno = comprobarReasignacion(tokens, i + 1, errores, 
          new nodoArbol("OPERANDO_" + contador++, tokenAnalizar.lexema, tokenAnalizar.nombre, []));
        i = retorno[0];
        raiz.hijos.push(retorno[1])
        break;
      //#endregion

    }
    if(i === -1){
      break;
    }
  }
  console.log(imprimirRaiz(raiz, ""))
  return errores
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
          new nodoArbol("TIPO_" + contador++, tokenAnalizar.lexema, tokenAnalizar.nombre, []));
        i = retorno[0];
        instruccion.hijos.push(retorno[1])
        break;
      //#endregion

      //#region FUNCION REASIGNACION DE VARIABLES
      case "identificador":
        retorno = comprobarReasignacion(token, i + 1, errores, 
          new nodoArbol("OPERANDO_" + contador++, tokenAnalizar.lexema, tokenAnalizar.nombre, []));
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
    }
    if(i === -1){
      break;
    }
  }
  return [-1, instruccion, 0]
}

function comprobarReasignacion(token, index, errores, variable){
  let estado = "REASIGNACION"
  var tam = errores.length
  var variable = new nodoArbol("VARIABLE_" + contador++, "VARIABLE", "variable", [variable])
  var valor = new nodoArbol("VALOR_" + contador++, "VALOR", "valor", [])
  var reasignacion = new nodoArbol("REASIGNACION_" + contador++, "REASIGNACION", "reasignacion", [variable, valor])
  while(index !== token.length){
    switch(estado){
      case "REASIGNACION":
        if(token[index].nombre !== "igual"){
          errores.push(new Error("Sintactico", token[index].lexema, token[index].linea, token[index].columna, 
            "Se esperaba igual, se encontro: "))
        }
        estado = "R1"
        break;
      case "R1":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].lexema, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
        }else{
          valor.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, []));
        }
        estado = "R2"
        break;
      case "R2":
        if(operadores.includes(token[index].nombre)){
          valor.hijos.push(new nodoArbol("OPERADOR_" + contador++, token[index].lexema, token[index].nombre, []));
          estado = "R3"
        }else if(token[index].nombre === "puntoComa"){
          estado = "R4"
        }else{
          errores.push(new Error("Sintactico", token[index].lexema, token[index].linea, token[index].columna, 
              "Se esperaba operador o punto y coma, se encontro: "))
        }
        break;
      case "R3":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].lexema, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
        }else{
          valor.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, []));
        }
        estado = "R2"
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
  var variables = new nodoArbol("VARIABLES_" + contador++, "VARIABLES", "variables", [])
  var valor = new nodoArbol("VALOR_" + contador++, "VALOR", "valor", [])
  var declaracion = new nodoArbol("DECLARACION_" + contador++, "DECLARACION", "declaracion", [tipo, variables, valor])
  var parametros = new nodoArbol("PARAMETROS_" + contador++, "PARAMETROS", "parametros", [])
  while(index !== token.length){
    switch(estado){
      case "DECLARACION":
          if(token[index].nombre !== "identificador"){
            errores.push(new Error("Sintactico", token[index].lexema, token[index].linea, token[index].columna, 
              "Se esperaba identificador, se encontro: "))
          }else{
            variables.hijos.push(new nodoArbol("VARIABLE_" + contador++, token[index].lexema, token[index].nombre, []));
          }
          estado = "V1"
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
            errores.push(new Error("Sintactico", token[index].lexema, token[index].linea, token[index].columna, 
              "Se esperaba coma, igual, parentesis abierto o punto y coma, se encontro: "))
          }
        break;
      case "V2":
        if(token[index].nombre !== "identificador"){
          errores.push(new Error("Sintactico", token[index].lexema, token[index].linea, token[index].columna, 
            "Se esperaba identificador, se encontro: "))
        }else{
          variables.hijos.push(new nodoArbol("VARIABLE_" + contador++, token[index].lexema, token[index].nombre, []));
        }
        estado = "V1"
        break;
      case "V3":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].lexema, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
        }else{
          valor.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, []));
        }
        estado = "V6"
        break;
      case "V5":
        declaracion = new nodoArbol("FUNCION_" + contador++, "FUNCION", "funcion", [tipo, parametros])
        if(tipos.includes(token[index].nombre)){
          estado = "V8"
        }else if(token[index].nombre === "parenC"){
          estado = "V10"
        }else{
          errores.push(new Error("Sintactico", token[index].lexema, token[index].linea, token[index].columna, 
              "Se esperaba tipo o parentesis cerrado, se encontro: "))
        }
        break;
      case "V6":
        if(operadores.includes(token[index].nombre)){
          valor.hijos.push(new nodoArbol("OPERADOR_" + contador++, token[index].lexema, token[index].nombre, []));
          estado = "V7"
        }else if(token[index].nombre === "puntoComa"){
          estado = "V4"
        }else{
          errores.push(new Error("Sintactico", token[index].lexema, token[index].linea, token[index].columna, 
              "Se esperaba operador o punto y coma, se encontro: "))
        }
        break;
      case "V7":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].lexema, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
        }else{
          valor.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, []));
        }
        estado = "V6"
        break;
      case "V8":
        if(token[index].nombre === "identificador"){
          parametros.hijos.push(new nodoArbol("PARAMETRO_" + contador++, token[index].lexema, token[index].nombre, []))
          estado = "V9"
        }else{
          errores.push(new Error("Sintactico", token[index].lexema, token[index].linea, token[index].columna, 
              "Se esperaba identificador, se encontro: "))
        }
        break;
      case "V9":
        if(token[index].nombre === "coma"){
          estado = "V5"
        }else if(token[index].nombre === "parenC"){
          estado = "V10"
        }else{
          errores.push(new Error("Sintactico", token[index].lexema, token[index].linea, token[index].columna, 
              "Se esperaba coma o parentesis cerrado, se encontro: "))
        }
        break;
      case "V10":
        if(token[index].nombre === "llaveA"){
          var inst = instrucciones(token, index + 1, errores);
          if(inst[0] === -1){
            return [-1, declaracion]
          }
          index = inst[0];
          declaracion.hijos.push(inst[1])
          estado = "V_IN"
        }else{
          errores.push(new Error("Sintactico", token[index].lexema, token[index].linea, token[index].columna, 
              "Se esperaba llave abierta, se encontro: "))
        }
        break;
      case "V_IN":
        if(token[index].nombre === "llaveC"){
          estado = "V12"
        }else{
          errores.push(new Error("Sintactico", token[index].lexema, token[index].linea, token[index].columna, 
              "Se esperaba llave cerrada, se encontro: "))
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
  var tam = errores.length
  var imprimir = new nodoArbol("IMPRIMIR_" + contador++, "IMPRIMIR", "imprimir", [])
  while(index !== token.length){
    switch(estado){
      case "PRINT":
          if(token[index].nombre !== "punto"){
            errores.push(new Error("Sintactico", token[index].lexema, token[index].linea, token[index].columna, 
              "Se esperaba punto, se encontro: "))
          }
          estado = "P1";
      break;
      case "P1":
        if(token[index].nombre !== "write"){
          errores.push(new Error("Sintactico", token[index].lexema, token[index].linea, token[index].columna, 
              "Se esperaba write, se encontro: "))
        }
        estado = "P2";
      break;
      case "P2":
        if(token[index].nombre !== "parenA"){
          errores.push(new Error("Sintactico", token[index].lexema, token[index].linea, token[index].columna, 
              "Se esperaba parentesis abierto, se encontro: "))
        }
        estado = "P3";
      break;
      case "P3":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].lexema, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
        }else{
          imprimir.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, []));
        }
        estado = "P4";
      break;
      case "P4":
        if(token[index].nombre === "parenC"){
          estado = "P6"
          break;
        }else if(operadores.includes(token[index].nombre)){
          imprimir.hijos.push(new nodoArbol("OPERADOR_" + contador++, token[index].lexema, token[index].nombre, []));
          estado = "P5"
          break;
        }else{
          errores.push(new Error("Sintactico", token[index].lexema, token[index].linea, token[index].columna, 
              "Se esperaba operador o parentesis cerrado, se encontro: "))
        }
        estado = "P6"
      break;
      case "P5":
        if(!operandos.includes(token[index].nombre)){
          errores.push(new Error("Sintactico", token[index].lexema, token[index].linea, token[index].columna, 
              "Se esperaba operando, se encontro: "))
        }else{
          imprimir.hijos.push(new nodoArbol("OPERANDO_" + contador++, token[index].lexema, token[index].nombre, []));
        }
        estado = "P4";
        break;
      case "P6":
        if(token[index].nombre === "puntoComa"){
          estado = "P7"
        }else{
          errores.push(new Error("Sintactico", token[index].lexema, token[index].linea, token[index].columna, 
              "Se esperaba punto y coma, se encontro: "))
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
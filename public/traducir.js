function traducirPython(raiz, tab){
  var cadena = "";
  for(var i = 0; i < raiz.hijos.length; i++){
    var nodoActual = raiz.hijos[i]
    if(nodoActual.tipo === "imprimir"){
      cadena += tab + "print("
      for(var j = 0; j < nodoActual.hijos.length; j++){
        if(nodoActual.hijos[j].valor === "+"){
          cadena += ", "
        }else{
          cadena += nodoActual.hijos[j].valor
        }
      }
      cadena += ")\n"
    }else if(nodoActual.tipo === "return"){
      cadena += tab + "return "
      for(var j = 0; j < nodoActual.hijos.length; j++){
          cadena += nodoActual.hijos[j].valor
      }
      cadena += "\n"
    }else if(nodoActual.tipo === "break"){
      cadena += tab + "break\n"
    }else if(nodoActual.tipo === "continue"){
      cadena += tab + "continue\n"
    }else if(nodoActual.tipo === "if"){
      cadena += tab + "if "
      for(var j = 0; j < nodoActual.hijos[0].hijos.length; j++){
        cadena += nodoActual.hijos[0].hijos[j].valor
      }
      cadena += "\n"
      cadena += traducirPython(nodoActual.hijos[1], tab + "  ")
      if(nodoActual.hijos.length === 3){
        cadena += traducirPython(nodoActual.hijos[2], tab)
      }
    }else if(nodoActual.tipo === "elseif"){
      cadena += tab + "elif "
      for(var j = 0; j < nodoActual.hijos[0].hijos.length; j++){
        cadena += nodoActual.hijos[0].hijos[j].valor
      }
      cadena += "\n"
      cadena += traducirPython(nodoActual.hijos[1], tab + "  ")
      if(nodoActual.hijos.length === 3){
        cadena += traducirPython(nodoActual.hijos[2], tab)
      }
    }else if(nodoActual.tipo === "declaracion"){
      for(var j = 0; j < nodoActual.hijos[1].hijos.length; j++){
        if(j === (nodoActual.hijos[1].hijos.length - 1)){
          var final = ""
          if(nodoActual.hijos[2].hijos.length !== 0){
            for(var k = 0; k < nodoActual.hijos[2].hijos.length; k++){
              final += nodoActual.hijos[2].hijos[k].valor
            }
          }else{
            final = "0"
          }
          cadena += tab + "var " + nodoActual.hijos[1].hijos[j].valor + " = " + final + "\n"
        }else{
          cadena += tab + "var " + nodoActual.hijos[1].hijos[j].valor + " = 0 \n"
        }
      }
    }else if(nodoActual.tipo === "linea" || nodoActual.tipo === "multi"){
      cadena += tab + nodoActual.valor.replace(/\t/g, "  ") + "\n"
    }else if(nodoActual.tipo === "funcion"){
      cadena += tab + "def " + nodoActual.hijos[1].hijos[0].valor + "("
      if(nodoActual.hijos[2].length !== 0){
        for(var j = 0; j < nodoActual.hijos[2].hijos.length; j++){
          if(j === 0){
            cadena += nodoActual.hijos[2].hijos[j].valor
          }else{
            cadena += ", " + nodoActual.hijos[2].hijos[j].valor
          }
        }
      }
      cadena += "):\n"
      cadena += traducirPython(nodoActual.hijos[3], tab + "  ")
    }else if(nodoActual.tipo === "metodo"){
      cadena += tab + "def " + nodoActual.hijos[0].hijos[0].valor + "("
      if(nodoActual.hijos[0].hijos[0].valor === "main"){
        cadena += "):\n"
        cadena += traducirPython(nodoActual.hijos[1], tab + "  ")
        cadena += tab + "if __name__ = \"__main__\":\n"
        cadena += tab + "main()\n"
      }else{
        if(nodoActual.hijos[1].length !== 0){
          for(var j = 0; j < nodoActual.hijos[1].hijos.length; j++){
            if(j === 0){
              cadena += nodoActual.hijos[1].hijos[j].valor
            }else{
              cadena += ", " + nodoActual.hijos[1].hijos[j].valor
            }
          }
        }
        cadena += "):\n"
        cadena += traducirPython(nodoActual.hijos[2], tab + "  ")
      }
    }else if(nodoActual.tipo === "for"){
      cadena += tab + "for " + nodoActual.hijos[0].hijos[1].valor + " in range("
      if(nodoActual.hijos[2].hijos[1].valor === "++"){
        for(var j = 0; j < nodoActual.hijos[0].hijos[2].hijos.length; j++){
          cadena += nodoActual.hijos[0].hijos[2].hijos[j].valor
        }
        cadena += ", "
        for(var j = 2; j < nodoActual.hijos[1].hijos.length; j++){
          cadena += nodoActual.hijos[1].hijos[j].valor
        }
      }else{for(var j = 2; j < nodoActual.hijos[1].hijos.length; j++){
          cadena += nodoActual.hijos[1].hijos[j].valor
        }
        cadena += ", "
        for(var j = 0; j < nodoActual.hijos[0].hijos[2].hijos.length; j++){
          cadena += nodoActual.hijos[0].hijos[2].hijos[j].valor
        }
      }
      cadena += "):\n"
      cadena += traducirPython(nodoActual.hijos[3], tab + "  ")
    }else if(nodoActual.tipo === "while"){
      cadena += tab + "while ("
      for(var j = 0; j < nodoActual.hijos[0].hijos.length; j++){
        cadena += nodoActual.hijos[0].hijos[j].valor
      }
      cadena += "):\n"
      cadena += traducirPython(nodoActual.hijos[1], tab + "  ")
    }else if(nodoActual.tipo === "dowhile"){
      cadena += tab + "while True:\n"
      cadena += traducirPython(nodoActual.hijos[0], tab + "  ")
      cadena += tab + "  if("
      for(var j = 0; j < nodoActual.hijos[1].hijos.length; j++){
        cadena += nodoActual.hijos[1].hijos[j].valor
      }
      cadena += "):\n"
      cadena += tab + "    break\n"
    }else if(nodoActual.tipo === "reasignacion"){
      cadena += tab + nodoActual.hijos[0].hijos[0].valor + " ="
      for(var j = 0; j < nodoActual.hijos[1].hijos.length; j++){
        cadena += nodoActual.hijos[1].hijos[j].valor
      }
      cadena += "\n"
    }else if(nodoActual.tipo === "else"){
      cadena += tab + "else \n"
      cadena += traducirPython(nodoActual.hijos[0], tab + "  ")
      if(nodoActual.hijos.length === 2){
        cadena += traducirPython(nodoActual.hijos[1], tab)
      }
    }else if(nodoActual.tipo === "switch"){
      cadena += tab + "def switcher(case, "
      cadena += nodoActual.hijos[0].hijos[0].valor
      cadena += "):"
      for(var j = 1; j < nodoActual.hijos.length; j++){
        if(j === 1){
          cadena += "\n" + tab + "  " + nodoActual.hijos[j].valor + ": \n"
        }else{
          cadena += tab + "  " + nodoActual.hijos[j].valor + ": \n"
        }
        cadena += traducirPython(nodoActual.hijos[j].hijos[0], tab + "  " + "  ", ", ")
      }
    }
  }
  return cadena
}
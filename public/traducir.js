function traducirPython(raiz, tab){
  var cadena = tab;
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
      cadena += "return "
      for(var j = 0; j < nodoActual.hijos.length; j++){
          cadena += nodoActual.hijos[j].valor
      }
      cadena += "\n"
    }else if(nodoActual.tipo === "break"){
      cadena += "break\n"
    }else if(nodoActual.tipo === "continue"){
      cadena += "continue\n"
    }else if(nodoActual.tipo === "if"){
      cadena += "if "
      for(var j = 0; j < nodoActual.hijos[0].hijos.length; j++){
        cadena += nodoActual.hijos[0].hijos[j].valor
      }
      cadena += "\n"
      cadena += traducirPython(nodoActual.hijos[1], tab + "  ")
      if(nodoActual.hijos.length === 3){
        cadena += traducirPython(nodoActual.hijos[2], tab)
      }
    }else if(nodoActual.tipo === "elseif"){
      cadena += "elif "
      for(var j = 0; j < nodoActual.hijos[0].hijos.length; j++){
        cadena += nodoActual.hijos[0].hijos[j].valor
      }
      cadena += "\n"
      cadena += traducirPython(nodoActual.hijos[1], tab + "  ")
      if(nodoActual.hijos.length === 3){
        cadena += traducirPython(nodoActual.hijos[2], tab)
      }
    }
  }
  return cadena
}
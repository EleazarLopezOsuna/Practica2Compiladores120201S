function recorrerHtml(raiz){
  var cadena = ""
  for(var i = 0; i < raiz.hijos.length; i++){
    if(raiz.hijos[i].tipo === "html"){
        if(raiz.hijos[i].valor !== undefined){
          cadena += raiz.hijos[i].valor
        }
    }
    cadena += recorrerHtml(raiz.hijos[i])
  }
  return cadena
}
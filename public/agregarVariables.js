function agregarVariables(raiz){
  var child = document.getElementById('cabeceras').lastElementChild;  
  while (child) { 
    document.getElementById('cabeceras').removeChild(child); 
    child = document.getElementById('cabeceras').lastElementChild; 
  }

  child = document.getElementById('cuerpo').lastElementChild;  
  while (child) { 
    document.getElementById('cuerpo').removeChild(child); 
    child = document.getElementById('cuerpo').lastElementChild; 
  }

  var tipo = document.createElement('th')
  var nombre = document.createElement('th')
  var linea = document.createElement('th')

  tipo.scope = "col"
  nombre.scope = "col"
	linea.scope = "col"
    
  tipo.textContent = "Tipo"
  nombre.textContent = "Nombre"
	linea.textContent = "Linea"
  
  document.getElementById('cabeceras').appendChild(nombre)
  document.getElementById('cabeceras').appendChild(tipo)
	document.getElementById('cabeceras').appendChild(linea)
  
  recorrer(raiz)
}

function recorrer(raiz){
  for(var i = 0; i < raiz.hijos.length; i++){
    if(raiz.hijos[i].tipo === "declaracion"){
        var declaracion = raiz.hijos[i]
        for(var j = 0; j < declaracion.hijos[1].hijos.length; j++){
          var tipo = document.createElement('td')
          var tr = document.createElement('tr')
          var linea = document.createElement('td')
          var nombre = document.createElement('td')
          linea.scope = "col"
          nombre.scope = "col"
          tipo.scope = "col"

          tipo.textContent = declaracion.hijos[0].tipo
	        linea.textContent = declaracion.hijos[1].hijos[j].linea
          nombre.textContent = declaracion.hijos[1].hijos[j].valor

          tr.appendChild(nombre)
	        tr.appendChild(tipo)
          tr.appendChild(linea)
          document.getElementById('cuerpo').appendChild(tr)
        }
    }else if(raiz.hijos[i].tipo === "parametros"){
        for(var j = 0; j < raiz.hijos.length; j++){
          if(raiz.hijos[i].hijos[j] !== undefined){
            var tipo = document.createElement('td')
            var tr = document.createElement('tr')
            var linea = document.createElement('td')
            var nombre = document.createElement('td')
            linea.scope = "col"
            nombre.scope = "col"
            tipo.scope = "col"

            tipo.textContent = raiz.hijos[i].hijos[j].tipo
	          linea.textContent = raiz.hijos[i].hijos[j].linea
            nombre.textContent = raiz.hijos[i].hijos[j].valor

            tr.appendChild(nombre)
	          tr.appendChild(tipo)
            tr.appendChild(linea)
            document.getElementById('cuerpo').appendChild(tr)
          }
        }
    }
    recorrer(raiz.hijos[i])
  }
}
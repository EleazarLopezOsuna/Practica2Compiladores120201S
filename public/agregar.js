var contador = 0;
var textos = [];
var indexAnterior = 0;
var indexActual = 0;
function agregar(nombre, texto) {
  if(document.getElementById("areasTexto").hidden === true){
    document.getElementById("areasTexto").hidden = false;
  }
  var li = document.createElement('li');
  var a = document.createElement('a');
  a.textContent = nombre;
  a.id = contador;
  textos.push(texto);
  a.onclick = function(){
    var identificador = this.id;
    indexAnterior = indexActual;
    indexActual = identificador;
    textos[indexAnterior] = document.getElementById("codigo").value;
    document.getElementById("codigo").value = textos[indexActual];
  };
  if(contador === 0){
    document.getElementById("codigo").textContent = textos[indexActual];
  }
  li.appendChild(a);
  document.getElementById("archivosActivos").appendChild(li);
  contador++;
}
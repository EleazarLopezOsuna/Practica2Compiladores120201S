function traducirJson(texto, agregado){
  var retorno = ""
  var resultado = ""
  while(texto.length !== 0){
    if(texto.startsWith("<html>")){
      retorno += agregado + "\"HTML\":{"
      texto = texto.replace("<html>", "")
      var resultado = traducirJson(texto, agregado + "  ")
      if(resultado[0] !== undefined && resultado[1] !== undefined){
        texto = resultado[1]
        retorno += resultado[0]
        texto = texto.replace("</html>", "")
        retorno += "\n" + agregado + "}"
      }
    }else if(texto.startsWith("<head>")){
      retorno += "\n" + agregado + "\"HEAD\":{"
      texto = texto.replace("<head>", "")
      var resultado = traducirJson(texto, agregado + "  ")
      if(resultado[0] !== undefined && resultado[1] !== undefined){
        texto = resultado[1]
        retorno += resultado[0]
        texto = texto.replace("</head>", "")
        retorno += "\n" + agregado + "}"
      }
    }else if(texto.startsWith("<title>")){
      retorno += "\n" + agregado + "\"TITLE\":{"
      texto = texto.replace("<title>", "")
      var resultado = traducirJson(texto, agregado + "  ")
      if(resultado[0] !== undefined && resultado[1] !== undefined){
        texto = resultado[1]
        retorno += resultado[0]
        texto = texto.replace("</title>", "")
        retorno += "\n" + agregado + "}"
      }
    }else if(texto.startsWith("<body>")){
      retorno += "\n" + agregado + "\"BODY\":{"
      texto = texto.replace("<body>", "")
      var resultado = traducirJson(texto, agregado + "  ")
      if(resultado[0] !== undefined && resultado[1] !== undefined){
        texto = resultado[1]
        retorno += resultado[0]
        texto = texto.replace("</body>", "")
        retorno += "\n" + agregado + "}"
      }
    }else if(texto.startsWith("<h1>")){
      retorno += "\n" + agregado + "\"H1\":{"
      texto = texto.replace("<h1>", "")
      var resultado = traducirJson(texto, agregado + "  ")
      if(resultado[0] !== undefined && resultado[1] !== undefined){
        texto = resultado[1]
        retorno += resultado[0]
        texto = texto.replace("</h1>", "")
        retorno += "\n" + agregado + "}"
      }
    }else if(texto.startsWith("<h2>")){
      retorno += "\n" + agregado + "\"H2\":{"
      texto = texto.replace("<h2>", "")
      var resultado = traducirJson(texto, agregado + "  ")
      if(resultado[0] !== undefined && resultado[1] !== undefined){
        texto = resultado[1]
        retorno += resultado[0]
        texto = texto.replace("</h2>", "")
        retorno += "\n" + agregado + "}"
      }
    }else if(texto.startsWith("<h3>")){
      retorno += "\n" + agregado + "\"H3\":{"
      texto = texto.replace("<h3>", "")
      var resultado = traducirJson(texto, agregado + "  ")
      if(resultado[0] !== undefined && resultado[1] !== undefined){
        texto = resultado[1]
        retorno += resultado[0]
        texto = texto.replace("</h3>", "")
        retorno += "\n" + agregado + "}"
      }
    }else if(texto.startsWith("<h4>")){
      retorno += "\n" + agregado + "\"H4\":{"
      texto = texto.replace("<h4>", "")
      var resultado = traducirJson(texto, agregado + "  ")
      if(resultado[0] !== undefined && resultado[1] !== undefined){
        texto = resultado[1]
        retorno += resultado[0]
        texto = texto.replace("</h4>", "")
        retorno += "\n" + agregado + "}"
      }
    }else if(texto.startsWith("<div>")){
      retorno += "\n" + agregado + "\"DIV\":{"
      texto = texto.replace("<div>", "")
      var resultado = traducirJson(texto, agregado + "  ")
      if(resultado[0] !== undefined && resultado[1] !== undefined){
        texto = resultado[1]
        retorno += resultado[0]
        texto = texto.replace("</div>", "")
        retorno += "\n" + agregado + "}"
      }
    }else if(texto.startsWith("<p>")){
      retorno += "\n" + agregado + "\"P\":{"
      texto = texto.replace("<p>", "")
      var resultado = traducirJson(texto, agregado + "  ")
      if(resultado[0] !== undefined && resultado[1] !== undefined){
        texto = resultado[1]
        retorno += resultado[0]
        texto = texto.replace("</p>", "")
        retorno += "\n" + agregado + "}"
      }
    }else if(texto.startsWith("<br>")){
      retorno += "\n" + agregado + "\"BR\":{\n" + agregado + "}\n"
      texto = texto.replace("<br>", "")
    }else if(texto.startsWith("<label>")){
      retorno += "\n" + agregado + "\"LABEL\":{"
      texto = texto.replace("<label>", "")
      var resultado = traducirJson(texto, agregado + "  ")
      if(resultado[0] !== undefined && resultado[1] !== undefined){
        texto = resultado[1]
        retorno += resultado[0]
        texto = texto.replace("</label>", "")
        retorno += "\n" + agregado + "}"
      }
    }else if(texto.startsWith("<input>")){
      retorno += "\n" + agregado + "\"INPUT\":{\n" + agregado + "}\n"
      texto = texto.replace("<input>", "")
    }else if(texto.startsWith("<button>")){
      retorno += "\n" + agregado + "\"BUTTON\":{"
      texto = texto.replace("<button>", "")
      var resultado = traducirJson(texto, agregado + "  ")
      if(resultado[0] !== undefined && resultado[1] !== undefined){
        texto = resultado[1]
        retorno += resultado[0]
        texto = texto.replace("</button>", "")
        retorno += "\n" + agregado + "}"
      }
    }else if(texto.startsWith("<div")){
      retorno += "\n" + agregado + "\"DIV\":{"
      texto = texto.replace("<div", "")
      texto = texto.replace("style", "").replace("=", "")
      var color = ""
      var index = 0
      while(texto[index] !== ">"){
        color += texto[index]
        index++
      }
      texto = texto.replace(color, "").replace(">", "")
      var resultado = traducirJson(texto, agregado + "  ")
      retorno += "\n" + agregado + "  \"STYLE\": " + color
      if(resultado[0] !== undefined && resultado[1] !== undefined){
        texto = resultado[1]
        retorno += resultado[0]
        texto = texto.replace("</div>", "")
        retorno += "\n" + agregado + "}"
      }
    }else if(texto.startsWith("<body")){
      retorno += "\n" + agregado + "\"BODY\":{"
      texto = texto.replace("<body", "")
      texto = texto.replace("style", "").replace("=", "")
      var color = ""
      var index = 0
      while(texto[index] !== ">"){
        color += texto[index]
        index++
      }
      texto = texto.replace(color, "").replace(">", "")
      var resultado = traducirJson(texto, agregado + "  ")
      retorno += "\n" + agregado + "  \"STYLE\": " + color
      if(resultado[0] !== undefined && resultado[1] !== undefined){
        texto = resultado[1]
        retorno += resultado[0]
        texto = texto.replace("</body>", "")
        retorno += "\n" + agregado + "}"
      }
    }
    else{
      var index = 0
      var nuevo = ""
      var mandar = "\n" + agregado + "\"TEXTO\": \""
      while(texto[index] !== "<"){
        nuevo += texto[index]
        index++
      }
      if(nuevo.length > 0){
        retorno += mandar + nuevo + "\""
        texto = texto.replace(nuevo, "")
      }else{
        break
      }
    }
  }
  return [retorno, texto]
}
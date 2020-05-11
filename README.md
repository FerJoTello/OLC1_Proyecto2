# OLC1_Proyecto2
Antennae (Java) - Detector de copias y generador de AST
## Para el cliente:
  * Necesario instalar Go.
  * Ejecutar en consola: `go build hello.go`.
  * Importante incluir el archivo "jquery.min.js" e incluirlo en el "index.html".
  ### Para levantar el cliente:
  * Dentro de algún navegador, escribir: `localhost:8000`
## Para el server:
  * Ejecutar: `npm init --yes` para iniciar un nuevo proyecto.
  * Ejecutar: `npm i express morgan cors` para instalar los modulos necesarios para iniciar el servidor.
  * Opcional:
    * Ejecutar: `npm i nodemon -D` y en "package.json" asegurarse que en el campo "scripts" exista un objeto llamado "dev" (tal y como aparece en el archivo del repositorio, si no se instala modificarlo).
  ### Para levantar el server (inicializar el backend o iniciar el servidor para que escuche las llamadas a sus rutas y funciones):
  * Si se realizó el paso opcional entonces únicamente se ejecuta en la carpeta donde esté inicializado el server el comando `npm run dev` y eso permite que cada vez que se guarde un cambio en el archivo "server.js" se reinicie el server automáticamente y funcione con los nuevos cambios.
  * Si no se realizó el paso opcional, entonces es necesario cambiar el contenido de "package.json" ya que el campo scripts es para indicar qué sentencia ejecutará cuando se llame al `npm` (basta únicamente con borrar el contenido del campo scripts) y para levantarlo se ejecuta: `node server.js`. A diferencia del paso opcional, al realizar cambios en el archivo es necesario que se vuelva a levantar el server ejecutando nuevamente `node server.js`.

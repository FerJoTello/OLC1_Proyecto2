//  Se guarda el modulo 'express' en una constante
const express = require("express");
//  App inicia a express y se guarda en una constante
const app = express();
//  IMPORTANTE ESTO
//  Cross Origin Resource Sharing 'CORS':
//  Resuelve un problema que se da al no poder conectar la
//  informacion con la que se comunican ambos puertos.
var cors = require('cors');
//  Se habilita el cors
app.use(cors());
//  Estableciendo puertos
app.set('port', process.env.PORT || 8080);

//  middlewares
const morgan = require("morgan");
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//  Iniciamos la app
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});
//  Metodos
app.get('/', (req, res) => {
    console.log('Just for testing')
    res.send('Hello');
});

app.post('/Analyze/', (req, res) => {
    const { input } = req.body;
    //  input es el texto que se encuentra en el textarea con el id 'javaText'
    console.log(input);
    //  se instancia al analizador o gramatica
    var parser = require('../analyzer/grammar');
    //  y se ejecuta el metodo parse() para analizar la entrada
    //parser.parse(input.toString());
    res.send('success');
});

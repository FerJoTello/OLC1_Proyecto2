let errorsArray = [];
/**
 * Tries to connect to another url (in this case should be our back-end server)
 * and executes a POST operation
 */
function Conn() {

    var url = 'http://localhost:8080/Analyze/';

    var dataAsJson = {
        input: document.getElementById("javaText").value
    };

    $.post(url, dataAsJson, function (data, status) {
        console.log(status);
        if (data.length == 0) {
            alert("No hay errores");
        }
        else {
            alert("Sí hay errores");
            errorsArray = data;
        }
    });
}

function htmlReport() {
    let htmlText = "<html>\n" +
        "<head>\n" +
        "<meta charset='utf-16'>\n" +
        "<title>Reporte - Errores</title>\n" +
        "<body>\n" +
        "<h1>\n" +
        "<center>Listado de Errores y su descripción</center>\n" +
        "</h1>\n" +
        "<body>\n" +
        "<center>\n"
        + "<p>\n"
        + "<br>\n"
        + "</p>\n"
        + "<table border= 4>\n"
        + "<tr>\n" +
        "<td><center><b>#</b></center></td>\n"
        + "<td><center><b>Error</b></center></td>\n"
        + "<td><center><b>Fila</b></center></td>\n"
        + "<td><center><b>Columna</b></center></td>\n"
        + "<td><center><b>Descripción</b></center></td>\n"
        + "</tr>\n";
    errorsArray.forEach(error => {
        htmlText += error + "\n";
    });
    htmlText += "</table>\n" +
        "</center>\n" +
        "</body>\n" +
        "</html>";
    saveFile(htmlText, "Errores.html");
}

function saveFile(text, name) {
    // get the textbox data...
    let textToWrite = text;
    // put the data in a Blob object...
    var textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
    // create a hyperlink <a> element tag that will be automatically clicked below...
    var downloadLink = document.createElement("a");
    // set the file name...
    downloadLink.download = name;
    // set the <a> tag href as a URL to point to the Blob
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    // automatically click the <a> element to go to the URL to save the textFileAsBlob...
    downloadLink.click();
}
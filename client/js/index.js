/**
 * Tries to connect to another url (in this case should be our back-end server)
 * and executes a POST operation
 */
function Conn() {

    var url = 'http://localhost:8080/Analyze/';

    var dataAsJson = {
        input: document.getElementById("javaText").value
    };

    console.log("Sent value:\n");
    console.log(dataAsJson);

    $.post(url, dataAsJson, function (data, status) {
        console.log(`${status}`)
    });
}
package main

import (
	"fmt"           //	implements formatted I/O
	"html/template" //	implements data-driven templates for generating HTML
	"net/http"      //	provides HTTP client and server implementations (GET, POST...)
)

//	Sets up an html file to be showed in the defined port.
func index(w http.ResponseWriter, r *http.Request) {
	t := template.Must(template.ParseFiles("index.html")) //	parses the file to a template
	t.Execute(w, "")                                      //	shows the html by invoking it
}

func main() {
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("css/")))) //	registers a 'handler' that is responsible of a route/path
	//http.Handle("/fonts/", http.StripPrefix("/fonts/", http.FileServer(http.Dir("fonts/")))) //	'handler' responds to an HTTP request
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("js/"))))
	//	basically this is what they do
	http.HandleFunc("/", index) //	registers a handler function (index) for the pattern ("/")

	fmt.Printf("Servidor escuchando en: http://localhost:8001/") //	message (using fmt package)
	http.ListenAndServe(":8001", nil)                            //	listens on the TCP network address (localhost:8000) and then calls Serve to handle requests on incoming connections.
}

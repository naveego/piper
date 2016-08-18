package main

import (
	"flag"
	"fmt"
	"net/http"
	"os/exec"
	"path/filepath"
	"runtime"

	"github.com/Sirupsen/logrus"
	"github.com/googollee/go-socket.io"
	"github.com/gorilla/mux"
	"github.com/naveego/piper/web/api"
)

var (
	listen = flag.String("listen", ":8082", "The port for listening to incoming HTTP requests")
	static string
)

func init() {
	_, file, _, _ := runtime.Caller(0)
	here := filepath.Dir(file)
	static = filepath.Join(here, "/web/content")
}

func main() {
	flag.Parse()
	logrus.SetLevel(logrus.DebugLevel)

	r := mux.NewRouter()

	ioServer, err := socketio.NewServer(nil)
	if err != nil {
		logrus.Fatal(err)
	}

	ioServer.On("connection", func(so socketio.Socket) {
		logrus.Info("Connection established")
	})

	r.PathPrefix("/socket.io/").Handler(ioServer)

	mapAPIRoutes(r)

	logrus.Debugf("Serving content from '%s'", http.Dir(static))
	r.PathPrefix("/").Handler(http.FileServer(http.Dir(static)))

	srv := http.Server{
		Addr:    *listen,
		Handler: r,
	}

	go launchBrowser(*listen)
	logrus.Fatal(srv.ListenAndServe())

}

func launchBrowser(addr string) {
	browser := map[string]string{
		"darwin": "open",
		"linux":  "xdg-open",
		"win32":  "start",
	}
	c, _ := browser[runtime.GOOS]
	url := fmt.Sprintf("http://localhost%s", addr)
	cmd := exec.Command(c, url)

	output, err := cmd.CombinedOutput()
	if err != nil {
		logrus.Errorf("Could not launch browser: %s", err.Error())
	}
	logrus.Info(string(output))
}

func mapAPIRoutes(r *mux.Router) {
	r.HandleFunc("/api/entities", api.EntitiesHandler)
	r.HandleFunc("/api/publish", api.PublishHandler)

	// Map Pipeline API simulator
	r.PathPrefix("/pipeline/settings").HandlerFunc(api.PipelineSettingsHandler)
	r.HandleFunc("/pipeline/publish", api.PipelinePublishHandler)
}

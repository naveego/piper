package api

import (
	"encoding/json"
	"net/http"
)

func PipelineSettingsHandler(w http.ResponseWriter, r *http.Request) {

	var settings map[string]interface{}

	if r.Method == "GET" {
		settings = getSettings()
	} else {
		if err := json.NewDecoder(r.Body).Decode(&settings); err != nil {
			w.WriteHeader(500)
			return
		}
		setSettings(settings)
	}

	settingsJSON, err := json.Marshal(&settings)
	if err != nil {
		w.WriteHeader(500)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(settingsJSON)

}

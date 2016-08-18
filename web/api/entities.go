package api

import (
	"encoding/json"
	"net/http"
)

type execRequest struct {
	Name       string                 `json:"name"`
	ImportPath string                 `json:"importPath"`
	Settings   map[string]interface{} `json:"settings"`
}

type execResponse struct {
	Success      bool   `json:"success"`
	Output       string `json:"output"`
	ErrorMessage string `json:"error,omitempty"`
}

func EntitiesHandler(w http.ResponseWriter, r *http.Request) {

	var req execRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	output, err := runImageCommand(req.Name, req.ImportPath, req.Settings, "entities")
	resp := execResponse{
		Output: output,
	}
	if err != nil {
		resp.ErrorMessage = err.Error()
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(&resp)
}

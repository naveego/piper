package api

import (
	"sync"

	"github.com/naveego/pipeline-api/cli"
)

var (
	connectorSettingsMU sync.RWMutex
	connectorSettings   map[string]interface{}
)

func setSettings(settings map[string]interface{}) {
	connectorSettingsMU.Lock()
	defer connectorSettingsMU.Unlock()

	connectorSettings = settings
}

func getSettings() map[string]interface{} {

	connectorSettingsMU.RLock()
	defer connectorSettingsMU.RUnlock()

	return connectorSettings

}

func runImageCommand(name, importPath string, settings map[string]interface{}, args ...string) (string, error) {
	setSettings(settings)
	args = append(args, "-r=test")
	args = append(args, "-s=testsource")
	args = append(args, "-u=http://localhost:8082/pipeline")
	output, err := cli.RunImage(name, importPath, args...)
	return output, err
}

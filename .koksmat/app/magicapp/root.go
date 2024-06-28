package magicapp

import (
	"os"

	"github.com/magicbutton/magic-master/utils"
)

func Execute(use string, short string, long string) {
	utils.RootCmd.Use = use
	utils.RootCmd.Short = short
	utils.RootCmd.Long = long
	err := utils.RootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}

func init() {

	//utils.RootCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}

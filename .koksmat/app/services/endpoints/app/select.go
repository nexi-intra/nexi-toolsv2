/*
File have been automatically created. To prevent the file from getting overwritten
set the Front Matter property ´keep´ to ´true´ syntax for the code snippet
---
keep: false
---
*/
//generator:  noma3
package app

// noma2
import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/magicbutton/magic-master/utils"
)

type SelectResponse struct {
	Result json.RawMessage `bun:"result"`
}

func Select(args []string) (*SelectResponse, error) {
	if len(args) < 1 {
		return nil, fmt.Errorf("Expected 1 arguments")
	}

	sql := args[0]

	jsonsql := fmt.Sprintf(`
	SELECT json_agg(json_data) AS result
	FROM (
		%s
	) AS json_data;
		
	`, sql)
	ctx := context.Background()

	rows, err := utils.Db.QueryContext(ctx, jsonsql)
	if err != nil {
		return nil, err
	}
	result := []SelectResponse{}
	err = utils.Db.ScanRows(ctx, rows, &result)
	if len(result) != 1 {
		return nil, fmt.Errorf("Unknown result")
	}

	return &result[0], nil
}

package applogic

import (
	"database/sql"
	"os"
	"testing"

	"github.com/spf13/viper"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"

	"github.com/magicbutton/magic-master/utils"
)

func TestMain(m *testing.M) {
	utils.Setup("./.env")

	dsn := viper.GetString("POSTGRES_DB")
	sqldb := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(dsn)))
	db := bun.NewDB(sqldb, pgdialect.New())
	defer db.Close()
	utils.Db = db
	code := m.Run()

	os.Exit(code)
}

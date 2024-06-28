package dbhelpers

import (
	"context"
	"fmt"
	"log"

	"github.com/magicbutton/magic-master/utils"
)

/**
 * SelectWhereILike is a generic function that selects all rows from a table where a column is like a search string
 *
 * @param name string
 * @param search string
 * @return []T
 * @return error
 */
func SelectWhereILike[T interface{}](name string, search string) ([]T, error) {

	ctx := context.Background()
	items := []T{}

	//	Db.NewCreateTable().Model(user).Exec(ctx)
	rows, err := utils.Db.NewSelect().Model((*T)(nil)).Where(fmt.Sprintf("%s ILIKE ?", name), search).Rows(ctx)
	if err != nil {
		return nil, err
	}
	err = utils.Db.ScanRows(ctx, rows, &items)
	if err != nil {
		return nil, err
	}

	return items, nil

}

func SelectWhere[T interface{}](query string, args ...interface{}) ([]T, error) {

	ctx := context.Background()
	items := []T{}

	//	Db.NewCreateTable().Model(user).Exec(ctx)
	rows, err := utils.Db.NewSelect().Model((*T)(nil)).Where(query, args...).Rows(ctx)
	if err != nil {
		return nil, err
	}
	err = utils.Db.ScanRows(ctx, rows, &items)
	if err != nil {
		return nil, err
	}

	return items, nil

}

func SelectDistinct[T interface{}](query string, columns []string, args ...interface{}) ([]T, error) {

	ctx := context.Background()
	items := []T{}

	//	Db.NewCreateTable().Model(user).Exec(ctx)
	rows, err := utils.Db.NewSelect().Model((*T)(nil)).Column(columns...).Distinct().Where(query, args...).Rows(ctx)
	if err != nil {
		return nil, err
	}
	err = utils.Db.ScanRows(ctx, rows, &items)
	if err != nil {
		return nil, err
	}

	return items, nil

}

func SelectById[T interface{}](id int) (*T, error) {

	ctx := context.Background()

	item := new(T)

	err := utils.Db.NewSelect().Model(item).Where("id =  ?", id).Scan(ctx)
	if err != nil {
		return item, err
	}

	return item, nil

}

func DeleteById[T interface{}](id int) error {

	ctx := context.Background()

	item := new(T)

	err := utils.Db.NewDelete().Model(item).Where("id =  ?", id).Scan(ctx)
	if err != nil {
		return err
	}

	return nil

}

func Update[T interface{}](data T) error {

	ctx := context.Background()

	_, err := utils.Db.NewUpdate().Model(&data).WherePK().Exec(ctx)
	if err != nil {
		return err
	}

	return nil

}

func Create[T interface{}](data T) (*T, error) {

	ctx := context.Background()

	inserted, err := utils.Db.NewInsert().Model(&data).Exec(ctx)
	if err != nil {
		return nil, err
	}
	r, _ := inserted.RowsAffected()
	log.Println("Inserted", r, "rows")
	return &data, nil

}

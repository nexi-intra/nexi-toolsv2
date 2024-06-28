package applogic

import (
	"fmt"

	"github.com/magicbutton/magic-master/database/dbhelpers"
	"github.com/magicbutton/magic-master/utils"
)

/**
 * Search is a generic function that searches a table for a string in a column
 *
 * @param fieldname string
 * @param query string
 * @param mapper func(DB) DOC
 * @return *utils.Page[DOC]
 * @return error

 Example of mapper function:
 ```go
 func mapGroupsegment(item database.Groupsegment) groupsegmentmodel.Groupsegment {
	return groupsegmentmodel.Groupsegment{
		ID:   fmt.Sprintf("%d", item.ID),
		Name: item.Name,
	}
```
}
*/

type Identifiable struct {
	ID int
}

func Search[DB interface{}, DOC interface{}](fieldname string, query string, mapper func(DB) DOC) (*utils.Page[DOC], error) {

	result, err := dbhelpers.SelectWhere[DB](fmt.Sprintf("%s ILIKE ?", fieldname), query)

	if err != nil {
		return nil, err
	}
	items := []DOC{}
	pageSize := 500

	for index, item := range result {
		if index >= pageSize {
			break
		}
		mappedItem := mapper(item)
		items = append(items, mappedItem)
	}

	page := utils.Page[DOC]{
		Items:       items,
		TotalPages:  (len(items) / pageSize) + 1,
		TotalItems:  len(items),
		CurrentPage: 0,
	}

	return &page, nil
}

func Select[DB interface{}, DOC interface{}](query string, mapper func(DB) DOC, args ...interface{}) (*[]DOC, error) {

	result, err := dbhelpers.SelectWhere[DB](query, args...)

	if err != nil {
		return nil, err
	}
	items := []DOC{}
	for _, item := range result {
		mappedItem := mapper(item)
		items = append(items, mappedItem)
	}

	return &items, nil
}

func SelectDistinct[DB interface{}, DOC interface{}](query string, mapper func(DB) DOC, columns []string, args ...interface{}) (*[]DOC, error) {

	result, err := dbhelpers.SelectDistinct[DB](query, columns, args...)

	if err != nil {
		return nil, err
	}
	items := []DOC{}
	for _, item := range result {
		mappedItem := mapper(item)
		items = append(items, mappedItem)
	}

	return &items, nil
}

func Create[DB interface{}, DOC interface{}](item DOC, mapperIncoming func(DOC) DB, mapperOutgoing func(DB) DOC) (*DOC, error) {

	dbItem := mapperIncoming(item)
	_, err := dbhelpers.Create[DB](dbItem)
	if err != nil {
		return nil, err
	}
	createdItem := mapperOutgoing(dbItem)
	return &createdItem, nil

}

func Read[DB interface{}, DOC interface{}](id int, mapper func(DB) DOC) (*DOC, error) {
	dbItem, err := dbhelpers.SelectById[DB](id)
	if err != nil {
		return nil, err
	}
	item := mapper(*dbItem)
	return &item, nil

}

func Update[DB interface{}, DOC interface{}](id int, item DOC, mapperIncoming func(DOC) DB, mapperOutgoing func(DB) DOC) (*DOC, error) {

	dbItem := mapperIncoming(item)
	err := dbhelpers.Update[DB](dbItem)
	if err != nil {
		return nil, err
	}
	updatedItem, err := dbhelpers.SelectById[DB](id)
	mappedItem := mapperOutgoing(*updatedItem)
	return &mappedItem, nil

}

func Delete[DB interface{}, DOC interface{}](id int) error {
	err := dbhelpers.DeleteById[DB](id)
	if err != nil {
		return err
	}

	return nil

}

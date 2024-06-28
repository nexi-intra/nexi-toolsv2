package databasetypes

type Page struct {
	CurrentPage int         `json:"current_page"`
	TotalPages  int         `json:"total_pages"`
	TotalItems  int         `json:"total_items"`
	Items       []Reference `json:"items"`
}

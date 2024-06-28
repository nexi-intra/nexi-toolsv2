package schemas

type AllGroups []struct {
	Description string `json:"description"`
	Id          string `json:"id"`
	Notesid     string `json:"notesid"`
	Title       string `json:"title"`
}

package schemas

type User struct {
	Dbid               int      `json:"dbid"`
	Email              string   `json:"email"`
	Email_subscription bool     `json:"email_subscription"`
	Firstname          string   `json:"firstname"`
	Lastchanged        string   `json:"lastchanged"`
	Lastname           string   `json:"lastname"`
	Memberof           []string `json:"memberof"`
	Mobilenumber       string   `json:"mobilenumber"`
	Sms_subscription   bool     `json:"sms_subscription"`
	Userid             string   `json:"userid"`
}

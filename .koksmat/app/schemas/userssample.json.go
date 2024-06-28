package schemas

type Userssample []struct {
	_Odata_etag string `json:"@odata.etag"`
	ContentType struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	} `json:"contentType"`
	CreatedBy struct {
		User struct {
			DisplayName string `json:"displayName"`
		} `json:"user"`
	} `json:"createdBy"`
	CreatedDateTime string `json:"createdDateTime"`
	ETag            string `json:"eTag"`
	Fields          struct {
		_Odata_etag       string `json:"@odata.etag"`
		AppAuthorLookupId string `json:"AppAuthorLookupId"`
		AppEditorLookupId string `json:"AppEditorLookupId"`
		Attachments       bool   `json:"Attachments"`
		AuthorLookupId    string `json:"AuthorLookupId"`
		Company           string `json:"Company"`
		ContentType       string `json:"ContentType"`
		Created           string `json:"Created"`
		Edit              string `json:"Edit"`
		EditorLookupId    string `json:"EditorLookupId"`
		EmailSelected     bool   `json:"EmailSelected"`
		FirstName         string `json:"FirstName"`
		FolderChildCount  string `json:"FolderChildCount"`
		ItemChildCount    string `json:"ItemChildCount"`
		LinkTitle         string `json:"LinkTitle"`
		LinkTitleNoMenu   string `json:"LinkTitleNoMenu"`
		Member_x0020_of   []struct {
			LookupId    int    `json:"LookupId"`
			LookupValue string `json:"LookupValue"`
		} `json:"Member_x0020_of"`
		Member_x0020_of_x003a__x0020_Not []struct {
			LookupId    int    `json:"LookupId"`
			LookupValue string `json:"LookupValue"`
		} `json:"Member_x0020_of_x003a__x0020_Not"`
		Mobillnummer                string `json:"Mobillnummer"`
		Modified                    string `json:"Modified"`
		SMSSelected                 bool   `json:"SMSSelected"`
		SMS_x0020_Exchange_x0020_ID string `json:"SMS_x0020_Exchange_x0020_ID"`
		SurName                     string `json:"SurName"`
		Title                       string `json:"Title"`
		_ComplianceFlags            string `json:"_ComplianceFlags"`
		_ComplianceTag              string `json:"_ComplianceTag"`
		_ComplianceTagUserId        string `json:"_ComplianceTagUserId"`
		_ComplianceTagWrittenTime   string `json:"_ComplianceTagWrittenTime"`
		_UIVersionString            string `json:"_UIVersionString"`
		Id                          string `json:"id"`
	} `json:"fields"`
	Fields_odata_context string `json:"fields@odata.context"`
	Id                   string `json:"id"`
	LastModifiedBy       struct {
		Application struct {
			DisplayName string `json:"displayName"`
			Id          string `json:"id"`
		} `json:"application"`
		User struct {
			DisplayName string `json:"displayName"`
		} `json:"user"`
	} `json:"lastModifiedBy"`
	LastModifiedDateTime string `json:"lastModifiedDateTime"`
	ParentReference      struct {
		Id     string `json:"id"`
		SiteId string `json:"siteId"`
	} `json:"parentReference"`
	WebUrl string `json:"webUrl"`
}

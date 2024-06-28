package schemas

type Infocastgroups []struct {
	FieldValues struct {
		AccessPolicy string `json:"AccessPolicy"`
		AppAuthor    struct {
			LookupId    int    `json:"LookupId"`
			LookupValue string `json:"LookupValue"`
			TypeId      string `json:"TypeId"`
		} `json:"AppAuthor"`
		AppEditor struct {
			LookupId    int    `json:"LookupId"`
			LookupValue string `json:"LookupValue"`
			TypeId      string `json:"TypeId"`
		} `json:"AppEditor"`
		Attachments bool `json:"Attachments"`
		Author      struct {
			Email       string `json:"Email"`
			LookupId    int    `json:"LookupId"`
			LookupValue string `json:"LookupValue"`
			TypeId      string `json:"TypeId"`
		} `json:"Author"`
		ComplianceAssetId interface{} `json:"ComplianceAssetId"`
		ContentTypeId     struct {
			StringValue string `json:"StringValue"`
			TypeId      string `json:"TypeId"`
		} `json:"ContentTypeId"`
		ContentVersion     string `json:"ContentVersion"`
		Created            string `json:"Created"`
		Created_x0020_Date string `json:"Created_x0020_Date"`
		Editor             struct {
			Email       string `json:"Email"`
			LookupId    int    `json:"LookupId"`
			LookupValue string `json:"LookupValue"`
			TypeId      string `json:"TypeId"`
		} `json:"Editor"`
		FSObjType           string      `json:"FSObjType"`
		FileDirRef          string      `json:"FileDirRef"`
		FileLeafRef         string      `json:"FileLeafRef"`
		FileRef             string      `json:"FileRef"`
		File_x0020_Type     interface{} `json:"File_x0020_Type"`
		FolderChildCount    string      `json:"FolderChildCount"`
		GUID                string      `json:"GUID"`
		Hidden              bool        `json:"Hidden"`
		ID                  int         `json:"ID"`
		InstanceID          interface{} `json:"InstanceID"`
		ItemChildCount      string      `json:"ItemChildCount"`
		Last_x0020_Modified string      `json:"Last_x0020_Modified"`
		MetaInfo            string      `json:"MetaInfo"`
		Modified            string      `json:"Modified"`
		NoExecute           string      `json:"NoExecute"`
		Notes_x0020_ID      string      `json:"Notes_x0020_ID"`
		Order               float64     `json:"Order"`
		OriginatorId        string      `json:"OriginatorId"`
		Owner               interface{} `json:"Owner"`
		ParentUniqueId      string      `json:"ParentUniqueId"`
		ProgId              string      `json:"ProgId"`
		Restricted          string      `json:"Restricted"`
		SMLastModifiedDate  string      `json:"SMLastModifiedDate"`
		SMTotalFileCount    struct {
			LookupId    int    `json:"LookupId"`
			LookupValue string `json:"LookupValue"`
			TypeId      string `json:"TypeId"`
		} `json:"SMTotalFileCount"`
		SMTotalFileStreamSize string `json:"SMTotalFileStreamSize"`
		SMTotalSize           struct {
			LookupId    int    `json:"LookupId"`
			LookupValue string `json:"LookupValue"`
			TypeId      string `json:"TypeId"`
		} `json:"SMTotalSize"`
		ScopeId      string `json:"ScopeId"`
		SortBehavior struct {
			LookupId    int    `json:"LookupId"`
			LookupValue string `json:"LookupValue"`
			TypeId      string `json:"TypeId"`
		} `json:"SortBehavior"`
		SyncClientId struct {
			LookupId    int         `json:"LookupId"`
			LookupValue interface{} `json:"LookupValue"`
			TypeId      string      `json:"TypeId"`
		} `json:"SyncClientId"`
		Title                     string      `json:"Title"`
		UniqueId                  string      `json:"UniqueId"`
		WorkflowInstanceID        interface{} `json:"WorkflowInstanceID"`
		WorkflowVersion           int         `json:"WorkflowVersion"`
		_ColorHex                 interface{} `json:"_ColorHex"`
		_ColorTag                 interface{} `json:"_ColorTag"`
		_CommentCount             string      `json:"_CommentCount"`
		_CommentFlags             string      `json:"_CommentFlags"`
		_ComplianceFlags          string      `json:"_ComplianceFlags"`
		_ComplianceTag            string      `json:"_ComplianceTag"`
		_ComplianceTagUserId      string      `json:"_ComplianceTagUserId"`
		_ComplianceTagWrittenTime string      `json:"_ComplianceTagWrittenTime"`
		_CopySource               interface{} `json:"_CopySource"`
		_Emoji                    interface{} `json:"_Emoji"`
		_HasCopyDestinations      interface{} `json:"_HasCopyDestinations"`
		_IsCurrentVersion         bool        `json:"_IsCurrentVersion"`
		_Level                    int         `json:"_Level"`
		_ModerationComments       interface{} `json:"_ModerationComments"`
		_ModerationStatus         int         `json:"_ModerationStatus"`
		_UIVersion                int         `json:"_UIVersion"`
		_UIVersionString          string      `json:"_UIVersionString"`
		_VirusInfo                string      `json:"_VirusInfo"`
		_VirusStatus              string      `json:"_VirusStatus"`
		_VirusVendorID            string      `json:"_VirusVendorID"`
		Owshiddenversion          int         `json:"owshiddenversion"`
	} `json:"FieldValues"`
}

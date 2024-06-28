package utils

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/nats-io/nats.go/micro"
)

type ServiceRequest struct {
	Args          []string `json:"args"`
	Body          string   `json:"body"`
	Channel       string   `json:"channel"`
	Timeout       int      `json:"timeout"`
	TransactionID string   `json:"transactionID"`
	Token         string   `json:"token"`
}

type ServiceResponseModel struct {
	HasError     bool   `json:"hasError"`
	ErrorMessage string `json:"errorMessage"`
	Data         string `json:"data"`
}

type Page[K any] struct {
	TotalPages  int `json:"totalPages"`
	TotalItems  int `json:"totalItems"`
	CurrentPage int `json:"currentPage"`
	Items       []K `json:"items"`
}

func ServiceResponse(req micro.Request, data any) {
	// Marshal the data to JSON
	response, err := json.Marshal(data)
	if err != nil {

		ServiceResponseError(req, "Error marshalling data to JSON")
		return
	}

	req.RespondJSON(ServiceResponseModel{
		HasError:     false,
		ErrorMessage: "",
		Data:         string(response),
	})
}

func ServiceResponseError(req micro.Request, errorMessage string) {
	req.RespondJSON(ServiceResponseModel{
		HasError:     true,
		ErrorMessage: errorMessage,
		Data:         "",
	})
}
func ProcessAppRequest[T interface{}](req micro.Request, process func([]string) (*T, error)) {

	var payload ServiceRequest
	_ = json.Unmarshal([]byte(req.Data()), &payload)
	args := payload.Args[1:]
	result, err := process(args)
	if err != nil {
		log.Println("Error", err)
		ServiceResponseError(req, fmt.Sprintf("%s", err))

		return
	}

	ServiceResponse(req, result)

}

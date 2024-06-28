package utils

import "strconv"

func StrToInt(s string) int {
	i, _ := strconv.Atoi(s)
	return i
}

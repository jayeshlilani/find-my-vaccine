import React, {useEffect, useState, useLayoutEffect} from "react";

//This file includes the util functions

//creating a dynamic scalable list of dates to be displayed as column
export function createDateList(date, size) {
    let i = 0, dateList = []
    let dt = new Date(date)
    while (i < size) {
        dateList.push({title: convertDateToString(dt), value: dt.toDateString()})
        dt.setDate(dt.getDate() + 1);
        i++
    }
    return dateList
}

//converting date to string format (dd-mm-yyyy)
export function convertDateToString(dt) {
    return dt.getDate() + "-" + (dt.getMonth() + 1) + "-" + dt.getFullYear()
}

//converting string (dd-mm-yyyy) to date format
export function convertStringToDate(str) {
    let strArr = str.split('-')
    return new Date(strArr[2], strArr[1] - 1, strArr[0])
}

//returning the size of date list according to the screen size
export function returnSize() {
    return window.innerWidth > 769 ? 5 : 2
}

export function checkError(response, responseData) {
    if (response == 'TypeError: Failed to fetch')
        return (500)
    else if (response.errorCode == "APPOIN0018")
        return (400)
    else if (responseData != undefined && responseData.length === 0)
        return (1)
    else return (0)
}


import '../App.css';
import React, {useEffect, useState} from "react";

//This file includes the function calls to all open source apis by government

// const apiHead = "https://api.demo.co-vin.in/api"  //test
const apiHead = "https://cdn-api.co-vin.in/api"  //prod

// Get list of all states
export async function getStates() {
    return new Promise(resolve => {
        fetch(apiHead + "/v2/admin/location/states")
            .then(res => res.json())
            .then(
                (result) => {
                    resolve(result)
                },
                (error) => {
                    resolve(error)
                }
            )
    });
}

// Get list of districts from specific state
export async function getDistricts(stateId) {
    return new Promise(resolve => {
        fetch(apiHead + "/v2/admin/location/districts/"+stateId)
            .then(res => res.json())
            .then(
                (result) => {
                    resolve(result)
                },
                (error) => {
                    resolve(error)
                }
            )
    });
}

// Get slot data of the region in the specified pincode
export async function findByPin(pincode, date) {
    return new Promise(resolve => {
        fetch(apiHead + "/v2/appointment/sessions/public/calendarByPin?pincode=" + pincode + "&date=" + date)
            .then(res => res.json())
            .then(
                (result) => {
                    resolve(result)
                },
                (error) => {
                    resolve(error)
                }
            )
    });
}

// Get slot data of the region in the specified district
export async function findByDistrict(districtId, date) {
    return new Promise(resolve => {
        fetch(apiHead + "/v2/appointment/sessions/public/calendarByDistrict?district_id=" + districtId + "&date=" + date)
            .then(res => res.json())
            .then(
                (result) => {
                    resolve(result)
                },
                (error) => {
                    resolve(error)
                }
            )
    });
}



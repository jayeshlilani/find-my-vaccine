import logo from '../logo.svg';
import '../App.css';
import React, {useEffect, useLayoutEffect, useState} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {findByPin, findByDistrict, getStates, getDistricts} from "./APIServices.js"
import {checkError, convertDateToString, convertStringToDate, createDateList, returnSize} from "./Utils.js"
import InputSearch from "./InputSearch.js"

import {makeStyles} from '@material-ui/core/styles';
import {AddBox, ArrowDownward} from "@material-ui/icons";
import {MDBTable, MDBTableBody, MDBTableHead} from 'mdbreact';
import {Container, Row, Col} from "react-bootstrap";
import {Autocomplete, ToggleButton, ToggleButtonGroup} from '@material-ui/lab';
import {Input, TextField} from "@material-ui/core";
import Spinner from 'react-spinner-material';


const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});


export default function Home() {

    const [error, setError] = useState(0);
    const [responseData, setResponseData] = useState([]);
    const [responseDataStates, setResponseDataStates] = useState([]);
    const [responseDataDistricts, setResponseDataDistricts] = useState([]);
    const [dateList, setDateList] = useState([]);
    let initialDate = new Date()
    const [searchType, setSearchType] = React.useState('pincode');
    const [selectedState, setSelectedState] = React.useState(-1);
    const [selectedDistrict, setSelectedDistrict] = React.useState(-1);
    const [age, setAge] = React.useState(() => []);
    const [fees, setFees] = React.useState(() => []);
    const [doseType, setDoseType] = React.useState(() => []);
    const [vaccines, setVaccines] = React.useState(() => []);
    const [loading, setLoading] = React.useState(() => false);
    const [visibility, setVisibility] = React.useState(() => false);
    const errorMessages = {
        0: '',
        1: 'No slots available at your searched location',
        400: 'Invalid Pincode',
        500: 'Unable to fetch data from server, please try again'
    }
    const handleSearchType = (event, searchType) => {
        setSearchType(searchType)
        setResponseData([])
        setVisibility(false)
    };
    const handleVaccines = (event, vaccines) => {
        setVaccines(vaccines);
    };
    const handleAge = (event, age) => {
        setAge(age);
    };
    const handleFees = (event, fee) => {
        setFees(fee);
    };
    const handleDoseType = (event, doseType) => {
        setDoseType(doseType);
    };

    useEffect(() => {
        setDateList(createDateList(initialDate, returnSize()))
        callAPIService('getStates')
        returnSize()
    }, [])

    async function callAPIService(type, value, event) {
        setError(false)
        let response = []
        setLoading(true)
        if (type === 'findByPin') {
            response = await findByPin(value, convertDateToString(initialDate))
            setResponseData(response.centers)
            setError(checkError(response, response.centers))
            setVisibility(true)
        } else if (type === 'findByDistrict') {
            response = await findByDistrict(value, convertDateToString(initialDate))
            setResponseData(response.centers)
            setError(checkError(response, response.centers))
            setVisibility(true)
        } else if (type === 'getStates') {
            response = await getStates()
            setResponseDataStates(response.states)
            setError(checkError(response, response.states))
        } else if (type === 'getDistrict') {
            response = await getDistricts(parseInt(value))
            setResponseDataDistricts(response.districts)
            setError(checkError(response, response.districts))
        }

        setLoading(false)
    }


    return (
        <Container>
            <Row>
                <Col>
                    <h4 id="headline">Check Vaccine slot availability in your nearby location</h4>
                </Col>
            </Row>
            <Row>
                <Col md={5}>
                    <div id="searchBy">
                        <span>
                            <h4>Search by</h4>
                        </span>
                        <span>
                            <ToggleButtonGroup
                                value={searchType}
                                exclusive
                                onChange={handleSearchType}
                                aria-label="text searchType"
                                id="toggleBtnGroup"

                            >
                                <ToggleButton value="pincode" aria-label="centered" style={{padding: '15px 12px'}}
                                              className={searchType === 'pincode' ? 'btn-primary text-light' : 'btn-other'}
                                              disabled={loading}>
                                    Pincode
                                </ToggleButton>
                                <ToggleButton value="district" aria-label="centered" style={{padding: '15px 12px'}}
                                              className={searchType === 'district' ? 'btn-primary  text-light' : 'btn-other'}
                                              disabled={loading}>
                                    District
                                </ToggleButton>
                            </ToggleButtonGroup>
                            </span>
                    </div>
                </Col>
                <Col md={7}>
                    <Row>
                        {searchType === 'district' &&
                        <Col md={6}>
                            <Autocomplete
                                className="autoCompleteDropdown"
                                id="combo-box-state"
                                options={responseDataStates}
                                getOptionLabel={(option) => option.state_name}
                                clearOnEscape
                                disabled={loading}
                                onInputChange={(event, option) => {
                                    var selectedObject = responseDataStates.filter(i => i.state_name === option)
                                    setSelectedState(selectedObject.length > 0 ? selectedObject[0].state_id : -1);
                                    if (selectedObject.length > 0) {
                                        setSelectedDistrict(-1)
                                        callAPIService('getDistrict', selectedObject[0].state_id)
                                    }
                                }}
                                renderInput={(params) => <TextField {...params} label="State" variant="outlined"/>}
                            />
                        </Col>}
                        {searchType === 'district' &&
                        <Col md={6}>
                            <Autocomplete
                                className="autoCompleteDropdown"
                                id="combo-box-district"
                                options={responseDataDistricts}
                                getOptionLabel={(option) => option.district_name}
                                clearOnEscape
                                onInputChange={(event, option) => {
                                    var selectedObject = responseDataDistricts.filter(i => i.district_name === option)
                                    setSelectedDistrict(selectedObject.length > 0 ? selectedObject[0].district_id : -1);
                                    if (selectedObject.length > 0) {
                                        callAPIService('findByDistrict', selectedObject[0].district_id)
                                    }
                                }}
                                disabled={selectedState < 0 || loading}
                                renderInput={(params) => <TextField {...params} label="District" variant="outlined"/>}
                            />
                        </Col>}
                        {searchType === 'pincode' &&
                        <Col md={12}>
                            <InputSearch callAPIService={(type, value) => {
                                if (!(/^([0-9]{6})$/.test(type)))
                                    setError(400)
                                else callAPIService('findByPin', type)
                            }} disabled={loading}
                            />
                        </Col>}
                    </Row>
                </Col>
            </Row>

            {error !== 0 && <Row>
                <h3 id="errorMessage">{errorMessages[error]}</h3>
            </Row>}

            {loading && <Row>
                <Spinner radius={120} color={"#333"} stroke={2} visible={loading} id="loader"/>
            </Row>}

            {!loading && error === 0 && visibility &&
            <Row>
                <Col lg={5} md={6} sm={12}>
                    <ToggleButtonGroup value={vaccines} onChange={handleVaccines} aria-label="text formatting"
                                       className={'filterGroup'}>
                        <ToggleButton value="COVISHIELD" aria-label="bold"
                                      className={vaccines.indexOf('COVISHIELD') >= 0 ? 'btn-primary text-light' : 'btn-other'}>
                            Covishield
                        </ToggleButton>
                        <ToggleButton value="COVAXIN" aria-label="bold"
                                      className={vaccines.indexOf('COVAXIN') >= 0 ? 'btn-primary text-light' : 'btn-other'}>
                            Covaxin
                        </ToggleButton>
                        <ToggleButton value="SPUTNIK V" aria-label="bold"
                                      className={vaccines.indexOf('SPUTNIK V') >= 0 ? 'btn-primary text-light' : 'btn-other'}>
                            Sputnik V
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Col>
                <Col lg={2} md={6} sm={6}>
                    <ToggleButtonGroup value={fees} onChange={handleFees} aria-label="text formatting"
                                       className={'filterGroup'}>
                        <ToggleButton value="Free" aria-label="bold"
                                      className={fees.indexOf('Free') >= 0 ? 'btn-primary text-light' : 'btn-other'}>
                            Free
                        </ToggleButton>
                        <ToggleButton value="Paid" aria-label="bold"
                                      className={fees.indexOf('Paid') >= 0 ? 'btn-primary text-light' : 'btn-other'}>
                            Paid
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Col>
                <Col  lg={2} md={6} sm={6}>
                    <ToggleButtonGroup value={doseType} onChange={handleDoseType} aria-label="text formatting"
                                       className={'filterGroup'}>
                        <ToggleButton value="dose1" aria-label="bold"
                                      className={doseType.indexOf('dose1') >= 0 ? 'btn-primary text-light' : 'btn-other'}>
                            Dose 1
                        </ToggleButton>
                        <ToggleButton value="dose2" aria-label="bold"
                                      className={doseType.indexOf('dose2') >= 0 ? 'btn-primary text-light' : 'btn-other'}>
                            Dose 2
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Col>
                <Col lg={3} md={6} sm={6}>
                    <ToggleButtonGroup value={age} onChange={handleAge} aria-label="text formatting"
                                       className={'filterGroup'}>
                        <ToggleButton value="18" aria-label="bold"
                                      className={age.indexOf('18') >= 0 ? 'btn-primary text-light' : 'btn-other'}>
                            Age 18+
                        </ToggleButton>
                        <ToggleButton value="45" aria-label="bold"
                                      className={age.indexOf('45') >= 0 ? 'btn-primary text-light' : 'btn-other'}>
                            Age 45+
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Col>
            </Row>}

            {!loading && error === 0 && visibility &&
            <Row id="dataHeader">
                <Col>
                    <MDBTable responsive hover small>
                        <MDBTableHead>
                            <tr>
                                <td className="rowHead">Center</td>
                                {dateList.map((colItem, index) => (
                                    <td className="rowHead">{colItem.value.substring(4)}</td>
                                ))}
                            </tr>
                        </MDBTableHead>
                    </MDBTable></Col>
            </Row>}

            {!loading && error === 0 && visibility &&
            <Row id="dataTable">
                <Col>
                    <MDBTable responsive hover small>
                        <MDBTableBody id="tableBody">

                            {responseData !== undefined && responseData.length > 0 ? responseData.map((row) => (

                                <tr key={row.center_id}>
                                    <td>
                                        {row.name.toUpperCase()}
                                    </td>
                                    {dateList.map((colItem, index) => (
                                        <td key={index}>
                                            {
                                                row.sessions.filter(i => convertStringToDate(i.date).toDateString() === colItem.value).length > 0 ?
                                                    row.sessions.map((sessionItem, index) => (
                                                        convertStringToDate(sessionItem.date).toDateString() === colItem.value ?
                                                            (vaccines.length === 0 || vaccines.indexOf(sessionItem.vaccine) >= 0)
                                                            && (age.length === 0 || age.indexOf(String(sessionItem.min_age_limit)) >= 0)
                                                            && (fees.length === 0 || fees.indexOf(row.fee_type) >= 0) ?
                                                                <MDBTable borderless small id="childTable"
                                                                          key={index}>
                                                                    <MDBTableBody>
                                                                        <tr>
                                                                            <td>
                                                                                {doseType.length === 0 || doseType.indexOf('dose1') >= 0 ? sessionItem.available_capacity_dose1 === 0 ?
                                                                                    <p className="cellContent booked">
                                                                                        <i>Dose 1 : Booked</i>
                                                                                    </p> :
                                                                                    <p className="cellContent available">
                                                                                        <i>Dose 1
                                                                                            : {sessionItem.available_capacity_dose1}</i>
                                                                                    </p> : <i></i>}
                                                                                {doseType.length === 0 || doseType.indexOf('dose2') >= 0 ? sessionItem.available_capacity_dose2 === 0 ?
                                                                                    <p className="cellContent booked">
                                                                                        <i>Dose 2 : Booked</i>
                                                                                    </p> :
                                                                                    <p className="cellContent available">
                                                                                        <i>Dose 2
                                                                                            : {sessionItem.available_capacity_dose2}</i>
                                                                                    </p> : <i></i>}
                                                                                <p className="cellContent">
                                                                                    <b>{sessionItem.vaccine}</b>
                                                                                </p>
                                                                                <p className="cellContent">
                                                                                    <i id={sessionItem.min_age_limit < 45 ? 'age18' : 'age45'}>
                                                                                        {sessionItem.min_age_limit}+
                                                                                    </i>
                                                                                </p>
                                                                            </td>
                                                                        </tr>
                                                                    </MDBTableBody>
                                                                </MDBTable> : <p className="NA">NA</p>
                                                            : <i></i>

                                                    )) : <p className="NA">NA</p>
                                            }
                                        </td>
                                    ))}
                                </tr>
                            )) : <p className="error"></p>
                            }
                        </MDBTableBody>
                    </MDBTable>
                </Col>

            </Row>}
        </Container>
    );
}
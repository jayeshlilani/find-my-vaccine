import React, {useCallback} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import {Search} from "@material-ui/icons";
import Home from './Home'

const useStyles = makeStyles((theme) => ({

    margin: {
        marginTop: 12,
        marginBottom: 12,
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        width: '100%',
    },
}));

export default function InputSearch(props) {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        searchQuery: ''
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        console.log(values)
    };

    const handleClickShowSearch = () => {
        console.log(values.searchQuery)
    };

    const handleMouseDownSearch = (event) => {
        event.preventDefault();
    };

    return (
                <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-text">Pincode</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-text"
                        type='text'
                        value={values.searchQuery}
                        pattern={'[0-9]{6}'}
                        onChange={handleChange('searchQuery')}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={props.callAPIService.bind('findByPin',values.searchQuery)}
                                    onMouseDown={handleMouseDownSearch}
                                    edge="end"
                                >
                                    {<Search/>}
                                </IconButton>
                            </InputAdornment>
                        }
                        labelWidth={70}
                    />
                </FormControl>
    );
}

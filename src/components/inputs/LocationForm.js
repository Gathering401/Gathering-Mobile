import axios from 'axios';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { REACT_APP_GEO_CODE } from '@env';

import { styles } from '../../styles/main-styles';

import CustomFormik from '../CustomFormik';

export default function LocationForm() {
    let [locationSearched, setLocationSearched] = useState(false);
    let [confirmAddress, setConfirmAddress] = useState('');

    const searchForLocation = async (values) => {
        const { data: { results: [ { formatted_address: addressSearched } ] } } = await axios({
            method: 'GET',
            url: `https://maps.googleapis.com/maps/api/geocode/json?address=${values.locationSearch}&key=${REACT_APP_GEO_CODE}`
        });
        
        console.log('address', addressSearched);
        if(addressSearched) {
            setConfirmAddress(addressSearched);
        }
    }
    
    return locationSearched ?
        <View>
            <Text>...insert form here</Text>
        </View>
        :
        <CustomFormik
            steps={[[
                { label: 'Search for location...', type: 'text', initial: '', placeholder: '1234 Main St', fieldName: 'locationSearch'}
            ]]}
            formSubmit={searchForLocation}
        />
}
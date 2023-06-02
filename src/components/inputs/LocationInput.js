import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Button } from 'react-native';
import { FiCheck, FiX } from 'react-icons/fi';

import { REACT_APP_GEO_CODE } from '@env';

import Label from '../Label';
import ErrorMessage from '../helpers/ErrorMessage';

import { styles } from '../../styles/main-styles';

const tryAgainText = 'Make sure you didn\'t make any typos. If it looks correct, try being more precise with City, State, or Zip Code.';

export default function LocationInput({ label, placeholder, fieldName, setFieldValue, required }) {
    let [locationToSearch, setLocationToSearch] = useState('');
    let [confirmAddress, setConfirmAddress] = useState('');
    let [locationSearched, setLocationSearched] = useState(false);
    let [locationSubmitted, setLocationSubmitted] = useState(false);
    let [displayError, setDisplayError] = useState({display: false, text: ''});
    let [placeId, setPlaceId] = useState('');
    
    const searchForLocation = async () => {
        try {
            const { data: { results: [ { formatted_address: addressSearched, place_id } ] } } = await axios({
                method: 'GET',
                url: `https://maps.googleapis.com/maps/api/geocode/json?address=${locationToSearch}&key=${REACT_APP_GEO_CODE}`
            });
            
            
            if(addressSearched) {
                setConfirmAddress(addressSearched);
                setPlaceId(place_id);
                setLocationSearched(true);
            }
        } catch(err) {
            setLocationSearched(false);
            setDisplayError({display: true, text: `Invalid location. ${tryAgainText}`});
        }
    }

    const resetLocationField = () => {
        setLocationSearched(false);
        setDisplayError({display: true, text: tryAgainText});
    }

    const submitLocation = () => {
        setFieldValue(fieldName, placeId);
        setLocationSearched(false);
        setLocationSubmitted(true);
    }
    
    return <>
        {displayError.display && <ErrorMessage text={displayError.text} />}
        {locationSearched ?
            <Modal>
                <Text>Is this correct?</Text>
                <Text>{confirmAddress}</Text>
                <TouchableOpacity onPress={resetLocationField}><FiX color='red'/></TouchableOpacity>
                <TouchableOpacity onPress={submitLocation}><FiCheck color='green'/></TouchableOpacity>
            </Modal>
            : <View style={styles.inputAndLabel}>
                <Label text={label} required={required}/>
                <TextInput
                    style={styles.textInput}
                    required={required}
                    spellCheck={false}
                    autoCapitalize='words'
                    onChangeText={(value) => setLocationToSearch(value)}
                    onSubmitEditing={searchForLocation}
                    placeholder={placeholder}
                    placeholderTextColor="rgb(190, 190, 190)"
                    value={locationSubmitted ? confirmAddress : locationToSearch}
                />
            </View>
        }
    </>
}
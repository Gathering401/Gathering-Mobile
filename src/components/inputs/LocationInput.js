import axios from 'axios';
import { useState } from 'react';
import { findNodeHandle, TouchableOpacity, View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';

import { REACT_APP_GEO_CODE } from '@env';

import LocationText from '../LocationText';

import ErrorMessage from '../helpers/ErrorMessage';
import { formatLocation } from '../helpers/locationFormatter';
import { compAddress } from '../../service/compAddress';

import { styles } from '../../styles/main-styles';

const tryAgainText = 'If it looks correct, try being more precise.';

export default function LocationInput({ fieldName, value, setFieldValue, handleBlur }) {
    const noError = {display: false};

    const [locationToSearch, setLocationToSearch] = useState(value ?? '');
    const [openLocationSearch, setOpenLocationSearch] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [displayError, setDisplayError] = useState(noError);
    
    const searchForLocation = async () => {
        try {
            setDisplayError(noError)
            const { data: { results } } = await axios({
                method: 'GET',
                url: `https://maps.googleapis.com/maps/api/geocode/json?address=${locationToSearch}&key=${REACT_APP_GEO_CODE}`
            });

            const location = compAddress(results[0].address_components);
            const formattedLocation = formatLocation(location, {
                streetAddress: true,
                cityState: true,
                zip: true
            });
            if(formattedLocation.errors) {
                setDisplayError({display: true, text: `Invalid address, missing following fields: ${formattedLocation.errors}.`});
            } else {
                setSearchResults({location: formattedLocation.formattedLocation, placeId: results[0].place_id});
            }
        } catch(err) {
            setDisplayError({display: true, text: `Invalid location. ${tryAgainText}`});
        }
    }
    
    const locationSelected = () => {
        setFieldValue(fieldName, searchResults.placeId);
        setLocationToSearch(searchResults.location);
        setOpenLocationSearch(false);
        setSearchResults(null);
    }
    
    return <>
        <View>
            <TextInput
                style={{...styles.textInput, textAlign: 'auto'}}
                mode='outlined'
                label='Location'
                outlineColor='rgb(190, 190, 190)'
                placeholder='Location'
                placeholderTextColor='rgb(190, 190, 190)'
                required={true}
                autoCapitalize='words'
                spellCheck={false}
                onPressIn={() => setOpenLocationSearch(true)}
                onChangeText={setLocationToSearch}
                onBlur={handleBlur(fieldName)}
                multiline={false}
                value={locationToSearch}
            />
            {openLocationSearch && (searchResults?.location
                ? <TouchableOpacity onPress={locationSelected} style={styles.locationSearched}>
                    <Text variant="titleMedium">Tap if correct</Text>
                    <LocationText
                        location={searchResults?.location}
                        options={{
                            streetAddress: true,
                            cityState: true,
                            zip: true
                        }}
                    />
                </TouchableOpacity>
                : <Button style={styles.button} onPress={searchForLocation} mode="outlined">Search</Button>)
            }
        </View>
        {displayError.display && <ErrorMessage text={displayError.text} />}
    </>
}
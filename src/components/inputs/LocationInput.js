import axios from 'axios';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { TextInput, Card, Button } from 'react-native-paper';

import { REACT_APP_GEO_CODE } from '@env';

import LocationText from '../LocationText';

import ErrorMessage from '../helpers/ErrorMessage';
import { formatLocation } from '../helpers/locationFormatter';
import { compAddress } from '../../service/compAddress';

import { styles } from '../../styles/main-styles';

const tryAgainText = 'If it looks correct, try being more precise.';

export default function LocationInput({ fieldName, setFieldValue, handleBlur }) {
    const [locationToSearch, setLocationToSearch] = useState('');
    const [openLocationSearch, setOpenLocationSearch] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [displayError, setDisplayError] = useState({display: false, text: ''});
    
    const searchForLocation = async () => {
        try {
            const { data: { results } } = await axios({
                method: 'GET',
                url: `https://maps.googleapis.com/maps/api/geocode/json?address=${locationToSearch}&key=${REACT_APP_GEO_CODE}`
            });
            
            
            if(results.length) {
                setSearchResults(results);
            }
        } catch(err) {
            setDisplayError({display: true, text: `Invalid location. ${tryAgainText}`});
        }
    }
    
    const locationSelected = (location, placeId) => {
        setFieldValue(fieldName, placeId);
        setLocationToSearch(formatLocation(location, {
            streetAddress: true,
            cityState: true,
            zip: true
        }));
        setOpenLocationSearch(false);
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
            {openLocationSearch &&
                <>
                    <Button style={styles.button} onPress={searchForLocation} mode="outlined">Search</Button>
                    <ScrollView>
                        {searchResults.map((result, index) => {
                            const location = compAddress(result.address_components);
                            return (
                                <Card style={styles.locationCard} onPress={() => locationSelected(location, result.place_id)} key={index}>
                                    <Card.Title title={<LocationText
                                        location={location}
                                        options={{
                                            streetAddress: true,
                                            cityState: true
                                        }}/>
                                    }/>
                                </Card>
                            )
                        })}
                    </ScrollView>
                </>
            }
        </View>
        {displayError.display && <ErrorMessage text={displayError.text} />}
    </>
}
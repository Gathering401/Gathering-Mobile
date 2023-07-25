import { useState, useMemo } from 'react';
import { Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import LoggedInHome from '../components/LoggedInHome';
import SignInOptions from '../components/SignInOptions';

import { styles } from '../styles/main-styles';

export default function HomeScreen({navigation}) {
    let [token, setToken] = useState(null);
    let [submitted, setSubmitted] = useState(false);
    
    useMemo(() => {
        async function getToken() {
            const authToken = await SecureStore.getItemAsync('token');

            setToken(authToken);
        }

        getToken();
    }, [submitted]);
    
    return (
        <View style={{...styles.container, ...styles.containerColor}}>
            {
                token ? <LoggedInHome navigation={navigation}/> : <SignInOptions navigation={navigation} setSubmitted={setSubmitted}/>
            }
        </View>
    )
}
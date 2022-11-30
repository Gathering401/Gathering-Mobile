import React, { useState, useEffect, useContext } from 'react';

import { Text, View, Button } from 'react-native';
// import * as SecureStore from 'expo-secure-store';

import LoggedInHome from '../components/LoggedInHome';
import SignInOptions from '../components/SignInOptions';

import { styles } from '../styles/main-styles';

export default function HomeScreen({navigation, token}) {
    let [loggedIn, setLoggedIn] = useState(null);

    useEffect(() => {
        const getToken = async () => {
            // const token = await SecureStore.getItemAsync('token');

            setLoggedIn(token);
        }
        
        getToken();
    }, [token]);
    
    return (
        <View style={{...styles.container, ...styles.containerColor}}>
            <Text style={styles.title}>Hello, world!</Text>
            {
                loggedIn ? <LoggedInHome navigation={navigation}/> : <SignInOptions navigation={navigation}/>
            }
        </View>
    )
}
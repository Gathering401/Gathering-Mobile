import React, { useState, useEffect, useContext } from 'react';

import { Text, View, Button } from 'react-native';
// import * as SecureStore from 'expo-secure-store';
import { TokenContext } from '../tempContext/token-context'; // context is only temporary for testing in web

import { styles } from '../styles/main-styles';

export default function HomeScreen({navigation, token}) {
    let [loggedIn, setLoggedIn] = useState(null);
    // const { token, setToken } = useContext(TokenContext);

    useEffect(() => {
        const getToken = async () => {
            // const token = await SecureStore.getItemAsync('token');

            setLoggedIn(token);
        }
        
        getToken();
    }, [token]);
    
    return (
        <View style={{...styles.container, ...styles.containerColor}}>
            <Text>Welcome to the home page!</Text>
            {
                loggedIn ?
                <View>
                    <Button
                        title="Calendar Page"
                        onPress={() => navigation.navigate('Calendar')}
                    />
                </View> :
                <View>
                    <Button
                        title="Log In"
                        onPress={() => navigation.navigate('Login')}
                    />
                    <Button
                        title="Sign Up"
                        onPress={() => navigation.navigate('SignUp')}
                    />
                </View>
            }
        </View>
    )
}
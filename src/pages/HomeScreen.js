import { useState, useEffect } from 'react';
import { View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useIsFocused } from '@react-navigation/native';

import LoggedInHome from '../components/LoggedInHome';
import SignInOptions from '../components/SignInOptions';

import { authenticateUser } from '../service/authenticateUser';

import { styles } from '../styles/main-styles';

export default function HomeScreen({navigation}) {
    let [token, setToken] = useState(null);
    const isFocused = useIsFocused();
    
    useEffect(() => {
        async function getToken() {
            const authToken = await SecureStore.getItemAsync('token');
            
            setToken(authToken);
        }

        getToken();
    }, [isFocused]);
    console.log('token', token);

    const authenticated = authenticateUser(token);
    console.log('authenticated', authenticated);
    
    return (
        <View style={styles.container}>
            {
                authenticated ? <LoggedInHome navigation={navigation}/> : <SignInOptions navigation={navigation}/>
            }
        </View>
    )
}
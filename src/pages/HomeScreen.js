import { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useIsFocused } from '@react-navigation/native';

import LoggedInHome from '../components/LoggedInHome';
import SignInOptions from '../components/SignInOptions';

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
    
    return (
        <View style={styles.container}>
            {
                token ? <LoggedInHome navigation={navigation}/> : <SignInOptions navigation={navigation}/>
            }
        </View>
    )
}
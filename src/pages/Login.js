import React, { useState, useRef } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { View, TextInput } from 'react-native';

import { styles } from '../styles/main-styles';

const baseUrl = 'http://localhost:5000/api';

export default function Login({navigation, route}) {
    let [username, setUsername] = useState(route.params.desiredUsername);
    let [password, setPassword] = useState('');
    
    const passwordRef = useRef();

    const submitLogin = async () => {
        const response = await axios({
            method: 'POST',
            url: `${baseUrl}/User/Login`,
            data: {
                username,
                password
            }
        });

        if(response) {
            await SecureStore.setItemAsync('token', response.body.token);
            
            navigation.navigate('Home');
        }
    }
    
    return (
        <View style={styles.container}>
            <TextInput
                required={true}
                style={styles.textInput}
                onChangeText={text => setUsername(text)}
                placeholder="Username"
                autoCapitalize={false}
                returnKeyType="next"
                onSubmitEditing={() => { passwordRef.current.focus(); }}
                blurOnSubmit={false}
            />
            <TextInput
                required={true}
                style={styles.textInput}
                onChangeText={text => setPassword(text)}
                placeholder="Password"
                autoCapitalize={false}
                secureTextEntry={true}
                returnKeyType="submit"
                onSubmitEditing={submitLogin}
                blurOnSubmit={false}
            />
        </View>
    )
}
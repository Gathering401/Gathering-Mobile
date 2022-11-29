import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
// import * as SecureStore from 'expo-secure-store';
import { TouchableWithoutFeedback, TextInput, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';

import { TokenContext } from '../tempContext/token-context';

import { styles } from '../styles/main-styles';

const baseUrl = 'http://localhost:5000/api';

export default function Login({navigation, route}) {
    const { token, setToken } = useContext(TokenContext);
    
    let [username, setUsername] = useState(route.params?.desiredUsername);
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
            // await SecureStore.setItemAsync('token', response.body.token);
            setToken(response.data.token);
            
            navigation.navigate('Home');
        }
    }
    
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <TextInput
                    required={true}
                    style={styles.textInput}
                    onChangeText={text => setUsername(text)}
                    placeholder="Username"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onSubmitEditing={() => { passwordRef.current.focus(); }}
                    blurOnSubmit={false}
                />
                <TextInput
                    required={true}
                    style={styles.textInput}
                    onChangeText={text => setPassword(text)}
                    placeholder="Password"
                    autoCapitalize="none"
                    secureTextEntry={true}
                    returnKeyType="submit"
                    onSubmitEditing={submitLogin}
                    blurOnSubmit={false}
                />
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}
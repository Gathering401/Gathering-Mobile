import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
// import * as SecureStore from 'expo-secure-store';
import { TouchableWithoutFeedback, TextInput, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';

import { TokenContext } from '../tempContext/token-context';

import { styles } from '../styles/main-styles';
import CustomFormik from '../components/CustomFormik';

const baseUrl = 'http://localhost:4000/graphql';

export default function Login({ navigation }) {
    const { setToken } = useContext(TokenContext);

    const submitLogin = async (values) => {
        const query = `mutation Login($loginData: LoginDataInput!) {
            login(loginData: $loginData) {
                id
                username
                token
            }
        }`;
        const variables = {
            loginData: {
                username: values.username,
                password: values.password
            }
        };
        
        const { data } = await axios({
            method: 'POST',
            url: baseUrl,
            data: {
                query,
                variables
            }
        });

        console.log('did we get logged in?', data);

        if(data) {
            // await SecureStore.setItemAsync('token', response.body.token);
            setToken(data.data.login.token);
            
            navigation.navigate('Home');
        }
    }
    
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <CustomFormik steps={[
                    [
                        { label: 'Username', type: 'text', initial: '', placeholder: 'jane.doe', fieldName: 'username'},
                        { label: 'Password', type: 'password', initial: '', placeholder: 'password', fieldName: 'password'}
                    ]
                ]}
                formSubmit={submitLogin}
                />
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}
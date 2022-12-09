import React, { useContext } from 'react';
import axios from 'axios';
// import * as SecureStore from 'expo-secure-store';
import { TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';

import { UserContext } from '../tempContext/user-context';

import { styles } from '../styles/main-styles';
import CustomFormik from '../components/CustomFormik';

const baseUrl = 'http://localhost:5000/api';

export default function Login({ navigation }) {
    const { setToken, preferences, setPreferences } = useContext(UserContext);

    const submitLogin = async (values) => {
        const response = await axios({
            method: 'POST',
            url: `${baseUrl}/User/Login`,
            data: {
                username: values.username,
                password: values.password
            }
        });

        if(response) {
            // await SecureStore.setItemAsync('token', response.body.token);
            setToken(response.data.token);
            setPreferences({...preferences, daysOut: response.data.upcomingDaysOut});
            
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
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';

import { styles } from '../styles/main-styles';
import CustomFormik from '../components/CustomFormik';

import { REACT_APP_API_URL } from '@env';

export default function Login({ navigation, setSubmitted }) {
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
            url: `${REACT_APP_API_URL}/graphql`,
            data: {
                query,
                variables
            }
        });

        if(data) {
            setSubmitted(true);
            await SecureStore.setItemAsync('token', data.data.login.token);
            
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
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';

import { styles } from '../styles/main-styles';
import CustomFormik from '../components/CustomFormik';

const baseUrl = 'https://1df0-2604-2d80-d288-4100-1c44-c92b-5b26-5132.ngrok-free.app/graphql';

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
            url: baseUrl,
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
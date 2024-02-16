import { gql, useMutation } from '@apollo/client';
import { View, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Platform, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import Loader from '../components/helpers/Loader';

import CustomFormik from '../components/CustomFormik';

import { styles } from '../styles/main-styles';

export default function Login({ navigation }) {
    const LOGIN_MUTATION = gql`mutation LogIn($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            token
            username
            firstName
        }
    }`;

    const [submitLogin, { errors, loading } ] = useMutation(LOGIN_MUTATION);
    
    if(errors) {
        console.log('Error', errors);
        return null;
    }
    
    if(loading) {
        return <Loader />
    }
    
    return (
        <CustomFormik steps={[
            [
                { label: 'Username', type: 'text', initial: '', placeholder: 'jane.doe', fieldName: 'username'},
                { label: 'Password', type: 'password', initial: '', placeholder: 'password', fieldName: 'password'}
            ]
        ]}
        formSubmit={(values) => {
            submitLogin({
                variables: values,
                onCompleted: async ({ login }) => {
                    console.log(login);
                    await SecureStore.setItemAsync('token', login.token);

                    navigation.navigate('Home');
                },
                onError: (error) => {
                    console.log('Error: ', JSON.stringify(error, null, 2));
                }
            });
        }}
        />
    )
}
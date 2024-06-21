import { useState } from 'react';
import { useMutation } from '@apollo/client';
import * as SecureStore from 'expo-secure-store';

import Loader from '../components/helpers/Loader';

import { TouchableWithoutFeedback, Keyboard, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import CustomFormik from '../components/CustomFormik';
import { styles } from '../styles/main-styles';

import _ from 'lodash';
import { SIGNUP_MUTATION } from '../models/Queries';
import { logError } from '../components/helpers/logError';

export default function SignUp({ navigation }) {
    let [date, setDate] = useState(new Date());

    const [submitRegistration, { errors, loading } ] = useMutation(SIGNUP_MUTATION);
    
    if(errors) {
        logError(errors);
        return null;
    }
    
    if(loading) {
        return <Loader />
    }
    
    return (
        <CustomFormik steps={[
                [
                    { label: 'First Name', type: 'name', initial: '', placeholder: 'Jane', fieldName: 'firstName' },
                    { label: 'Last Name', type: 'name', initial: '', placeholder: 'Doe', fieldName: 'lastName' },
                    { label: 'Username', type: 'text', initial: '', placeholder: 'jane.doe', fieldName: 'username' },
                    { label: 'Password', type: 'password', initial: '', placeholder: '8 chars, 1 number, 1 capital, and 1 symbol', fieldName: 'password' },
                    { label: 'Confirm Password', type: 'password', initial: '', placeholder: 'Confirm password', fieldName: 'confirmPassword' }
                ],
                [
                    { label: 'Email', type: 'email', initial: '', fieldName: 'email' },
                    { label: 'Phone Number', type: 'phone', initial: '', fieldName: 'phone' },
                    { label: 'Birth Date', type: 'date', initial: date, fieldName: 'birthDate', date, setDate }
                ]
            ]}
            formSubmit={(values) => {
                submitRegistration({
                    variables: {
                        userData: {
                            ..._.omit(values, ['confirmPassword']),
                            phone: Number(values.phone.replace(/[^0-9.]/g, '')),
                            timezone: 'America/Chicago'
                        }
                    },
                    onCompleted: async ({ register }) => {
                        await SecureStore.setItemAsync('token', register.token);
                        navigation.navigate('Home');
                    },
                    onError: (error) => {
                        logError(error);
                    }
                });
            }}
        />
    )
}
import { useMutation } from '@apollo/client';
import * as SecureStore from 'expo-secure-store';

import Loader from '../components/helpers/Loader';

import CustomFormik from '../components/CustomFormik';
import { LOGIN_MUTATION } from '../models/Queries';

export default function Login({ navigation }) {
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
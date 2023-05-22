import React, { useState, useRef } from 'react';
import axios from 'axios';

import { TouchableWithoutFeedback, Keyboard, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import CustomFormik from '../components/CustomFormik';
import moment from 'moment';
import { styles } from '../styles/main-styles';

const baseUrl = 'http://localhost:4000/graphql';

export default function SignUp({ navigation }) {
    let [date, setDate] = useState(new Date());

    const postNewUser = async (values) => {
        try {
            const response = await axios({
                method: 'POST',
                url: `${baseUrl}/User/Register`,
                data: {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    username: values.username,
                    password: values.password,
                    email: values.email,
                    phoneNumber: values.phone,
                    birthDate: moment(date).toISOString()
                },
                headers: {
                    'content-type': 'application/json'
                }
            });

            if(response) {
                navigation.navigate('Login', {
                    desiredUsername: values.username
                });
            }
        } catch(err) {
            console.log('Error', err);
        }
    }
    
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <ScrollView
                    automaticallyAdjustKeyboardInsets={true}
                    centerContent={true}
                    snapToInterval={true}
                >
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
                        formSubmit={postNewUser}
                    />
                    
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}
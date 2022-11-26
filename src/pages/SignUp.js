import React, { useState, useRef } from 'react';
import axios from 'axios';

import { TextInput, TouchableWithoutFeedback, Keyboard, ScrollView, KeyboardAvoidingView, TouchableOpacity, Text, View } from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import { Formik } from 'formik';
import moment from 'moment';
import { styles } from '../styles/main-styles';

const baseUrl = 'http://localhost:5000/api';

export default function SignUp({navigation, desiredUsername}) {
    const lastNameRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const phoneRef = useRef();

    let [start, setStart] = useState(true);
    let [open, setOpen] = useState(false);
    let [date, setDate] = useState(new Date());
    let [hitNext, setHitNext] = useState(false);

    const postNewUser = async (values) => {
        console.log('did i get here')
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
                birthDate: moment(values.birthDate).toISOString()
            }
        });

        console.log('cheese whiz', response);
        if(response) {
            navigation.navigate('Login', {
                desiredUsername: values.username
            });
        }
    } catch(err) {
        console.log('err', JSON.stringify(err))
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
                    <Formik
                        initialValues={{
                            firstName: '',
                            lastName: '',
                            username: desiredUsername || '',
                            password: '',
                            confirmPassword: '',
                            email: '',
                            phone: '',
                            birthDate: date
                        }}
                        onSubmit={values => console.log(values)}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            start ? <View>
                                <TextInput
                                    required={true}
                                    style={styles.textInput}
                                    onChangeText={handleChange('firstName')}
                                    placeholder="First Name"
                                    onBlur={handleBlur('firstName')}
                                    autoCapitalize={true}
                                    returnKeyType="next"
                                    onSubmitEditing={() => { lastNameRef.current.focus(); }}
                                    value={values.firstName}
                                />
                                {hitNext && !values.firstName && <Text style={styles.emptyRequired}>*First name field is required</Text>}
                                <TextInput
                                    required={true}
                                    style={styles.textInput}
                                    onChangeText={handleChange('lastName')}
                                    placeholder="Last Name"
                                    onBlur={handleBlur('lastName')}
                                    autoCapitalize={true}
                                    returnKeyType="next"
                                    ref={lastNameRef}
                                    onSubmitEditing={() => { usernameRef.current.focus(); }}
                                    value={values.lastName}
                                />
                                {hitNext && !values.lastName && <Text style={styles.emptyRequired}>*Last name field is required</Text>}
                                <TextInput
                                    required={true}
                                    style={styles.textInput}
                                    onChangeText={handleChange('username')}
                                    placeholder="Username"
                                    onBlur={handleBlur('username')}
                                    autoCapitalize={false}
                                    returnKeyType="next"
                                    ref={usernameRef}
                                    onSubmitEditing={() => { passwordRef.current.focus(); }}
                                    value={values.username}
                                />
                                {hitNext && !values.username && <Text style={styles.emptyRequired}>*Username field is required</Text>}
                                <TextInput
                                    required={true}
                                    style={styles.textInput}
                                    onChangeText={handleChange('password')}
                                    placeholder="Password"
                                    onBlur={handleBlur('password')}
                                    secureTextEntry={true}
                                    returnKeyType="next"
                                    ref={passwordRef}
                                    onSubmitEditing={() => { confirmPasswordRef.current.focus(); }}
                                    value={values.password}
                                />
                                {hitNext && !values.password && <Text style={styles.emptyRequired}>*Password field is required</Text>}
                                <TextInput
                                    required={true}
                                    style={styles.textInput}
                                    onChangeText={handleChange('confirmPassword')}
                                    placeholder="Confirm Password"
                                    onBlur={handleBlur('confirmPassword')}
                                    secureTextEntry={true}
                                    returnKeyType="next"
                                    ref={confirmPasswordRef}
                                    value={values.confirmPassword}
                                />
                                {hitNext && !values.confirmPassword && <Text style={styles.emptyRequired}>*Confirm password field is required</Text>}
                                {hitNext && values.confirmPassword && values.password !== values.confirmPassword && <Text style={styles.emptyRequired}>*Password fields do not match</Text>}
                                <TouchableOpacity style={styles.submitButton} onPress={() => {
                                    setHitNext(true);
                                    if(values.firstName && values.lastName && values.username && values.password
                                        && values.confirmPassword && values.password === values.confirmPassword) {
                                        setStart(false);
                                    }
                                }}
                                >
                                    <Text style={styles.submitButtonText}>Next</Text>
                                </TouchableOpacity>
                            </View> :
                            <View>
                                <TextInput
                                    required={true}
                                    style={styles.textInput}
                                    onChangeText={handleChange('email')}
                                    placeholder="Email"
                                    onBlur={handleBlur('email')}
                                    autoCapitalize={false}
                                    onSubmitEditing={() => { phoneRef.current.focus(); }}
                                    value={values.email}
                                />
                                <TextInput
                                    required={true}
                                    style={styles.textInput}
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                    // look at disability claim forms to know how to make this a bit more fancy
                                    onChangeText={handleChange('phone')}
                                    placeholder="555-555-5555"
                                    onBlur={handleBlur('phone')}
                                    ref={phoneRef}
                                    blurOnSubmit={false}
                                />
                                <TouchableOpacity onPress={() => setOpen(!open)} style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>Birth Date: {moment(date).format('MM/DD/YYYY')}</Text>
                                </TouchableOpacity>
                                <View style={{...open ? {} : styles.hidden}}>
                                    <DatePicker
                                        options={{
                                            backgroundColor: '#090C08',
                                            textHeaderColor: '#FFA25B',
                                            textDefaultColor: '#F6E7C1',
                                            selectedTextColor: '#fff',
                                            mainColor: '#F4722B',
                                            textSecondaryColor: '#D6C7A1',
                                            borderColor: 'rgba(122, 146, 165, 0.1)',
                                        }}
                                        mode='calendar'
                                        date={date}
                                        onSelectedChange={(newDate) => setDate(moment(newDate).toISOString())}
                                    />
                                </View>
                                <TouchableOpacity style={styles.submitButton} onPress={() => {
                                    handleSubmit();
                                    postNewUser(values);
                                }}
                                >
                                    <Text style={styles.submitButtonText}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}
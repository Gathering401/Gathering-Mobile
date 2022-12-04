import axios from 'axios';

import React, { useState, useRef, useContext } from 'react';
import { Button, TextInput, Modal, View, TouchableOpacity, Text } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Formik } from 'formik';
import DatePicker from 'react-native-modern-datepicker';
import moment from 'moment';

import { styles } from '../styles/main-styles';

import { TokenContext } from '../tempContext/token-context';

const baseUrl = 'http://localhost:5000/api';

export default function EventCreate({ close }) {
    const { token } = useContext(TokenContext);

    let [open, setOpen] = useState(false);
    let [foodCheck, setFoodCheck] = useState('no');
    let [date, setDate] = useState(new Date());

    const descriptionRef = useRef();
    const locationRef = useRef();

    const postEvent = async (values) => {
        const response = await axios({
            method: 'POST',
            url: `${baseUrl}/Event`,
            data: {
                eventRepeat: {
                    eRepeat: values.eRepeat
                },
                event: {
                    eventName: values.eventName,
                    description: values.description,
                    location: values.location,
                    start: values.start,
                    food: values.food
                }
            },
            headers: {
                authorization: `Bearer ${token}`,
                'content-type': 'application/json'
            }
        })
        console.log(response);

        if(response?.data) {
            close(false);
        }
    }
    
    return (
        <Formik
            initialValues={{
                groupId: null,
                eRepeat: 3,
                start: moment(date).toISOString(),
                food: foodCheck === 'yes',
                cost: 0,
                description: '',
                eventName: '',
                location: ''
            }}
            onSubmit={values => postEvent(values)}
        >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
            <Modal>
                <TextInput
                    required={true}
                    style={styles.textInput}
                    onChangeText={handleChange('eventName')}
                    placeholder="Event Name"
                    onBlur={handleBlur('eventName')}
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={() => { descriptionRef.current.focus(); }}
                    value={values.firstName}
                    spellCheck={false}
                />
                <TextInput
                    required={true}
                    style={styles.textInput}
                    onChangeText={handleChange('description')}
                    placeholder="Description"
                    onBlur={handleBlur('description')}
                    autoCapitalize="sentences"
                    returnKeyType="next"
                    ref={descriptionRef}
                    onSubmitEditing={() => { locationRef.current.focus(); }}
                    value={values.description}
                    spellCheck={true}
                />
                <TextInput
                    required={true}
                    style={styles.textInput}
                    onChangeText={handleChange('location')}
                    placeholder="Location"
                    onBlur={handleBlur('location')}
                    autoCapitalize="words"
                    returnKeyType="submit"
                    ref={locationRef}
                    value={values.location}
                    spellCheck={false}
                />
                <TouchableOpacity onPress={() => setOpen(!open)} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Event Date: {moment(date).format('MM/DD/YYYY')}</Text>
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
                <View>
                    <Text style={styles.radioLabel}>Will there be food?</Text>
                    <RadioButton
                        value="no"
                        status={ foodCheck === 'no' ? 'checked' : 'unchecked'}
                        onPress={() => setFoodCheck('no')}
                    /><Text>No</Text>
                    <RadioButton
                        value="yes"
                        status={ foodCheck === 'yes' ? 'checked' : 'unchecked'}
                        onPress={() => setFoodCheck('yes')}
                    /><Text>Yes</Text>
                </View>
                <Button onPress={handleSubmit} title="Submit"/>
            </Modal>
        )}
        </Formik>
    )
};

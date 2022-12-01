import axios from 'axios';

import React, { useState, useRef, useContext } from 'react';
import { Button, TextInput, Modal } from 'react-native';
import { Formik } from 'formik';

import { styles } from '../styles/main-styles';

import GroupTierSelector from './GroupTierSelector';

import { TokenContext } from '../tempContext/token-context';

const baseUrl = 'http://localhost:5000/api';

export default function GroupCreate({ close }) {
    const { token } = useContext(TokenContext);
    
    let [selectedTier, setSelectedTier] = useState(null);

    const descriptionRef = useRef();
    const locationRef = useRef();

    const postGroup = async (values) => {
        const response = await axios({
            method: 'POST',
            url: `${baseUrl}/Group`,
            data: {
                groupName: values.groupName,
                location: values.location,
                description: values.description,
                groupSize: values.groupSize
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
    
    if(selectedTier === null) {
        return <GroupTierSelector setSelectedTier={setSelectedTier} />
    } else {
        return (
            <Formik
                initialValues={{
                    groupName: '',
                    description: '',
                    location: '',
                    groupSize: selectedTier
                }}
                onSubmit={values => postGroup(values)}
            >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
                <Modal>
                    <TextInput
                        required={true}
                        style={styles.textInput}
                        onChangeText={handleChange('groupName')}
                        placeholder="Group Name"
                        onBlur={handleBlur('groupName')}
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
                    <Button onPress={handleSubmit} title="Submit"/>
                </Modal>
            )}
            </Formik>
        )
    }
};

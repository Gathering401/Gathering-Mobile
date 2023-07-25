import axios from 'axios';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import CustomFormik from './CustomFormik';

const baseUrl = 'https://1df0-2604-2d80-d288-4100-1c44-c92b-5b26-5132.ngrok-free.app/graphql';

export default function GroupCreate({ close }) {    
    let [selectedCard, setSelectedCard] = useState(null);

    const postGroup = async (values) => {
        const token = await SecureStore.getItemAsync('token');
        const response = await axios({
            method: 'POST',
            url: `${baseUrl}/Group`,
            data: {
                groupName: values.groupName,
                location: values.location,
                description: values.description,
                groupSize: selectedCard.value
            },
            headers: {
                authorization: `Bearer ${token}`,
                'content-type': 'application/json'
            }
        })

        if(response?.data) {
            close(false);
        }
    }

    return (
        <CustomFormik
            steps={[[
                { label: 'Group Name', type: 'name', initial: '', placeholder: 'ISU Basketball Team', fieldName: 'groupName' },
                { label: 'Description', type: 'paragraph', initial: '', placeholder: 'A place to schedule all basketball games for Iowa State University', fieldName: 'description' },
                { label: 'Location', type: 'name', initial: '', placeholder: 'Ames, IA', fieldName: 'location' },
                { label: 'Group Tier', type: 'cards', fieldName: 'groupSize', initial: selectedCard, selectedCard, setSelectedCard, cards: [
                    { title: 'Free', value: 0, body: [
                        'Max Members: 50',
                        'Max Events per Month: 100'
                    ], footer: '$0 w/promotions' },
                    { title: 'Business', value: 1, body: [
                        'Max Members: 500',
                        'Max Events per Month: 2500'
                    ], footer: '$50' },
                    { title: 'Enterprise', value: 2, body: [
                        'Unlimited Members',
                        'Unlimited Events'
                    ], footer: '$500' }
                ] }
            ]]}
            formSubmit={postGroup}
        />
    )
};

import axios from 'axios';
import React, { useState, useContext } from 'react';

import { UserContext } from '../tempContext/user-context';
import CustomFormik from './CustomFormik';

const baseUrl = 'http://localhost:5000/api';

export default function GroupCreate({ close }) {
    const { token } = useContext(UserContext);
    
    let [selectedCard, setSelectedCard] = useState(null);

    const postGroup = async (values) => {
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

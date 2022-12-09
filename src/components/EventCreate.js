import axios from 'axios';

import React, { useState, useRef, useContext } from 'react';

import CustomFormik from './CustomFormik';

import { UserContext } from '../tempContext/user-context';

const baseUrl = 'http://localhost:5000/api';

export default function EventCreate({ close }) {
    const { token } = useContext(UserContext);

    let [date, setDate] = useState(new Date());
    let [checked, setChecked] = useState('No');
    let [selected, setSelected] = useState(3);
    let [options, setOptions] = useState([
        { label: 'Weekly', value: 0 },
        { label: 'Monthly', value: 1 },
        { label: 'Annual', value: 2 },
        { label: 'Only Once', value: 3 }
    ]);

    const postEvent = async (values) => {
        const response = await axios({
            method: 'POST',
            url: `${baseUrl}/Group/${values.groupId}/Event`,
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
        <CustomFormik
            steps={[
                [
                    { label: 'Event Name', type: 'name', initial: '', placeholder: 'Jane\'s Birthday', fieldName: 'eventName' },
                    { label: 'Description', type: 'paragraph', initial: '', placeholder: 'Getting together to celebrate Jane\'s 45th!', fieldName: 'description' },
                    { label: 'Location', type: 'name', initial: '', placeholder: 'Jane\'s House', fieldName: 'location' },
                    { label: 'Event Date', type: 'date', initial: date, fieldName: 'start', date, setDate }
                ],
                [
                    { label: 'Will it cost anything?', type: 'price', initial: 0, fieldName: 'cost' },
                    { label: 'Will there be food?', type: 'radio', fieldName: 'food', initial: checked, options: ['Yes', 'No'], checked, setChecked },
                    { label: 'How often?', type: 'dropdown', initial: selected, fieldName: 'eRepeat', options, setOptions, selected, setSelected }
                ]
            ]}
            formSubmit={postEvent}
        />
    )
};

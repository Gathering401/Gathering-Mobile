import axios from 'axios';
import moment from 'moment-timezone';

import React, { useState, useContext } from 'react';

import CustomFormik from './CustomFormik';

import { TokenContext } from '../tempContext/token-context';

const baseUrl = 'http://localhost:5000/api';

export default function EventCreate({ close }) {
    const { token } = useContext(TokenContext);

    let [date, setDate] = useState(new Date());
    let [repeat, setRepeat] = useState('never');
    let [checked, setChecked] = useState('No');
    let [selected, setSelected] = useState(3);
    let [moreInformation, setMoreInformation] = useState(false);
    let [options, setOptions] = useState([
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Annual', value: 'annually' },
        { label: 'Only Once', value: 'never' }
    ]);

    const postEvent = async (values) => {
        const query = `mutation CreateEvent($groupId: Int!, $eventData: EventDataInput!, $locationData: LocationDataInput!) {
            createEvent(groupId: $groupId, eventData: $eventData, locationData: $locationData) {
                eventName
                eventDate
                description
                location {
                    streetAddress
                    city
                    state
                    zip
                    country
                    locationName
                }
            }
        }`;
        const variables = {
            groupId,
            eventData: {
                eventName: values.eventName,
                food: values.food,
                price: values.price,
                description: values.description,
                eventRepeat: values.eRepeat,
                eventDate: moment(values.eventDate).format('MM/DD/YYYY H:mma')
            },
            locationData: {
                streetAddress: values.streetAddress,
                city: values.city,
                state: values.state,
                zip: values.zip,
                country: values.country,
                locationName: values.locationName,
                latitude: 42,
                longitude: -91.569090,
                locationType: "business"
            }
        };
        
        const response = await axios({
            method: 'POST',
            url: baseUrl,
            data: {
                query,
                variables,
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

        if(response?.data) {
            close(false);
        }
    }
    
    return (
        <CustomFormik
            steps={[
                [
                    { label: 'Event Name', type: 'name', initial: '', placeholder: 'Event Name', fieldName: 'eventName', required: true },
                    { label: 'Description', type: 'paragraph', initial: '', placeholder: 'Description of your event', fieldName: 'description' },
                    { label: 'Event Date', type: 'date', initial: date, fieldName: 'start', date, setDate, repeat, setRepeat, required: true },
                    { label: 'Location', type: 'location', initial: '', fieldName: 'location', placeholder: 'Location', required: true },

                    ...(moreInformation ? [
                        { label: 'Will it cost anything?', type: 'price', initial: 0, fieldName: 'price' },
                        { label: 'Will there be food?', type: 'radio', fieldName: 'food', initial: checked, options: ['Yes', 'No'], checked, setChecked }
                    ] : [])
                ]
            ]}
            moreInformation={moreInformation}
            setMoreInformation={setMoreInformation}
            formSubmit={postEvent}
        />
    )
};

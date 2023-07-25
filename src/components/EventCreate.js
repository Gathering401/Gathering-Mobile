import axios from 'axios';

import moment from 'moment-timezone';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import CustomFormik from './CustomFormik';

const baseUrl = 'https://1df0-2604-2d80-d288-4100-1c44-c92b-5b26-5132.ngrok-free.app/graphql';

export default function EventCreate({ close }) {
    let [checked, setChecked] = useState('No');
    let [moreInformation, setMoreInformation] = useState(false);

    const postEvent = async (values) => {
        const query = `mutation CreateEvent($groupId: Int!, $eventData: EventDataInput!) {
            createEvent(groupId: $groupId, eventData: $eventData) {
                eventName
                eventDate
                description
                location
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
                eventDate: moment(values.eventDate).format('MM/DD/YYYY H:mma'),
                location: values.location
            }
        };
        
        const token = await SecureStore.getItemAsync('token');
        // const response = await axios({
        //     method: 'POST',
        //     url: baseUrl,
        //     data: {
        //         query,
        //         variables,
        //         eventRepeat: {
        //             eRepeat: values.eRepeat
        //         },
        //         event: {
        //             eventName: values.eventName,
        //             description: values.description,
        //             location: values.location,
        //             start: values.start,
        //             food: values.food
        //         }
        //     },
        //     headers: {
        //         authorization: `Bearer ${token}`,
        //         'content-type': 'application/json'
        //     }
        // })

        // if(response?.data) {
        //     close(false);
        // }
    }
    
    return (
        <CustomFormik
            steps={[
                [
                    { label: 'Event Name', type: 'name', initial: '', placeholder: 'Event Name', fieldName: 'eventName', required: true },
                    { label: 'Description', type: 'paragraph', initial: '', placeholder: 'Description of your event', fieldName: 'description' },
                    { label: 'Event Date', type: 'date', initial: new Date(), fieldName: 'eventDate', required: true },
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

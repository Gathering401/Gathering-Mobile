import moment from 'moment-timezone';
import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import CustomFormik from './CustomFormik';

export default function EventCreate({ navigation }) {
    let [checked, setChecked] = useState('No');
    let [moreInformation, setMoreInformation] = useState(false);

    const CREATE_EVENT_MUTATION = gql`mutation CreateEvent($groupId: Int!, $eventData: EventDataInput!) {
        createEvent(groupId: $groupId, eventData: $eventData) {
            eventName
            eventDate
            description
            location
        }
    }`;

    const [submitEvent, { errors, loading }] = useMutation(CREATE_EVENT_MUTATION);

    if(errors) {
        console.log('Error: ', errors);
        return null;
    }

    if(loading) {
        return <Loader />
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
            formSubmit={(values) => {
                submitEvent({
                    variables: {
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
                    },
                    onCompleted: async () => {
                        navigation.navigate('CalendarTab');
                    },
                    onError: (error) => {
                        console.log('Error: ', error);
                    }
                })
            }}
        />
    )
};

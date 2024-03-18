import moment from 'moment-timezone';
import { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

import CustomFormik from './CustomFormik';
import { DateTime } from 'luxon';

export default function EventCreate({ navigation, route }) {
    const [moreInformation, setMoreInformation] = useState(false);
    const [groupDropdownOptions, setGroupDropdownOptions] = useState([]);
    const repeatDropdownOptions = [
        { label: 'Never', value: 'never' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Annually', value: 'annually' }
    ]

    const CREATE_EVENT_MUTATION = gql`mutation CreateEvent($groupId: Int!, $eventData: EventDataInput!) {
        createEvent(groupId: $groupId, eventData: $eventData) {
            eventName
            eventDate
            description
            location
        }
    }`;

    const [submitEvent, { eventErrors, eventLoading }] = useMutation(CREATE_EVENT_MUTATION);

    const GET_GROUPS_QUERY = gql`query GetGroups {
        groups: getGroups {
            groupName
            groupId
        }
    }`;

    const { groupsErrors, groupsLoading } = useQuery(GET_GROUPS_QUERY, {
        onCompleted: ({ groups }) => {
            setGroupDropdownOptions(groups.map(g => ({
                value: g.groupId,
                label: g.groupName
            })))
        }
    });

    if(eventErrors || groupsErrors) {
        console.log('Error: ', eventErrors);
        console.log('Groups: ', groupsErrors);
        return null;
    }

    if(eventLoading || groupsLoading) {
        return <Loader />
    }
    
    return (
        <CustomFormik
            steps={[
                [
                    { label: 'Event Name', type: 'name', initial: '', placeholder: 'Event Name', fieldName: 'eventName', required: true },
                    { label: 'Description', type: 'paragraph', initial: '', placeholder: 'Description of your event', fieldName: 'description' },
                    { label: 'Event Date', type: 'date', initial: new Date(), fieldName: 'eventDate', required: true },
                    { label: 'Reoccurence', type: 'dropdown', initial: 'never', fieldName: 'eRepeat', multiple: false, options: repeatDropdownOptions, required: true },
                    { label: 'Location', type: 'location', initial: '', fieldName: 'location', placeholder: 'Location', required: true },
                    ...(route?.params?.groupId ? [] : [
                        { label: 'Group', type: 'dropdown', initial: null, fieldName: 'groupId', multiple: false, options: groupDropdownOptions, required: true }
                    ]),

                    ...(moreInformation ? [
                        { label: 'Will it cost anything?', type: 'price', initial: 0, fieldName: 'price' },
                        { label: 'Will there be food?', type: 'checkbox', initial: false, fieldName: 'food' }
                    ] : [])
                ]
            ]}
            moreInformation={moreInformation}
            setMoreInformation={setMoreInformation}
            formSubmit={(values) => {
                console.log('values', values)
                submitEvent({
                    variables: {
                        groupId: route?.params?.groupId ?? values.groupId,
                        eventData: {
                            eventName: values.eventName,
                            food: !!values.food,
                            price: values.price ?? 0,
                            description: values.description,
                            eventRepeat: values.eRepeat,
                            eventDate: values.eventDate,
                            location: values.location
                        }
                    },
                    onCompleted: (response) => {
                        console.log('hello', response)
                        navigation.navigate('CalendarTab', {
                            screen: 'Calendar'
                        });
                    },
                    onError: (error) => {
                        console.log('Error: ', JSON.stringify(error, null, 2));
                    }
                })
            }}
        />
    )
};

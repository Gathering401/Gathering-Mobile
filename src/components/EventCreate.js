import { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

import CustomFormik from './CustomFormik';
import { CREATE_EVENT_MUTATION, GET_GROUPS_QUERY } from '../models/Queries';

export default function EventCreate({ navigation, route }) {
    const [moreInformation, setMoreInformation] = useState(false);
    const [groupDropdownOptions, setGroupDropdownOptions] = useState([]);
    const [repeatOpen, setRepeatOpen] = useState(false);
    const [groupOpen, setGroupOpen] = useState(false);
    const [foodChecked, setFoodChecked] = useState(false);

    const [repeatDropdownOptions, setRepeatDropdownOptions] = useState([
        { label: '', value: null },
        { label: 'Never', value: 'never' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Annually', value: 'annually' }
    ]);

    const [submitEvent, { eventErrors, eventLoading }] = useMutation(CREATE_EVENT_MUTATION);

    const { groupsErrors, groupsLoading } = useQuery(GET_GROUPS_QUERY, {
        onCompleted: ({ groups }) => {
            setGroupDropdownOptions([
                { label: '', value: null },
                ...groups.map(g => ({
                    value: g.groupId,
                    label: g.groupName
                }))
            ])
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
                    { label: 'Repeat', type: 'dropdown', initial: 'never', fieldName: 'repeat', multiple: false, options: repeatDropdownOptions, setOptions: setRepeatDropdownOptions, required: true, open: repeatOpen, setOpen: setRepeatOpen, closeOthers: () => setGroupOpen(false), zIndex: 2000 },
                    { label: 'Location', type: 'location', initial: '', fieldName: 'location', placeholder: 'Location', required: true },
                    { label: 'Group', type: 'dropdown', initial: route?.params?.groupId ?? null, fieldName: 'groupId', multiple: false, options: groupDropdownOptions, setOptions: setGroupDropdownOptions, required: true, open: groupOpen, setOpen: setGroupOpen, closeOthers: () => setRepeatOpen(false), zIndex: 1 },

                    ...(moreInformation ? [
                        { label: 'Will it cost anything?', type: 'price', initial: 0, fieldName: 'price' },
                        { label: 'Will there be food?', type: 'checkbox', initial: foodChecked, checked: foodChecked, setChecked: setFoodChecked, fieldName: 'food' },
                        ...(foodChecked ? [{ label: 'What kinds of food?', type: 'paragraph', initial: '', fieldName: 'foodDescription' }] : [])
                    ] : [])
                ]
            ]}
            moreInformation={moreInformation}
            setMoreInformation={setMoreInformation}
            formSubmit={(values) => {
                submitEvent({
                    variables: {
                        groupId: route?.params?.groupId || values.groupId,
                        eventData: {
                            eventName: values.eventName,
                            food: !!values.food,
                            foodDescription: values.foodDescription,
                            price: values.price ?? 0,
                            description: values.description,
                            eventRepeat: values.repeat,
                            eventDate: values.eventDate,
                            location: values.location,
                        }
                    },
                    onCompleted: (response) => {
                        navigation.navigate('CalendarTab', {
                            screen: 'Event',
                            params: {
                                eventId: response.createEvent.eventId,
                                groupId: response.createEvent.groupId,
                                repeated: response.createEvent.repeat
                            }
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

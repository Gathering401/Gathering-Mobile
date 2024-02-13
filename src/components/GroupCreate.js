import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import CustomFormik from './CustomFormik';

export default function GroupCreate({ close }) {    
    let [selectedCard, setSelectedCard] = useState(null);

    const CREATE_GROUP_MUTATION = gql`mutation CreateGroup($groupData: GroupDataInput!) {
        createGroup(groupData: $groupData) {
            groupId
            groupName
            description
            inviteOnly
            owner {
                username
                firstName
                lastName
            }
            location
        }
    }`;

    const [submitGroup, { errors, loading }] = useMutation(CREATE_GROUP_MUTATION);

    if(errors) {
        console.log('Error: ', errors);
        return null;
    }

    if(loading) {
        return <Loader />
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
            formSubmit={(values) => {
                submitGroup({
                    variables: values,
                    onCompleted: async ({ groupId }) => {
                        navigation.navigate('GroupsTab', {
                            screen: 'Group',
                            params: {
                                groupId
                            }
                        });
                    },
                    onError: (error) => {
                        console.log('Error: ', error);
                    }
                })
            }}
        />
    )
};

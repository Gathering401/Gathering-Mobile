import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import CustomFormik from './CustomFormik';
import Loader from './helpers/Loader';

export default function GroupCreate({ close, navigation }) {    
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
                { label: 'Group Name', type: 'name', initial: '', placeholder: 'Group name', fieldName: 'groupName' },
                { label: 'Description', type: 'paragraph', initial: '', placeholder: 'A group to share events with our people.', fieldName: 'description' },
                { label: 'Location', type: 'name', initial: '', placeholder: 'New York, New York', fieldName: 'location' },
                { label: 'Invite Only?', type: 'checkbox', initial: false, fieldName: 'inviteOnly'}
            ]]}
            formSubmit={(values) => {
                submitGroup({
                    variables: {
                        groupData: values
                    },
                    onCompleted: async ({ groupId }) => {
                        navigation.navigate('GroupsTab', {
                            screen: 'Group',
                            params: {
                                groupId
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

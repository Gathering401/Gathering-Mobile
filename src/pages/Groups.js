import { gql, useQuery } from '@apollo/client';

import { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Card, Icon } from 'react-native-paper';

import { styles } from '../styles/main-styles';

import Loader from '../components/helpers/Loader';

export default function Groups({ navigation }) {
    // let [searchForNew, setSearchForNew] = useState(false);

    const { data, errors, loading } = useQuery(gql`query GetGroups {
        groups: getGroups(includeDetails: true) {
            groupId
            groupName
            description
            location
            groupMembers {
                username
                firstName
                lastName
                role
            }
            owner {
                username
                firstName
                lastName
            }
        }
    }`);

    if(loading) {
        return <Loader />
    }

    if(errors) {
        console.log('Error', errors);
        return null;
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <Button
                mode='outlined'
                style={styles.button}
                onPress={() => navigation.navigate('GroupsTab', {
                    screen: 'Create Group'
                })}>
                <Icon source='plus' color='#042A2B'/>New Group
            </Button>
            <ScrollView style={{width: '100%'}}>
                {
                    data?.groups?.length ?
                    data.groups.map((group) => (
                        <Card
                            onPress={() => {
                                navigation.navigate('GroupsTab', {
                                    screen: 'Group',
                                    params: {
                                        id: group.groupId
                                    }
                                })
                            }}
                            style={styles.bigCard}
                            key={group.groupId}
                        >
                            <Card.Title style={styles.cardTitle} title={group.groupName}/>
                            <Card.Content>
                                <Text variant='bodyMedium'>{group.description}</Text>
                            </Card.Content>
                        </Card>
                    )) :
                    <Text style={styles.cardTitle}>No groups to show</Text>
                }
                <Button
                    onPress={() => {
                        // setSearchForNew(true);
                        getNewSearchGroups();
                    }}
                    mode="outlined"
                    style={styles.button}
                >
                    Find New
                </Button>
            </ScrollView>
        </SafeAreaView>
    )
}
import axios from 'axios';

import { useQuery, gql } from '@apollo/client';
import { useState } from 'react';
import { View } from 'react-native';
import { Button, Icon, Text, ActivityIndicator, Modal, Portal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import Loader from '../components/helpers/Loader';
import LocationText from '../components/LocationText';
import HorizontalScrollWithTouch from '../components/HorizontalScrollWithTouch';
import HeaderMenu from '../components/HeaderMenu';

import { compAddress } from '../service/compAddress';
import { formatLocation } from '../components/helpers/locationFormatter';

import { REACT_APP_GEO_CODE } from '@env';

import { styles } from '../styles/main-styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Group({ route: { params: { id } }, navigation }) {
    const [location, setLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(true);
    const [groupMembersOpen, setGroupMembersOpen] = useState(false);
    
    const { data, errors, loading } = useQuery(gql`query getGroup($groupId: Int!) {
        group: getGroup(groupId: $groupId) {
            groupId
            groupName
            description
            inviteOnly
            groupUsers {
                username
                firstName
                lastName
                role
            }
            joinRequests {
                username
                firstName
                lastName
                status
            }
            owner {
                username
                firstName
                lastName
            }
            location
            currentUser {
                role
            }
            upcoming: upcomingEvents {
                eventId
                groupId
                groupName
                eventName
                description
                eventDate
                price
            }
        }
    }`,
    {
        variables: { groupId: id },
        onCompleted: async ({ group }) => {
            const locationResponse = await axios({
                method: 'GET',
                url: `https://maps.googleapis.com/maps/api/geocode/json?place_id=${group.location}&key=${REACT_APP_GEO_CODE}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).catch(err => console.log(err));

            if(locationResponse) {
                const locationData = JSON.parse(JSON.stringify(locationResponse)).data?.results;
                if(locationData) {
                    const compartmenalizedAddress = compAddress(locationData[0].address_components);
                    const location = formatLocation(compartmenalizedAddress, {
                        streetAddress: true,
                        cityState: true
                    });
                    setLocation(location.formattedLocation);
                }
            } else {
                setLocation(null);
            }
            setLocationLoading(false);
        }
    });

    if(errors) {
        console.log('Error: ', errors);
        return null;
    }

    if(loading || !data?.group?.groupName) {
        return <Loader />
    }

    const role = data.group.currentUser.role;
    const isOwner = role === 'owner';
    const isAdmin = isOwner || role === 'admin';
    const isCreator = isAdmin || role === 'creator';

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.detailsPage}>
                <HeaderMenu groupId={id} setGroupMembersOpen={setGroupMembersOpen} role={role}/>
                <Portal>
                    <Modal
                        visible={groupMembersOpen}
                        onDismiss={() => setGroupMembersOpen(false)}
                    >
                        <KeyboardAwareScrollView
                            style={{ width: '100%' }}
                            contentContainerStyle={styles.listModal}
                        >
                            {data.group.groupUsers.map(member => createGroupMemberTile(member, role))}
                        </KeyboardAwareScrollView>
                    </Modal>
                </Portal>
                <View style={styles.details}>
                    <Text variant="headlineLarge" style={styles.detailsHeader}>{data.group.groupName}</Text>
                    <Text variant="bodyLarge" style={styles.detailsSubheader}>{data.group.description}</Text>
                    {location && !locationLoading ? <LocationText location={location} clickable={true}/> : <ActivityIndicator animating={true}/>}
                    {isCreator &&
                        <Button
                            mode='outlined'
                            style={styles.button}
                            onPress={() => navigation.navigate('CalendarTab', {
                                screen: 'Create Event',
                                params: {
                                    groupId: id
                                }
                            })}>
                            <Icon source='plus' color='#042A2B' />New Event
                        </Button>
                    }
                </View>
                {data?.group?.upcoming?.length ? <HorizontalScrollWithTouch
                    scrollTitle="Upcoming Events"
                    scrollableItems={data.group.upcoming}
                    mapper="event"
                    navigation={navigation}
                /> : null}
            </View>
        </SafeAreaView>
    )

    function createGroupMemberTile(member, role) {
        const displayName = `${member.firstName} ${member.lastName} (${member.username})`;

        return <Text style={styles.groupMember} key={member.username}>
            {displayName}
        </Text>
    }
}
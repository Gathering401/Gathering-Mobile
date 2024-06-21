import axios from 'axios';

import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { View, SafeAreaView, Alert } from 'react-native';
import { Text, Portal, Modal } from 'react-native-paper';

import Loader from '../components/helpers/Loader';
import LocationText from '../components/LocationText';
import GroupMemberTiles from '../components/GroupMemberTiles';
import HeaderMenu from '../components/HeaderMenu';
import { compAddress } from '../service/compAddress';
import { formatLocation } from '../components/helpers/locationFormatter';
import { formatDate } from '../components/helpers/dateFormatter';

import { REACT_APP_GEO_CODE } from '@env';
import { REPEATED_EVENT_AND_GROUP_QUERY, DELETE_REPEATED_EVENT_MUTATION, DELETE_INDIVIDUAL_EVENT_MUTATION } from '../models/Queries';

import { styles } from '../styles/main-styles';
import { logError } from '../components/helpers/logError';

export default function Event({ route: { params: { eventId, repeatedEventId, groupId } }, navigation }) {
    const [location, setLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(true);
    const [attendingMembersOpen, setAttendingMembersOpen] = useState(false);
    
    const { data, loading } = useQuery(REPEATED_EVENT_AND_GROUP_QUERY,
    {
        variables: { id: repeatedEventId, groupId },
        onCompleted: async (response) => {
            const locationResponse = await axios({
                method: 'GET',
                url: `https://maps.googleapis.com/maps/api/geocode/json?place_id=${response.event.location}&key=${REACT_APP_GEO_CODE}`,
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
        },
        onError: ((error) => {
            logError(error);
        })
    });

    const [deleteRepeatedEvent] = useMutation(DELETE_REPEATED_EVENT_MUTATION, {
        onCompleted: () => {
            navigation.navigate('HomeTab', {
                screen: 'Home'
            })
        },
        refetchQueries: ['GetGroupsAndUpcomingEvents']
    });

    const [deleteIndividualEvent] = useMutation(DELETE_INDIVIDUAL_EVENT_MUTATION, {
        onCompleted: () => {
            navigation.navigate('HomeTab', {
                screen: 'Home'
            })
        },
        refetchQueries: ['GetGroupsAndUpcomingEvents']
    })

    const [menuOpen, setMenuOpen] = useState(false);

    const openAttendingModal = () => {
        setMenuOpen(false);
        setAttendingMembersOpen(true);
    }

    const openEventSettings = () => {
        setMenuOpen(false);
        navigation.navigate('GroupsTab', {
            screen: 'Update Group',
            params: {
                group,
                location
            }
        })
    }

    const cancelEvent = () => {
        setMenuOpen(false);
        Alert.alert(`Cancel ${event.eventName}?`, 'This will remove the event from members calendars.', [
            {
                text: 'Nevermind',
                style: 'cancel'
            },
            {
                text: `Yes, cancel event`,
                onPress: () => {
                    if(eventId && event.eventRepeat !== 'never') {
                        cancelWhichEvent();
                    } else {
                        deleteRepeatedEvent({
                            variables: {
                                groupId,
                                eventId
                            }
                        })
                    }
                }
            }
        ]);
    }

    const cancelWhichEvent = () => {
        Alert.alert('Just this one?', 'Or would you like to cancel every occurrence of this event?', [
            {
                text: 'Just this instance',
                onPress: () => deleteIndividualEvent({
                    variables: {
                        groupId,
                        eventId
                    }
                })
            },
            {
                text: 'Cancel every occurrence',
                onPress: () => deleteRepeatedEvent({
                    variables: {
                        groupId,
                        eventId: repeatedEventId
                    }
                })
            }
        ])
    }

    if(loading || locationLoading || !data?.event || !data?.group) {
        return <Loader />
    }

    const { event, group } = data;
    const currentUser = group.currentUser;
    const role = currentUser.role;
    const isOwner = role === 'owner';
    const isAdmin = isOwner || role === 'admin';
    const hasHostPower = isAdmin || currentUser.userId === event.host.userId
    const eventMenuOptions = [
        {
            title: 'Attending',
            onPress: openAttendingModal
        },
        {
            title: 'Event Settings',
            onPress: openEventSettings,
            disabled: !hasHostPower
        },
        {
            title: 'Cancel Event',
            onPress: cancelEvent,
            disabled: !hasHostPower,
            warningText: true
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <HeaderMenu
                menuOptions={eventMenuOptions}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
            />
            <View style={styles.detailsPage}>
                <Portal>
                    <Modal
                        visible={isAdmin && attendingMembersOpen}
                        onDismiss={() => setAttendingMembersOpen(false)}
                    >
                        <GroupMemberTiles
                            groupId={groupId} eventId={eventId} groupName={group.groupName} members={event.invitedUsers}
                            currentUser={currentUser} asRsvp={true}
                        />
                    </Modal>
                </Portal>
                <View style={styles.details}>
                    <Text variant="headlineLarge" style={styles.detailsHeader}>{event.eventName}</Text>
                    <Text variant="bodyLarge" style={styles.detailsSubHeader}>{event.description}</Text>
                    <Text variant="bodyLarge">
                        Happening {formatDate(event.eventRepeat, event.eventDates)}
                    </Text>
                    {location ? <LocationText location={location} clickable={true}/> : null}
                </View>
            </View>
        </SafeAreaView>
    )
}
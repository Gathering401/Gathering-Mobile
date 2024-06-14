import axios from 'axios';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { View, SafeAreaView } from 'react-native';
import { Text } from 'react-native-paper';
import { DateTime } from 'luxon';

import Loader from '../components/helpers/Loader';
import LocationText from '../components/LocationText';
import GroupMemberTiles from '../components/GroupMemberTiles';
import { compAddress } from '../service/compAddress';
import { formatLocation } from '../components/helpers/locationFormatter';
import { formatDate } from '../components/helpers/dateFormatter';

import { REACT_APP_GEO_CODE } from '@env';
import { REPEATED_EVENT_AND_GROUP_QUERY } from '../models/Queries';

import { styles } from '../styles/main-styles';

export default function Event({ route: { params: { eventId, groupId } }, navigation }) {
    const [location, setLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(true);
    const [attendingMembersOpen, setAttendingMembersOpen] = useState(false);
    
    const { data: { event, group }, loading } = useQuery(REPEATED_EVENT_AND_GROUP_QUERY,
    {
        variables: { eventId, groupId },
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
            console.log('Error: ', JSON.stringify(error, null, 2));
        })
    });

    const [menuOpen, setMenuOpen] = useState(false);

    const openAttendingModal = () => {
        setMenuOpen(false);
        setAttendingMembersOpen(true);
    }

    if(loading || locationLoading || !event.eventName) {
        return <Loader />
    }

    const role = currentUser.role;
    const isOwner = role === 'owner';
    const isAdmin = isOwner || role === 'admin';
    const isHost = isAdmin || currentUser.userId === event.host.userId
    const eventMenuOptions = [
        {
            title: 'Attending',
            onPress: openAttendingModal
        },
        {
            title: 'Event Settings',
            onPress: openEventSettings,
            disabled: !isHost
        },
        {
            title: 'Cancel Event',
            onPress: cancelEvent,
            disabled: !isHost,
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
                        onDismiss={() => setGroupMembersOpen(false)}
                    >
                        <GroupMemberTiles
                            groupId={groupId} groupName={group.groupName} members={event.invitedUsers}
                            currentUser={group.currentUser} asRsvp={true}
                        />
                    </Modal>
                    <Modal
                        visible={newOwnerOpen}
                        onDismiss={() => setNewOwnerOpen(false)}
                    >
                        <GroupMemberTiles
                            groupId={groupId} groupName={group.groupName} members={group.groupMembers}
                            currentUser={group.currentUser} asSelectors={true} selectableOnPress={updateOwnerAndLeaveGroup}
                            navigation={navigation} setNewOwnerOpen={setNewOwnerOpen}
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
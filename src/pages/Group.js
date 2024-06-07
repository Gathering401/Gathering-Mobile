import axios from 'axios';

import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import { View } from 'react-native';
import { Button, Icon, Text, ActivityIndicator, Modal, Portal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import Loader from '../components/helpers/Loader';
import LocationText from '../components/LocationText';
import HorizontalScrollWithTouch from '../components/HorizontalScrollWithTouch';
import HeaderMenu from '../components/HeaderMenu';
import GroupMemberTiles from '../components/GroupMemberTiles';

import { compAddress } from '../service/compAddress';
import { formatLocation } from '../components/helpers/locationFormatter';

import { REACT_APP_GEO_CODE } from '@env';

import { styles } from '../styles/main-styles';
import { GROUP_QUERY, UPDATE_OWNER_AND_LEAVE_MUTATION } from '../models/Queries';

export default function Group({ route: { params: { id } }, navigation }) {
    const [location, setLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(true);
    const [groupMembersOpen, setGroupMembersOpen] = useState(false);
    const [newOwnerOpen, setNewOwnerOpen] = useState(false);

    const { data, errors, loading } = useQuery(GROUP_QUERY, {
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
        },
        fetchPolicy: 'no-cache',
        refetchWritePolicy: 'overwrite',
        notifyOnNetworkStatusChange: true
    });

    const [updateOwnerAndLeaveGroup] = useMutation(UPDATE_OWNER_AND_LEAVE_MUTATION);

    if(errors) {
        console.log('Error: ', errors);
        return null;
    }

    if(loading || !data?.group?.groupName) {
        return <Loader />
    }

    const currentUser = data.group.currentUser;
    const role = currentUser.role;
    const isOwner = role === 'owner';
    const isAdmin = isOwner || role === 'admin';
    const isCreator = isAdmin || role === 'creator';

    return (
        <SafeAreaView style={styles.container}>
            <HeaderMenu group={data.group} location={location} setGroupMembersOpen={setGroupMembersOpen} setNewOwnerOpen={setNewOwnerOpen} navigation={navigation} currentUser={currentUser}/>
            <View style={styles.detailsPage}>
                <Portal>
                    <Modal
                        visible={isAdmin && groupMembersOpen}
                        onDismiss={() => setGroupMembersOpen(false)}
                    >
                        <GroupMemberTiles groupId={id} groupName={data.group.groupName} members={data.group.groupMembers} currentUser={data.group.currentUser} asSelectors={false} />
                    </Modal>
                    <Modal
                        visible={newOwnerOpen}
                        onDismiss={() => setNewOwnerOpen(false)}
                    >
                        <GroupMemberTiles groupId={id} groupName={data.group.groupName} members={data.group.groupMembers} currentUser={data.group.currentUser} asSelectors={true} selectableOnPress={updateOwnerAndLeaveGroup} navigation={navigation} setNewOwnerOpen={setNewOwnerOpen}/>
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
}

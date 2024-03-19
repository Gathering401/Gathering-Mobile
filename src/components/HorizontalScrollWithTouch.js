import { View, ScrollView, TouchableOpacity, Text } from 'react-native';

import { styles } from '../styles/main-styles';

import { MapTo } from '../models/mapper';


export default function HorizontalScrollWithTouch({ scrollTitle, scrollableItems, mapper, navigation }) {
    const navigate = (obj) => {
        switch(mapper) {
            case 'event':
            case 'invitation':
                navigation.navigate('CalendarTab', {
                    screen: 'Event',
                    initial: false,
                    params: { eventId: obj.eventId, groupId: obj.groupId, repeated: false }
                });
                break;
            case 'group':
                navigation.navigate('GroupsTab', {
                    screen: 'Group',
                    initial: false,
                    params: { id: obj.groupId }
                });
                break;
            default:
                break;
        }
    }

    return (
        <View style={styles.horizontalScrollerWrapper}>
            <Text style={styles.viewTitle}>{scrollTitle}</Text>
            <ScrollView style={styles.horizontalScroller} horizontal={true}>
                {scrollableItems.map((obj, i) => (
                    <TouchableOpacity onPress={() => navigate(obj)} key={i}>
                        <MapTo mapper={mapper} obj={obj} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Card } from '@rneui/base';

import { styles } from '../styles/main-styles';

import { MapTo } from '../models/Mapper';

export default function HorizontalScrollWithTouch({ scrollTitle, scrollableItems, titleLocation, mapper, navigation }) {
    const navigate = (obj) => {
        switch(mapper) {
            case 'event':
                navigation.navigate('Event', { eventId: obj.eventId, groupId: obj.groupId });
                break;
            case 'group':
                navigation.navigate('Group', { id: obj.groupId });
                break;
            default:
                break;
        }
    }

    return (
        <View style={{...styles.horizontalScrollerWrapper}}>
            <Text style={styles.viewTitle}>{scrollTitle}</Text>
            <ScrollView style={styles.horizontalScroller} horizontal={true}>
                {scrollableItems.map((obj, i) => (
                    <TouchableOpacity onPress={() => navigate(obj)} key={i}>
                        <Card containerStyle={styles.card}>
                            <View style={styles.cardTitleWrapper}>
                                <Card.Title style={styles.cardTitle}>
                                    {obj[titleLocation]}
                                </Card.Title>
                            </View>
                            <MapTo mapper={mapper} obj={obj} />
                        </Card>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}
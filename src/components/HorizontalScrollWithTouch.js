import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Card } from '@rneui/base';

import { styles } from '../styles/main-styles';

import { MapTo } from '../models/Mapper';

export default function HorizontalScrollWithTouch({scrollTitle, scrollableItems, titleLocation, mapper}) {
    return (
        <View style={{...styles.horizontalScrollerWrapper}}>
            <Text style={styles.viewTitle}>{scrollTitle}</Text>
            <ScrollView style={styles.horizontalScroller} horizontal={true}>
                {scrollableItems.map((obj, i) => (
                    <TouchableOpacity onPress={() => console.log(obj)} key={i}>
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
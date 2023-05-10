import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Card } from '@rneui/base';

import { styles } from '../styles/main-styles';

import mapTo from '../models/mapper';

export default function HorizontalScrollWithTouch({scrollTitle, scrollableItems, titleLocation, mapper}) {
    console.log(scrollTitle, scrollableItems);
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
                            {mapTo(mapper, obj)}
                        </Card>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}
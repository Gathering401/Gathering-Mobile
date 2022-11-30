import React from 'react';

import { View, TouchableOpacity } from 'react-native';
import { BiHome, BiCalendar } from 'react-icons/bi';

import { styles } from '../styles/main-styles';

export default function NavBar({navigation}) {
    return (
        <View style={styles.navbar}>
            <TouchableOpacity style={styles.alignCenterVertical} onPress={() => navigation.navigate('Home')}>
                <BiHome />
            </TouchableOpacity>
            <TouchableOpacity style={styles.alignCenterVertical} onPress={() => navigation.navigate('Calendar')}>
                <BiCalendar />
            </TouchableOpacity>
        </View>
    )
}
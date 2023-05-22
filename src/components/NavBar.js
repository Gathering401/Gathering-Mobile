import React from 'react';

import { View, TouchableOpacity } from 'react-native';
import { BsCalendar, BsHouse, BsPeople } from 'react-icons/bs';

import { styles } from '../styles/main-styles';

export default function NavBar({navigation}) {
    return (
        <View style={styles.navbar}>
            <TouchableOpacity style={styles.alignCenterVertical} onPress={() => navigation.navigate('Home')}>
                <BsHouse />
            </TouchableOpacity>
            <TouchableOpacity style={styles.alignCenterVertical} onPress={() => navigation.navigate('Calendar')}>
                <BsCalendar />
            </TouchableOpacity>
            <TouchableOpacity style={styles.alignCenterVertical} onPress={() => navigation.navigate('Groups')}>
                <BsPeople />
            </TouchableOpacity>
        </View>
    )
}
import React from 'react';
import { Text } from 'react-native';

import { styles } from '../styles/main-styles';

export default function Label({ text }) {
    return (
        <Text style={styles.inputLabel}>{text}</Text>
    )
}

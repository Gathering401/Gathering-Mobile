import React from 'react';
import { Text } from 'react-native';

import { styles } from '../../styles/main-styles';

export default function ErrorMessage({ text }) {
    return <Text style={styles.errorMessage}>{text}</Text>
}
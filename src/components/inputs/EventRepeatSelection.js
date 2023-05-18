import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

import { styles } from '../../styles/main-styles';

export default function EventRepeatSelection({ setShowRepeat, setRepeat, value }) {
    return <TouchableOpacity
            onPress={() => {
                setShowRepeat(false);
                setRepeat(value.toLowerCase());
            }}
            style={styles.eventRepeatSelection}
        ><Text>{value}</Text></TouchableOpacity>
}
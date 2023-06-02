import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

import { styles } from '../../styles/main-styles';

export default function EventRepeatSelection({ setShowRepeat, setFieldValue, setRepeat, value, setDisplay, selectedDate }) {
    return <TouchableOpacity
            onPress={() => {
                setDisplay(selectedDate, value.toLowerCase());
                setShowRepeat(false);
                setRepeat(value.toLowerCase());
                setFieldValue('repeat', value.toLowerCase());
            }}
            style={styles.eventRepeatSelection}
        ><Text>{value}</Text></TouchableOpacity>
}
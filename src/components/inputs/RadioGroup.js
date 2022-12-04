import React, { useState } from 'react';
import { View } from 'react-native';
import { RadioButton } from 'react-native-paper';

import Label from '../Label';

import { styles } from '../../styles/main-styles';

export default function RadioGroup({ handleChange, fieldName, value, options, label }) {
    let [check, setCheck] = useState(value);

    return <View style={styles.radioGroupContainer}>
        {
            options.map(o => (
                <View style={styles.radioAndLabelContainer}>
                    <Label text={label}/>
                    <RadioButton
                        style={styles.radioButton}
                        value={o.value}
                        status={ check === o.value ? 'checked' : 'unchecked' }
                        onPress={handleChange(fieldName)}
                    />
                </View>
            ))
        }
    </View>
}

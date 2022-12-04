import React, { useState } from 'react';
import { View } from 'react-native';
import { RadioButton } from 'react-native-paper';

import Label from '../Label';

import { styles } from '../../styles/main-styles';

export default function RadioGroup({ options, label, checked, setChecked }) {
    return <View style={styles.radioGroupContainer}>
        <Label text={label} />
        {
            options.map((option, index) => (
                <View style={styles.radioAndLabelContainer} key={`00${index}`}>
                    <Label text={option}/>
                    <RadioButton
                        style={styles.radioButton}
                        value={option}
                        status={ checked === option ? 'checked' : 'unchecked' }
                        onPress={() => setChecked(option)}
                    />
                </View>
            ))
        }
    </View>
}

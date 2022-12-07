import React from 'react';
import { TextInput, View } from 'react-native';

import Label from '../Label';

import { styles } from '../../styles/main-styles';

export default function PriceInput({ handleChange, handleBlur, value, fieldName, label }) {
    return (
        <View style={styles.inputAndLabel}>
            <Label text={label} />
            <TextInput
                required={true}
                keyboardType="number-pad"
                spellCheck={false}
                style={styles.textInput}
                onChangeText={handleChange(fieldName)}
                onBlur={handleBlur(fieldName)}
                placeholder="$0"
                placeholderTextColor="rgb(190, 190, 190)"
                value={value}
            />
        </View>
    )
}
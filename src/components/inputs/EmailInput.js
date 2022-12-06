import React from 'react';
import { TextInput, View } from 'react-native';

import Label from '../Label';

import { styles } from '../../styles/main-styles';

export default function EmailInput({ handleChange, handleBlur, value, fieldName, autoCapitalize, label }) {
    return (
        <View style={styles.inputAndLabel}>
            <Label text={label} />
            <TextInput
                style={{...styles.textInput}}
                keyboardType="email-address"
                required={true}
                spellCheck={false}
                autoCapitalize={autoCapitalize}
                onChangeText={handleChange(fieldName)}
                onBlur={handleBlur(fieldName)}
                placeholder="jane.doe@example.com"
                placeholderTextColor="rgb(190, 190, 190)"
                value={value}
            />
        </View>
    )
}
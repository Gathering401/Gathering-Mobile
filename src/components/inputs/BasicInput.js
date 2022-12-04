import React from 'react';
import { TextInput, View } from 'react-native';

import Label from '../Label';

import { styles } from '../../styles/main-styles';

export default function BasicInput({ handleChange, handleBlur, placeholder, value, fieldName, autoCapitalize, secureTextEntry, label }) {
    return (
        <View style={styles.inputAndLabel}>
            <Label text={label} />
            <TextInput
                style={{...styles.textInput}}
                required={true}
                spellCheck={false}
                autoCapitalize={autoCapitalize}
                secureTextEntry={secureTextEntry}
                onChangeText={handleChange(fieldName)}
                onBlur={handleBlur(fieldName)}
                placeholder={placeholder}
                placeholderTextColor="rgb(190, 190, 190)"
                value={value}
            />
        </View>
    )
}
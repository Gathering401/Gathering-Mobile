import React from 'react';
import { TextInput, View } from 'react-native';

import Label from '../Label';

import { styles } from '../../styles/main-styles';

export default function ParagraphInput({ handleChange, handleBlur, placeholder, value, fieldName, label }) {
    return (
        <View style={styles.inputAndLabel}>
            <Label text={label} />
            <TextInput
                style={{...styles.textInput, ...styles.paragraphInput}}
                required={true}
                autoCapitalize="sentences"
                spellCheck={true}
                multiline={true}
                onChangeText={handleChange(fieldName)}
                onBlur={handleBlur(fieldName)}
                placeholder={placeholder}
                placeholderTextColor="rgb(190, 190, 190)"
                value={value}
            />
        </View>
    )
}
import { TextInput, View } from 'react-native';

import Label from '../Label';

import { styles } from '../../styles/main-styles';

export default function EmailInput({ handleChange, handleBlur, value, fieldName, autoCapitalize, label, required }) {
    return (
        <View style={styles.inputAndLabel}>
            <Label text={label} required={required}/>
            <TextInput
                style={{...styles.textInput}}
                keyboardType="email-address"
                required={required}
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
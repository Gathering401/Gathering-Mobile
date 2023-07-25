import { TextInput, View } from 'react-native';

import Label from '../Label';

import { styles } from '../../styles/main-styles';

export default function BasicInput({ handleChange, handleBlur, placeholder, value, fieldName, autoCapitalize, secureTextEntry, label, required }) {
    return (
        <View style={styles.inputAndLabel}>
            <Label text={label} required={required}/>
            <TextInput
                style={{...styles.textInput}}
                required={required}
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
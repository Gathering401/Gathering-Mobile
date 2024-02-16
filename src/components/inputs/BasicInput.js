import { View } from 'react-native';
import { TextInput } from 'react-native-paper';

import { styles } from '../../styles/main-styles';

export default function BasicInput({ handleChange, handleBlur, placeholder, value, fieldName, autoCapitalize, secureTextEntry, label, required, multiline }) {
    return (
        <View style={styles.textInput}>
            <TextInput
                mode="outlined"
                label={label}
                placeholder={placeholder}
                placeholderTextColor="rgb(190, 190, 190)"
                required={required}
                secureTextEntry={secureTextEntry}
                autoCapitalize={autoCapitalize}
                spellCheck={false}
                onChangeText={handleChange(fieldName)}
                onBlur={handleBlur(fieldName)}
                multiline={multiline}
                value={value}
            />
        </View>
    )
}
import { TextInput, View } from 'react-native';

import Label from '../Label';

import { styles } from '../../styles/main-styles';

export default function PhoneInput({ handleChange, handleBlur, value, fieldName, label, required }) {
    value = value ? value.replace(/\D/g, "") : value;
    
    const normalize = () => {
        if(!value || value.length < 4) {
            return value;
        }
        if(value.length < 7) {
            return `(${value.slice(0,3)}) ${value.slice(3,)}`;
        }
        return `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6,10)}`;
    }
    
    return (
        <View style={styles.inputAndLabel}>
            <Label text={label} required={required}/>
            <TextInput
                required={required}
                keyboardType="phone-pad"
                maxLength={14}
                style={styles.textInput}
                onChangeText={handleChange(fieldName)}
                onBlur={handleBlur(fieldName)}
                placeholder="(555) 123-5678"
                placeholderTextColor="rgb(190, 190, 190)"
                value={normalize()}
            />
        </View>
    )
}
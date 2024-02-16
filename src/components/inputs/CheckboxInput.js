import { useState } from 'react';
import { Checkbox } from 'react-native-paper';

export default function CheckboxInput({ handleChange, fieldName, label }) {
    const [checked, setChecked] = useState(false);
    
    return (
        <Checkbox.Item
            label={label}
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
                setChecked(!checked);
                handleChange(fieldName, checked);
            }}
        />
    )
}
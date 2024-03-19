import { Checkbox } from 'react-native-paper';
import { styles } from '../../styles/main-styles';

export default function CheckboxInput({ handleChange, fieldName, label, checked, setChecked }) {
    return (
        <Checkbox.Item
            accessibilityLabel={label}
            label={label}
            style={styles.checkbox}
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
                setChecked(!checked);
                handleChange(fieldName, checked);
            }}
        />
    )
}
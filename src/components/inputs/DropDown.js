import { useState } from 'react';

import DropDownPicker from 'react-native-dropdown-picker';

import { styles } from '../../styles/main-styles';

export default function DropDown({ label, initial, fieldName, setFieldValue, options, setOptions, multiple }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(initial ?? null);
    
    return (
        <DropDownPicker
            style={styles.dropDown}
            labelStyle={styles.dropDownLabels}
            placeholder={label}
            open={open}
            setOpen={setOpen}
            value={value}
            setValue={setValue}
            onChangeValue={id => setFieldValue(fieldName, id)}
            items={options}
            setItems={setOptions}
            multiple={multiple}
            listMode="SCROLLVIEW"
        />
    )
}
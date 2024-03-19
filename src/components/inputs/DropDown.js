import { useState } from 'react';

import DropDownPicker from 'react-native-dropdown-picker';

import { styles } from '../../styles/main-styles';

export default function DropDown({ label, initial, fieldName, setFieldValue, options, setOptions, multiple, open, setOpen, closeOthers, zIndex }) {
    const [value, setValue] = useState(initial ?? null);
    
    return (
        <DropDownPicker
            style={styles.dropDown}
            dropDownContainerStyle={styles.dropDownContainer}
            labelStyle={styles.dropDownLabels}
            placeholder={label}
            open={open}
            setOpen={setOpen}
            onOpen={closeOthers}
            value={value}
            setValue={setValue}
            onChangeValue={id => setFieldValue(fieldName, id)}
            items={options}
            setItems={setOptions}
            multiple={multiple}
            listMode="SCROLLVIEW"
            zIndex={zIndex}
        />
    )
}
import React, { useState } from 'react';
import { View } from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';
import Label from '../Label';

import { styles } from '../../styles/main-styles';

export default function DropDown({ label, options, setOptions, selected, setSelected }) {
    let [open, setOpen] = useState(false);
    
    return (
        <View style={styles.inputAndLabel}>
            <Label text={label} />
            <DropDownPicker
                open={open}
                setOpen={setOpen}
                value={selected}
                setValue={setSelected}
                items={options}
                setItems={setOptions}
            />
        </View>
    )
}
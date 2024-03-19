import { useState } from 'react';
import { View, Keyboard } from 'react-native';
import { TextInput } from 'react-native-paper';

import { DateTime } from 'luxon';

import { styles } from '../../styles/main-styles';

import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';

export default function DateInput({ label, fieldName, setFieldValue, handleBlur }) {
    const [date, setDate] = useState(DateTime.now());
    const [openDateInput, setOpenDateInput] = useState(false);
    const [openTimeInput, setOpenTimeInput] = useState(false);

    const onDateConfirm = ({date}) => {
        setOpenDateInput(false);
        setOpenTimeInput(true);
        setDate(DateTime.fromJSDate(date));
    }

    const onTimeConfirm = ({hours, minutes}) => {
        const dateWithTime = date.startOf('day').plus({ hours, minutes });
        setDate(dateWithTime);
        setFieldValue(fieldName, dateWithTime.toISO());
        onDismiss();
    }

    const onDismiss = () => {
        setOpenDateInput(false);
        setOpenTimeInput(false);
    }

    return (
        <View>
            <TextInput
                style={{...styles.textInput, textAlign: 'auto'}}
                mode='outlined'
                label={label}
                outlineColor='rgb(190, 190, 190)'
                placeholder={label}
                placeholderTextColor='rgb(190, 190, 190)'
                required={true}
                autoCapitalize='words'
                spellCheck={false}
                onTouchEnd={() => Keyboard.dismiss()}
                onPressIn={() => setOpenDateInput(true)}
                onBlur={handleBlur(fieldName)}
                multiline={false}
                value={date.toLocaleString({
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                })}
            />
            <DatePickerModal
                locale="en"
                mode="single"
                visible={openDateInput}
                onDismiss={onDismiss}
                date={new Date(date.toISO())}
                onConfirm={onDateConfirm}
            />
            <TimePickerModal
                locale="en"
                visible={openTimeInput}
                onDismiss={onDismiss}
                hours={1}
                onConfirm={onTimeConfirm}
                defaultInputType='keyboard'
            />
        </View>
    )
}
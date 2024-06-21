import { useState } from 'react';

import { Dropdown } from 'react-native-element-dropdown';

import { styles } from '../../styles/main-styles';
import { Icon } from 'react-native-paper';

export default function RsvpDropdown({ groupId, eventId, sendRsvp, currentRsvp, disable }) {
    const [rsvp, setRsvp] = useState(currentRsvp);
    const [isFocus, setIsFocus] = useState(false);

    const options = [
        { label: 'Pending', value: 'pending' },
        { label: 'Going', value: 'attending' },
        { label: 'Not Going', value: 'declined' },
        { label: 'Maybe', value: 'maybe' },
    ]
    
    return <Dropdown
        disable={disable}
        style={styles.roleDropDown}
        placeholder={options.find(o => o.value === rsvp)?.label}
        data={options}
        maxHeight={300}
        labelField="label"
        valueField="value"
        onFocus={() => setIsFocus(true)}
        onBlur={() => {
            setIsFocus(false);
            sendRsvp({
                variables: {
                    groupId,
                    eventId,
                    rsvp
                }
            });
        }}
        onChange={item => {
            setRsvp(item.value);
            setIsFocus(false);
        }}
        renderRightIcon={() => disable ?
            null :
            <Icon
                size={20}
                source={isFocus ? 'chevron-down' : 'chevron-right'}
            />
        }
    />
}
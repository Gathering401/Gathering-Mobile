import { useState } from 'react';
import _ from 'lodash';

import { Dropdown } from 'react-native-element-dropdown';

import { styles } from '../../styles/main-styles';
import { Icon } from 'react-native-paper';

export default function RoleDropdown({ member, memberChanges, setMemberChanges, disable }) {
    const [role, setRole] = useState(member.role);
    const [isFocus, setIsFocus] = useState(false);

    const options = [
        { label: 'Member', value: 'member' },
        { label: 'Creator', value: 'creator' },
        { label: 'Admin', value: 'admin' },
        { label: 'Owner', value: 'owner' },
    ]
    
    return <Dropdown
        disable={disable}
        style={styles.roleDropDown}
        placeholder={_.capitalize(role)}
        data={options}
        maxHeight={300}
        labelField="label"
        valueField="value"
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
            setRole(item.value);
            const newMemberChanges = [...memberChanges, { role: item.value, userId: member.userId }];
            setMemberChanges(newMemberChanges)
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
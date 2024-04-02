import { useState } from 'react';
import { Button, Menu, Icon } from 'react-native-paper';

import { styles } from '../styles/main-styles';

export default function HeaderMenu() {
    const [menuOpen, setMenuOpen] = useState(false);

    return <Menu
        visible={menuOpen}
        onDismiss={() => setMenuOpen(false)}
        anchor={
            <Button onPress={() => setMenuOpen(true)}><Icon source='menu' size={30} color='#5EB1BF' /></Button>
        }
        style={styles.hamburger}
    >
        <Menu.Item onPress={() => {}} title="Group Members" />
        <Menu.Item onPress={() => {}} title="Group Settings" />
        <Menu.Item onPress={() => {}} title="Leave Group" titleStyle={{ color: 'red' }} />
    </Menu>
}
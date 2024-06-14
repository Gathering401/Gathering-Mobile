import { View } from 'react-native';
import { Button, Menu, Icon } from 'react-native-paper';

import { styles } from '../styles/main-styles';

export default function HeaderMenu({ menuOptions, menuOpen, setMenuOpen }) {
    return (
        <View style={styles.hamburgerWrapper}>
            <Menu
                visible={menuOpen}
                onDismiss={() => setMenuOpen(false)}
                anchorPosition='bottom'
                anchor={
                    <Button onPress={() => setMenuOpen(true)}><Icon source='menu' size={30} color='#5EB1BF' /></Button>
                }
                style={styles.hamburger}
            >
                {
                    menuOptions.map((option, index) => {
                        if(!option.disabled) {
                            return <Menu.Item
                                key={index}
                                title={option.title}
                                onPress={option.onPress}
                                titleStyle={option.warningText ? {color: 'red'} : {}}
                            />
                        }
                    })
                }
            </Menu>
        </View>
    )
}
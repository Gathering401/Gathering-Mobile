import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

import { styles } from '../styles/main-styles';

export default function NavBar({navigation}) {
    return (
        <View style={styles.navbar}>
            <TouchableOpacity style={styles.alignCenterVertical} onPress={() => navigation.navigate('Home')}>
                <Icon name="home" size={40} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.alignCenterVertical} onPress={() => navigation.navigate('Calendar')}>
                <Icon name="calendar" size={40} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.alignCenterVertical} onPress={() => navigation.navigate('Groups')}>
                <Icon name="users" size={40} />
            </TouchableOpacity>
        </View>
    )
}
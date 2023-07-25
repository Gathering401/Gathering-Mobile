import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

import { styles } from '../styles/main-styles';

export default function NavBar({navigation}) {
    console.log('cheeeeeeese', navigation);
    return (
        <View style={styles.navbar}>
            <TouchableOpacity style={styles.alignCenterVertical} onPress={() => navigation.navigate('Home')}>
                <Icon name="home" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.alignCenterVertical} onPress={() => navigation.navigate('Calendar')}>
                <Icon name="home" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.alignCenterVertical} onPress={() => navigation.navigate('Groups')}>
                <Icon name="home" />
            </TouchableOpacity>
        </View>
    )
}
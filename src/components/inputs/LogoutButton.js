import * as SecureStore from 'expo-secure-store';
import { Button } from 'react-native-paper';
import { styles } from '../../styles/main-styles';

export default function LogoutButton({ navigation }) {
    const logout = async () => {
        await SecureStore.deleteItemAsync('token');
        navigation.navigate('HomeTab', {
            screen: 'Login'
        });
    }

    return <Button style={styles.button} onPress={logout} mode="outlined">Logout</Button>
}
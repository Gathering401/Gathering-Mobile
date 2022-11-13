import { Text, View, Button } from 'react-native';
import { styles } from '../styles/main-styles';

export default function HomeScreen({navigation}) {
    return (
        <View style={styles.container}>
            <Text>Welcome to the home page!</Text>
            <Button 
                title="Leave Home Page"
                onPress={() => navigation.navigate('Other')}
            />
            <Button 
                title="Calendar Page"
                onPress={() => navigation.navigate('Calendar')}
            />
        </View>
    )
}
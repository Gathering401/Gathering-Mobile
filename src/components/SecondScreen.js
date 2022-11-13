import { Text, View, Button } from 'react-native';
import { styles } from '../styles/main-styles';

export default function SecondScreen({navigation}) {
    return (
        <View style={styles.container}>
            <Text>This is the second page</Text>
            <Button 
                title="Back to Home Page"
                onPress={() => navigation.navigate('Home')}
            />
            <Button 
                title="Calendar Page"
                onPress={() => navigation.navigate('Calendar')}
            />
        </View>
    )
}
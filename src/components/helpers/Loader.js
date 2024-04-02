import { ActivityIndicator } from "react-native-paper";
import { View } from 'react-native';
import { styles } from "../../styles/main-styles";

export default function Loader() {
    return (
        <View style={styles.container}>
            <ActivityIndicator animating={true}/>
        </View>
    )
}
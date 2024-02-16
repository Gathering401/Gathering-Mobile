import { Text } from 'react-native';
import { Card } from 'react-native-paper';
import { styles } from '../styles/main-styles';

export const GroupCard = ({group}) => {
    return (
        <Card style={styles.card}>
            <Card.Title title={group.groupName}/>
            <Card.Content>
                <Text>{group.description}</Text>
            </Card.Content>
        </Card>
    )
}

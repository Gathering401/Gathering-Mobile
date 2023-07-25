import { TouchableOpacity, Text } from 'react-native';
import { Card } from '@rneui/base';
import { styles } from '../styles/main-styles';

export default function GroupTierCard({ title, memberSize, eventSize, price, tier, setSelectedTier }) {
    const handleTierSelection = () => {
        console.log(tier);
        setSelectedTier(tier);
    }
    
    return (
        <TouchableOpacity onPress={handleTierSelection}>
            <Card style={styles.groupTierCard}>
                <Card.Title style={styles.cardTitle}>{title}</Card.Title>
                <Text>Max Members: {memberSize}</Text>
                <Text>Max Events/Month: {eventSize}</Text>
                <Text style={styles.costDisplay}>${price}</Text>
            </Card>
        </TouchableOpacity>
    )
}
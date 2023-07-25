import { View, Text } from 'react-native';

export const MapToGroupCard = ({group}) => {
    return (
        <View>
            <Text>{group.description}</Text>
        </View>
    )
}

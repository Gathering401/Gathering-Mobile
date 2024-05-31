import { Button } from 'react-native-paper';

import { styles } from '../../../styles/main-styles';

export default function SaveButton({ onPress, loading }) {
    return <Button
        style={styles.saveButton}
        onPress={onPress}
        mode="outlined"
        textColor="black"
        loading={loading}
    >
        Save Changes
    </Button>
}
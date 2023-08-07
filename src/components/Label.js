import { Text } from 'react-native';
// import { CgAsterisk } from 'react-icons/cg';

import { styles } from '../styles/main-styles';

export default function Label({ text, required }) {
    return (
        <>
            <Text style={styles.inputLabel}>{text}</Text>
            {/* { required && <CgAsterisk color='red' /> } */}
        </>
    )
}

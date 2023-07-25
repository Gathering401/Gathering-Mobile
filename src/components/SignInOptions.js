import { View, Button } from 'react-native';

export default function SignInOptions({navigation, setSubmitted}) {
    return (
        <View>
            <Button
                title="Log In"
                onPress={() => navigation.navigate('Login')}
                setSubmitted={setSubmitted}
            />
            <Button
                title="Sign Up"
                onPress={() => navigation.navigate('SignUp')}
                setSubmitted={setSubmitted}
            />
        </View>
    )
}
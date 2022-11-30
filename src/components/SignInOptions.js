import React from 'react';

import { View, Button } from 'react-native';

export default function SignInOptions({navigation}) {
    return (
        <View>
            <Button
                title="Log In"
                onPress={() => navigation.navigate('Login')}
            />
            <Button
                title="Sign Up"
                onPress={() => navigation.navigate('SignUp')}
            />
        </View>
    )
}
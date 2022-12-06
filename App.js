import React, { useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TokenContext } from './src/tempContext/token-context'; // context is only temporary for testing in web

import HomeScreen from './src/pages/HomeScreen';
import SignUp from './src/pages/SignUp';
import Login from './src/pages/Login.js';
import EventCalendar from './src/pages/EventCalendar';
import Groups from './src/pages/Groups';

const Stack = createNativeStackNavigator();

export default function App() {
    let [token, setToken] = useState();
    const value = { token, setToken };
    
    return (
        <TokenContext.Provider value={value}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{headerShown: false}}>
                    <Stack.Screen name="Home" options={{title: "Home"}}>
                        {(props) => <HomeScreen {...props} token={token}/>}
                    </Stack.Screen>
                    <Stack.Screen name="SignUp" component={SignUp} options={{title: "Sign Up"}} />
                    <Stack.Screen name="Login" component={Login} options={{title: "Log In"}} />
                    <Stack.Screen name="Calendar" component={EventCalendar} />
                    <Stack.Screen name="Groups" component={Groups} />
                </Stack.Navigator>
            </NavigationContainer>
        </TokenContext.Provider>
    );
}

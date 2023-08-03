import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/pages/HomeScreen';
import SignUp from './src/pages/SignUp';
import Login from './src/pages/Login.js';
import EventCalendar from './src/pages/EventCalendar';
import Groups from './src/pages/Groups';
import Group from './src/pages/Group';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Home" component={HomeScreen} options={{title: "Home"}} />
                <Stack.Screen name="SignUp" component={SignUp} options={{title: "Sign Up"}} />
                <Stack.Screen name="Login" component={Login} options={{title: "Log In"}} />
                <Stack.Screen name="Calendar" component={EventCalendar} />
                <Stack.Screen name="Groups" component={Groups} />
                <Stack.Screen name="Group" component={Group} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

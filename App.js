import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/pages/HomeScreen';
import SignUp from './src/pages/SignUp';
import Login from './src/pages/Login.js';
import EventCalendar from './src/pages/EventCalendar';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Home" options={{title: "Home"}}>
                {(props) => <HomeScreen {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="SignUp" component={SignUp} options={{title: "Sign Up"}} />
            <Stack.Screen name="Login" component={Login} options={{title: "Log In"}} />
            <Stack.Screen name="Calendar" component={EventCalendar} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}

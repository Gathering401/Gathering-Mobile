import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/pages/HomeScreen';
import SecondScreen from './src/pages/SecondScreen';
import EventCalendar from './src/pages/EventCalendar';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Home" options={{title: "Noice"}}>
                {(props) => <HomeScreen {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="Other" component={SecondScreen} />
            <Stack.Screen name="Calendar" component={EventCalendar} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}

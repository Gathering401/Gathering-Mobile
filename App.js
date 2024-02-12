import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/pages/HomeScreen';
import SignUp from './src/pages/SignUp';
import Login from './src/pages/Login.js';
import EventCalendar from './src/pages/EventCalendar';
import Groups from './src/pages/Groups';
import Group from './src/pages/Group';
import Event from './src/pages/Event';

import { ApolloProvider } from '@apollo/client';

import { buildClient } from './src/service/clientBuilder';

import { en, registerTranslation } from 'react-native-paper-dates';
import { Icon } from 'react-native-paper';

registerTranslation('en', en);

const Tab = createBottomTabNavigator();

export default function App() {
    const client = buildClient();

    const HomeStack = createNativeStackNavigator();
    
    function HomeStackScreen() {
        return (
            <HomeStack.Navigator screenOptions={{ headerShown: false }}>
                <HomeStack.Screen name="Home" component={HomeScreen} options={{title: "Home"}} />
                <HomeStack.Screen name="SignUp" component={SignUp} options={{title: "Sign Up"}} />
                <HomeStack.Screen name="Login" component={Login} options={{title: "Log In"}} />
            </HomeStack.Navigator>
        )
    }

    const CalendarStack = createNativeStackNavigator();

    function CalendarStackScreen() {
        return (
            <CalendarStack.Navigator screenOptions={{ headerShown: false }}>
                <CalendarStack.Screen name="Calendar" component={EventCalendar} />
                <CalendarStack.Screen name="Event" component={Event} />
            </CalendarStack.Navigator>
        )
    }

    const GroupStack = createNativeStackNavigator();

    function GroupStackScreen() {
        return (
            <GroupStack.Navigator screenOptions={{ headerShown: false }}>
                <GroupStack.Screen name="Groups" component={Groups} />
                <GroupStack.Screen name="Group" component={Group} />
                <CalendarStack.Screen name="Group Event" component={Event} />
            </GroupStack.Navigator>
        )
    }
    
    return (
        <NavigationContainer>
            <ApolloProvider client={client}>
                <SafeAreaProvider>
                    <Tab.Navigator screenOptions={({ route }) => ({
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => {
                            let iconName;

                            if (route.name === 'HomeTab') {
                                iconName = 'home';
                            } else if (route.name === 'CalendarTab') {
                                iconName = 'calendar-account';
                            } else if (route.name === 'GroupsTab') {
                                iconName = 'account-group';
                            }

                            return <Icon source={iconName} size={size} color={color} />;
                        },
                        tabBarActiveTintColor: 'tomato',
                        tabBarInactiveTintColor: 'gray',
                        })}
                    >
                        <Tab.Screen name="HomeTab" component={HomeStackScreen} options={{ title: "Home" }}/>
                        <Tab.Screen name="CalendarTab" component={CalendarStackScreen} options={{ title: "Calendar" }}/>
                        <Tab.Screen name="GroupsTab" component={GroupStackScreen} options={{ title: "Groups" }}/>
                    </Tab.Navigator>
                </SafeAreaProvider>
            </ApolloProvider>
        </NavigationContainer>
    );
}

//App.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebase';

import Login from './screens/Login';
import List from './screens/List';
import Details from './screens/Details';

const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

function InsideLayout() {
    return (
        <InsideStack.Navigator>
            <InsideStack.Screen name='My Todos' component={List} />
            <InsideStack.Screen name='Details' component={Details} />
        </InsideStack.Navigator>
    );
}

export default function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, (user) => {
            console.log(user);
            setUser(user);
        });
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Login'>
                {user ?
                    <Stack.Screen name='Inside' component={InsideLayout} options={{ headerShown: false }} /> :
                    <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />}
            </Stack.Navigator>
        </NavigationContainer>
    );
}


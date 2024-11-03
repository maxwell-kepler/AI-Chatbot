//src/screens/List.js

import { View, Button } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH } from '../firebase'


const List = ({ navigation }) => {
    return (
        <View>
            <Button title='Open Details' onPress={() => navigation.navigate('Details')} />
            <Button title='Logout' onPress={() => FIREBASE_AUTH.signOut()} />
        </View>
    )
}

export default List
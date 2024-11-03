//src/screens/Login.js
import { View, TextInput, StyleSheet, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        try {
            setLoading(true);
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        try {
            setLoading(true);
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }


    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior='padding'>
                <TextInput style={styles.input} value={email} placeholder='email' autoCapitalize='none' onChangeText={(text) => setEmail(text)}></TextInput>
                <TextInput style={styles.input} value={password} placeholder='password' autoCapitalize='none' secureTextEntry={true} onChangeText={(text) => setPassword(text)}></TextInput>

                {loading ? <ActivityIndicator size="large" color="#0000ff" /> : <>
                    <Button title='Login' onPress={signIn} />
                    <Button title='Sign Up' onPress={() => signUp()} />
                </>}
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center'
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: "#fff"
    }
})

export default Login
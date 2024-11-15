// screens/resources/TestDatabaseScreen/index.js
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Platform,
    Alert,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { API_URL } from '../../../config/api';
import { userService } from '../../../services/database/userService';

const TestDatabaseScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [result, setResult] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const handleFetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await userService.fetchUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Detailed error:', {
                message: error.message,
                stack: error.stack,
                platform: Platform.OS
            });
            Alert.alert(
                'Error',
                'Failed to fetch users. Check console for details.'
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    const handleTestConnections = useCallback(async () => {
        try {
            setResult('Testing connection...');
            setLoading(true);
            const data = await userService.testConnection();
            setResult(`Connection successful: ${JSON.stringify(data, null, 2)}`);
            Alert.alert('Success', 'Backend connection successful!');
        } catch (error) {
            console.error('Detailed error:', {
                message: error.message,
                stack: error.stack,
                platform: Platform.OS
            });
            setResult(`Connection failed: ${error.message}`);
            Alert.alert('Error', `Connection test failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        handleTestConnections();
        handleFetchUsers();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        handleFetchUsers();
    };

    const handleCreateUser = useCallback(async () => {
        console.log("email", email);
        console.log("password", password);
        console.log("username", username);
        if (!email || !password || !username) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }
        try {
            setLoading(true);
            setResult('Creating user...');

            const userData = {
                email,
                password,
                username,
                firstName,
                lastName
            };

            console.log('Sending request to:', `${API_URL}/users`);
            console.log('With data:', userData);

            const data = await userService.createUser(userData);

            //if (data) {
            Alert.alert('Success', 'User created successfully!');
            // Clear form
            setEmail('');
            setPassword('');
            setUsername('');
            setFirstName('');
            setLastName('');

            //}
        } catch (error) {
            console.error('Error creating user:', {
                message: error.message,
                stack: error.stack,
                platform: Platform.OS
            });
            Alert.alert('Error', `Failed to create user: ${error.message}`);
        } finally {
            // Refresh user list
            handleFetchUsers();
            setLoading(false);
        }
    }, []);

    const createUser = async () => {
        if (!email || !password || !username) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            setResult('Creating user...');

            const userData = {
                email,
                password,
                username,
                firstName,
                lastName
            };

            console.log('Sending request to:', `${API_URL}/users`);
            console.log('With data:', userData);

            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            // Log raw response first
            const text = await response.text();
            console.log('Raw response:', text);

            // Try to parse JSON
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                console.error('Raw response was:', text);
                throw new Error('Invalid JSON response from server');
            }

            console.log('Parsed response:', data);

            if (response.ok) {
                Alert.alert('Success', 'User created successfully!');
                // Clear form
                setEmail('');
                setPassword('');
                setUsername('');
                setFirstName('');
                setLastName('');
                // Refresh user list
                handleFetchUsers();
            } else {
                throw new Error(data.message || 'Failed to create user');
            }

        } catch (error) {
            console.error('Error creating user:', {
                message: error.message,
                stack: error.stack,
                platform: Platform.OS
            });
            Alert.alert('Error', `Failed to create user: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const UserList = () => (
        <View style={styles.userListContainer}>
            <Text style={styles.userListTitle}>Registered Users</Text>
            {users.map((user, index) => (
                <View key={user.user_id || index} style={styles.userCard}>
                    <Text style={styles.userName}>
                        {user.first_name} {user.last_name}
                    </Text>
                    <Text style={styles.userDetail}>Username: {user.username}</Text>
                    <Text style={styles.userDetail}>Email: {user.email}</Text>
                </View>
            ))}
        </View>
    );

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <Text style={styles.title}>Database Test Screen</Text>

            {/* User Registration Form */}
            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Add New User</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email *"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password *"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TextInput
                    style={styles.input}
                    placeholder="Username *"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleCreateUser}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Create User</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* User List */}
            {loading && !refreshing ? (
                <ActivityIndicator style={styles.loader} size="large" color="#007AFF" />
            ) : (
                <UserList />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 20,
        color: '#333',
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15,
        color: '#333',
    },
    input: {
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#999',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    userListContainer: {
        padding: 20,
    },
    userListTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15,
        color: '#333',
    },
    userCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
        color: '#333',
    },
    userDetail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 3,
    },
    loader: {
        marginTop: 20,
    },
});

export default TestDatabaseScreen;
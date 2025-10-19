import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

const LoginScreen = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) return null;

    const { login } = authContext;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleLogin = () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Validation Error', 'Please enter both email and password');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Validation Error', 'Please enter a valid email address');
            return;
        }

        const success = login(email, password);
        if (!success) {
            Alert.alert('Login Failed', 'Invalid email or password');
        }
        // Navigation handled by AuthContext automatically
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.innerContainer}>
                <Text style={styles.appTitle}>PRED Care</Text>
                <Text style={styles.subtitle}>Doctor Availability Module</Text>
                <Text style={styles.title}>Login</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="emailAddress"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    textContentType="password"
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <View style={styles.credentialsHint}>
                    <Text style={styles.hintText}>Default Credentials:</Text>
                    <Text style={styles.hintText}>📧 shareeba@gmail.com</Text>
                    <Text style={styles.hintText}>🔑 shareeba</Text>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F8',
        justifyContent: 'center',
        padding: 20,
    },
    innerContainer: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 5,
    },
    appTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#007AFF',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 25,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 15,
        borderRadius: 8,
        fontSize: 16,
        backgroundColor: '#F9F9F9',
        color: '#000',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    credentialsHint: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#F0F4F8',
        borderRadius: 8,
        alignItems: 'center',
    },
    hintText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 3,
    },
});

export default LoginScreen;
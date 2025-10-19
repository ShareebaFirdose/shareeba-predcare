import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

const ProfileScreen = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) return null;
    const { user } = authContext;
    const [email, setEmail] = useState(user?.email || '');
    const [name, setName] = useState(user?.email ? 'Shareeba' : '');
    const [mobile, setMobile] = useState(user?.email ? '+919876543210' : '');

    const handleSave = () => {
        Alert.alert('Profile Saved', `Name: ${name}\nEmail: ${email}\nMobile: ${mobile}`);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>My Profile</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter Name" />
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter Email"
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
                style={styles.input}
                value={mobile}
                onChangeText={setMobile}
                placeholder="Enter Mobile"
                keyboardType="phone-pad"
            />
            <Button title="Save Profile" onPress={handleSave} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
    },
    label: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
        marginTop: 15,
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
    },
});

export default ProfileScreen;
import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AuthContext } from './context/AuthContext';

const DashboardScreen = ({ navigation }: any) => {
    const authContext = useContext(AuthContext);
    if (!authContext) return null;

    const { user, logout } = authContext;

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.welcome}>Welcome, {user?.email}</Text>
                <Text style={styles.subtitle}>PRED Care Management System</Text>
            </View>

            {/* Main Cards Section */}
            <View style={styles.cardsContainer}>
                <TouchableOpacity 
                    style={[styles.card, styles.primaryCard]}
                    onPress={() => navigation.navigate('Doctors')}
                >
                    <View style={styles.cardIcon}>
                        <Text style={styles.iconText}>👨‍⚕️</Text>
                    </View>
                    <Text style={styles.cardTitle}>Doctors</Text>
                    <Text style={styles.cardSubtitle}>Manage doctors & availability</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.card, styles.successCard]}>
                    <View style={styles.cardIcon}>
                        <Text style={styles.iconText}>👥</Text>
                    </View>
                    <Text style={styles.cardTitle}>Patients</Text>
                    <Text style={styles.cardSubtitle}>View patient records</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.card, styles.warningCard]}>
                    <View style={styles.cardIcon}>
                        <Text style={styles.iconText}>📅</Text>
                    </View>
                    <Text style={styles.cardTitle}>Appointments</Text>
                    <Text style={styles.cardSubtitle}>Manage appointments</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.card, styles.infoCard]}>
                    <View style={styles.cardIcon}>
                        <Text style={styles.iconText}>👨‍💼</Text>
                    </View>
                    <Text style={styles.cardTitle}>Staff</Text>
                    <Text style={styles.cardSubtitle}>Manage staff members</Text>
                </TouchableOpacity>
            </View>

            {/* Statistics Section */}
            <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>Quick Statistics</Text>
                
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Total Doctors</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>245</Text>
                        <Text style={styles.statLabel}>Total Patients</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>38</Text>
                        <Text style={styles.statLabel}>Today's Appointments</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>8</Text>
                        <Text style={styles.statLabel}>Active Staff</Text>
                    </View>
                </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Doctors', { 
                        screen: 'AddDoctor' 
                    })}
                >
                    <Text style={styles.actionButtonText}>➕ Add New Doctor</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Doctors', { 
                        screen: 'DoctorAvailability' 
                    })}
                >
                    <Text style={styles.actionButtonText}>📅 Manage Availability</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Text style={styles.actionButtonText}>👤 View Profile</Text>
                </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={logout}
            >
                <Text style={styles.logoutButtonText}>🚪 Logout</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>2025 © PRED Care, All Rights Reserved</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#F5F5F5', 
        padding: 15 
    },
    header: { 
        marginBottom: 25,
        paddingVertical: 15,
    },
    welcome: { 
        fontSize: 26, 
        fontWeight: 'bold', 
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    cardsContainer: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between', 
        marginBottom: 25 
    },
    card: { 
        width: '48%', 
        backgroundColor: '#fff', 
        padding: 20, 
        borderRadius: 12, 
        marginBottom: 15, 
        shadowColor: '#000', 
        shadowOpacity: 0.1, 
        shadowOffset: { width: 0, height: 2 }, 
        shadowRadius: 4, 
        elevation: 3,
        alignItems: 'center',
    },
    primaryCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
    },
    successCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#34C759',
    },
    warningCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#FF9500',
    },
    infoCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#5856D6',
    },
    cardIcon: {
        marginBottom: 10,
    },
    iconText: {
        fontSize: 32,
    },
    cardTitle: { 
        fontSize: 16, 
        fontWeight: 'bold',
        color: '#333', 
        marginBottom: 5,
        textAlign: 'center',
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    statsSection: {
        marginBottom: 25,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        width: '48%',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
        elevation: 2,
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    quickActions: {
        marginBottom: 25,
    },
    actionButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    logoutButton: { 
        backgroundColor: '#FF3B30', 
        paddingVertical: 15, 
        borderRadius: 12, 
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    logoutButtonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 15,
    },
    footerText: {
        fontSize: 12,
        color: '#999',
    },
});

export default DashboardScreen;
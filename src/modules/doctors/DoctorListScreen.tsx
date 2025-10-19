import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

interface Doctor {
  id: number;
  name: string;
  email: string;
  specialization: string;
  license_number: string;
  primary_clinic: string;
  status: 'Active' | 'Inactive';
  phone?: string;
}

const API_BASE_URL = 'http://192.168.1.100:5000/api';

const DoctorListScreen = ({ navigation }: any) => {
  const authContext = useContext(AuthContext);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchDoctors();
    }, [])
  );

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors`, {
        headers: {
          'Authorization': `Bearer ${authContext?.token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setDoctors(data.data);
        setFilteredDoctors(data.data);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch doctors');
      }
    } catch (error) {
      console.error('Fetch doctors error:', error);
      Alert.alert('Error', 'Unable to connect to server');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDoctors();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(query.toLowerCase()) ||
          doctor.email.toLowerCase().includes(query.toLowerCase()) ||
          doctor.specialization.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  };

  const handleDeleteDoctor = async (doctorId: number) => {
    Alert.alert(
      'Delete Doctor',
      'Are you sure you want to delete this doctor?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/doctors/${doctorId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${authContext?.token}`,
                },
              });

              const data = await response.json();

              if (data.success) {
                Alert.alert('Success', 'Doctor deleted successfully');
                fetchDoctors();
              } else {
                Alert.alert('Error', data.message || 'Failed to delete doctor');
              }
            } catch (error) {
              Alert.alert('Error', 'Unable to connect to server');
            }
          },
        },
      ]
    );
  };

  const renderDoctorCard = ({ item }: { item: Doctor }) => (
    <View style={styles.doctorCard}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </Text>
          </View>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{item.name}</Text>
            <Text style={styles.doctorEmail}>{item.email}</Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            item.status === 'Active' ? styles.activeBadge : styles.inactiveBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === 'Active' ? styles.activeText : styles.inactiveText,
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Specialization:</Text>
          <Text style={styles.infoValue}>{item.specialization}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>License:</Text>
          <Text style={styles.infoValue}>{item.license_number}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Clinic:</Text>
          <Text style={styles.infoValue}>{item.primary_clinic || 'N/A'}</Text>
        </View>
        {item.phone && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{item.phone}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate('DoctorAvailability', { doctor: item })
          }
        >
          <Text style={styles.actionButtonText}>📅 Availability</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteDoctor(item.id)}
        >
          <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading doctors...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Doctor List</Text>
        <Text style={styles.subtitle}>Total Doctors: {doctors.length}</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search doctors..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Add Button Row */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddDoctor')}
        >
          <Text style={styles.addButtonText}>➕ New Doctor</Text>
        </TouchableOpacity>
      </View>

      {/* Doctors List */}
      <FlatList
        data={filteredDoctors}
        renderItem={renderDoctorCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No doctors found</Text>
            <TouchableOpacity
              style={styles.addButtonEmpty}
              onPress={() => navigation.navigate('AddDoctor')}
            >
              <Text style={styles.addButtonText}>➕ Add First Doctor</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  actionRow: {
    padding: 15,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonEmpty: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContainer: {
    padding: 15,
  },
  doctorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  doctorEmail: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#D1FAE5',
  },
  inactiveBadge: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#059669',
  },
  inactiveText: {
    color: '#DC2626',
  },
  cardBody: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    width: 120,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 10,
  },
});

export default DoctorListScreen
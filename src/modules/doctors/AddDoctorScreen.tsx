import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';

const API_BASE_URL = 'http://192.168.1.100:5000/api';

const AddDoctorScreen = ({ navigation }: any) => {
  const authContext = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'Inactive',
    specialization: '',
    license_number: '',
    phone: '',
    address: '',
    primary_clinic: 'PRED CLINIC',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Please enter doctor name');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Validation Error', 'Please enter email');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email');
      return false;
    }
    if (!formData.specialization.trim()) {
      Alert.alert('Validation Error', 'Please enter specialization');
      return false;
    }
    if (!formData.license_number.trim()) {
      Alert.alert('Validation Error', 'Please enter license number');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/doctors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authContext?.token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Doctor added successfully', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('Error', data.message || 'Failed to add doctor');
      }
    } catch (error) {
      console.error('Add doctor error:', error);
      Alert.alert('Error', 'Unable to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add New Doctor</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Basic Information</Text>

            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter doctor's full name"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                editable={!isLoading}
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Email <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="doctor@example.com"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 9876543210"
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
                editable={!isLoading}
              />
            </View>

            {/* Status */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Status <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.statusButtons}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    formData.status === 'Active' && styles.statusButtonActive,
                  ]}
                  onPress={() => handleInputChange('status', 'Active')}
                  disabled={isLoading}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      formData.status === 'Active' && styles.statusButtonTextActive,
                    ]}
                  >
                    Active
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    formData.status === 'Inactive' && styles.statusButtonInactive,
                  ]}
                  onPress={() => handleInputChange('status', 'Inactive')}
                  disabled={isLoading}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      formData.status === 'Inactive' && styles.statusButtonTextInactive,
                    ]}
                  >
                    Inactive
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Professional Information */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Professional Information</Text>

            {/* Specialization */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Specialization <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Cardiology, Pediatrics"
                value={formData.specialization}
                onChangeText={(value) => handleInputChange('specialization', value)}
                editable={!isLoading}
              />
            </View>

            {/* License Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                License Number <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Medical license number"
                value={formData.license_number}
                onChangeText={(value) => handleInputChange('license_number', value)}
                editable={!isLoading}
              />
            </View>

            {/* Primary Clinic */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Primary Clinic</Text>
              <TextInput
                style={styles.input}
                placeholder="Clinic name"
                value={formData.primary_clinic}
                onChangeText={(value) => handleInputChange('primary_clinic', value)}
                editable={!isLoading}
              />
            </View>

            {/* Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Clinic address"
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
                multiline
                numberOfLines={3}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.saveButton, isLoading && styles.buttonDisabled]} 
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Doctor</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  statusButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#D1FAE5',
    borderColor: '#34C759',
  },
  statusButtonInactive: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FF3B30',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  statusButtonTextActive: {
    color: '#059669',
  },
  statusButtonTextInactive: {
    color: '#DC2626',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default AddDoctorScreen;
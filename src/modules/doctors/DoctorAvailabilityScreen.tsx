import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

type AvailabilityType = 'specific' | 'recurring' | 'leave';
type ConsultationType = 'inperson' | 'video' | 'both';

interface TimeSlot {
  startTime: string;
  endTime: string;
}

const DoctorAvailabilityScreen = ({ navigation, route }: any) => {
  const [availabilityType, setAvailabilityType] = useState<AvailabilityType>('recurring');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { startTime: '09:00', endTime: '17:00' },
  ]);

  const [formData, setFormData] = useState({
    clinic: 'PRED CLINIC',
    specificDate: '',
    recurringDays: [] as string[],
    leaveStartDate: '',
    leaveEndDate: '',
    slotDuration: '30',
    consultationType: 'both' as ConsultationType,
    consultationFee: '',
    videoConsultationFee: '',
  });

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      recurringDays: prev.recurringDays.includes(day)
        ? prev.recurringDays.filter((d) => d !== day)
        : [...prev.recurringDays, day],
    }));
  };

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { startTime: '', endTime: '' }]);
  };

  const removeTimeSlot = (index: number) => {
    if (timeSlots.length > 1) {
      setTimeSlots(timeSlots.filter((_, i) => i !== index));
    }
  };

  const updateTimeSlot = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const updated = [...timeSlots];
    updated[index][field] = value;
    setTimeSlots(updated);
  };

  const handleSave = () => {
    // Validation
    if (availabilityType === 'recurring' && formData.recurringDays.length === 0) {
      Alert.alert('Error', 'Please select at least one day');
      return;
    }

    if (availabilityType === 'specific' && !formData.specificDate) {
      Alert.alert('Error', 'Please select a date');
      return;
    }

    if (availabilityType === 'leave' && (!formData.leaveStartDate || !formData.leaveEndDate)) {
      Alert.alert('Error', 'Please select leave dates');
      return;
    }

    // TODO: API call to save availability
    Alert.alert('Success', 'Availability saved successfully', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
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
        <Text style={styles.title}>Doctor Availability</Text>
        <Text style={styles.subtitle}>Manage your availability schedule</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          {/* Clinic Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Select Clinic <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.clinicCard}>
              <Text style={styles.clinicText}>{formData.clinic}</Text>
            </View>
          </View>

          {/* Availability Type Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Availability Type <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  availabilityType === 'specific' && styles.typeButtonActive,
                ]}
                onPress={() => setAvailabilityType('specific')}
              >
                <Text style={styles.typeButtonIcon}>📅</Text>
                <Text
                  style={[
                    styles.typeButtonText,
                    availabilityType === 'specific' && styles.typeButtonTextActive,
                  ]}
                >
                  Specific Date
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  availabilityType === 'recurring' && styles.typeButtonActive,
                ]}
                onPress={() => setAvailabilityType('recurring')}
              >
                <Text style={styles.typeButtonIcon}>🔄</Text>
                <Text
                  style={[
                    styles.typeButtonText,
                    availabilityType === 'recurring' && styles.typeButtonTextActive,
                  ]}
                >
                  Recurring
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  availabilityType === 'leave' && styles.typeButtonActive,
                ]}
                onPress={() => setAvailabilityType('leave')}
              >
                <Text style={styles.typeButtonIcon}>🚫</Text>
                <Text
                  style={[
                    styles.typeButtonText,
                    availabilityType === 'leave' && styles.typeButtonTextActive,
                  ]}
                >
                  Leave
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Specific Date Input */}
          {availabilityType === 'specific' && (
            <View style={styles.section}>
              <Text style={styles.label}>
                Select Date <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={formData.specificDate}
                onChangeText={(value) =>
                  setFormData({ ...formData, specificDate: value })
                }
              />
            </View>
          )}

          {/* Recurring Days Selection */}
          {availabilityType === 'recurring' && (
            <View style={styles.section}>
              <Text style={styles.label}>
                Select Days <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.daysGrid}>
                {fullDayNames.map((day, index) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      formData.recurringDays.includes(day) && styles.dayButtonActive,
                    ]}
                    onPress={() => handleDayToggle(day)}
                  >
                    <Text
                      style={[
                        styles.dayButtonText,
                        formData.recurringDays.includes(day) && styles.dayButtonTextActive,
                      ]}
                    >
                      {weekDays[index]}
                    </Text>
                    <Text
                      style={[
                        styles.dayButtonSubText,
                        formData.recurringDays.includes(day) && styles.dayButtonTextActive,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Leave Date Range */}
          {availabilityType === 'leave' && (
            <View style={styles.section}>
              <Text style={styles.label}>
                Leave Period <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.dateRangeContainer}>
                <View style={styles.dateInputGroup}>
                  <Text style={styles.dateLabel}>Start Date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={formData.leaveStartDate}
                    onChangeText={(value) =>
                      setFormData({ ...formData, leaveStartDate: value })
                    }
                  />
                </View>
                <View style={styles.dateInputGroup}>
                  <Text style={styles.dateLabel}>End Date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={formData.leaveEndDate}
                    onChangeText={(value) =>
                      setFormData({ ...formData, leaveEndDate: value })
                    }
                  />
                </View>
              </View>
            </View>
          )}

          {/* Time Slots (not for leave) */}
          {availabilityType !== 'leave' && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.label}>
                  Time Slots <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity onPress={addTimeSlot}>
                  <Text style={styles.addSlotText}>+ Add Slot</Text>
                </TouchableOpacity>
              </View>

              {timeSlots.map((slot, index) => (
                <View key={index} style={styles.timeSlotRow}>
                  <TextInput
                    style={[styles.input, styles.timeInput]}
                    placeholder="09:00"
                    value={slot.startTime}
                    onChangeText={(value) => updateTimeSlot(index, 'startTime', value)}
                  />
                  <Text style={styles.timeSeparator}>to</Text>
                  <TextInput
                    style={[styles.input, styles.timeInput]}
                    placeholder="17:00"
                    value={slot.endTime}
                    onChangeText={(value) => updateTimeSlot(index, 'endTime', value)}
                  />
                  {timeSlots.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeTimeSlot(index)}
                    >
                      <Text style={styles.removeButtonText}>🗑️</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Slot Duration (not for leave) */}
          {availabilityType !== 'leave' && (
            <View style={styles.section}>
              <Text style={styles.label}>
                Slot Duration <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.durationButtons}>
                {['15', '30', '45', '60'].map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    style={[
                      styles.durationButton,
                      formData.slotDuration === duration && styles.durationButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, slotDuration: duration })}
                  >
                    <Text
                      style={[
                        styles.durationButtonText,
                        formData.slotDuration === duration && styles.durationButtonTextActive,
                      ]}
                    >
                      {duration} min
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Consultation Type (not for leave) */}
          {availabilityType !== 'leave' && (
            <View style={styles.section}>
              <Text style={styles.label}>
                Consultation Type <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.consultationButtons}>
                <TouchableOpacity
                  style={[
                    styles.consultationButton,
                    formData.consultationType === 'inperson' && styles.consultationButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, consultationType: 'inperson' })}
                >
                  <Text
                    style={[
                      styles.consultationButtonText,
                      formData.consultationType === 'inperson' && styles.consultationButtonTextActive,
                    ]}
                  >
                    🏥 In-Person
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.consultationButton,
                    formData.consultationType === 'video' && styles.consultationButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, consultationType: 'video' })}
                >
                  <Text
                    style={[
                      styles.consultationButtonText,
                      formData.consultationType === 'video' && styles.consultationButtonTextActive,
                    ]}
                  >
                    📹 Video
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.consultationButton,
                    formData.consultationType === 'both' && styles.consultationButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, consultationType: 'both' })}
                >
                  <Text
                    style={[
                      styles.consultationButtonText,
                      formData.consultationType === 'both' && styles.consultationButtonTextActive,
                    ]}
                  >
                    💼 Both
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Consultation Fees (not for leave) */}
          {availabilityType !== 'leave' && (
            <View style={styles.section}>
              <Text style={styles.label}>Consultation Fees</Text>
              
              {(formData.consultationType === 'inperson' || formData.consultationType === 'both') && (
                <View style={styles.feeInputGroup}>
                  <Text style={styles.feeLabel}>In-Person Fee</Text>
                  <View style={styles.feeInputContainer}>
                    <Text style={styles.currencySymbol}>₹</Text>
                    <TextInput
                      style={styles.feeInput}
                      placeholder="0.00"
                      value={formData.consultationFee}
                      onChangeText={(value) =>
                        setFormData({ ...formData, consultationFee: value })
                      }
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              )}

              {(formData.consultationType === 'video' || formData.consultationType === 'both') && (
                <View style={styles.feeInputGroup}>
                  <Text style={styles.feeLabel}>Video Consultation Fee</Text>
                  <View style={styles.feeInputContainer}>
                    <Text style={styles.currencySymbol}>₹</Text>
                    <TextInput
                      style={styles.feeInput}
                      placeholder="0.00"
                      value={formData.videoConsultationFee}
                      onChangeText={(value) =>
                        setFormData({ ...formData, videoConsultationFee: value })
                      }
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Availability</Text>
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
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  required: {
    color: '#FF3B30',
  },
  clinicCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  clinicText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#E8F4FF',
  },
  typeButtonIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  typeButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: '#007AFF',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dayButton: {
    width: '13%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },
  dayButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#E8F4FF',
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  dayButtonSubText: {
    fontSize: 8,
    color: '#999',
    marginTop: 2,
  },
  dayButtonTextActive: {
    color: '#007AFF',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  dateInputGroup: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  addSlotText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  timeSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  timeInput: {
    flex: 1,
  },
  timeSeparator: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    padding: 10,
  },
  removeButtonText: {
    fontSize: 20,
  },
  durationButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  durationButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },
  durationButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#E8F4FF',
  },
  durationButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  durationButtonTextActive: {
    color: '#007AFF',
  },
  consultationButtons: {
    gap: 10,
  },
  consultationButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },
  consultationButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#E8F4FF',
  },
  consultationButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  consultationButtonTextActive: {
    color: '#007AFF',
  },
  feeInputGroup: {
    marginBottom: 15,
  },
  feeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  feeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingLeft: 12,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  feeInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 30,
    marginBottom: 20,
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
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default DoctorAvailabilityScreen;
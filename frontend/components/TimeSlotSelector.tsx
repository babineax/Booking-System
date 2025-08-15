import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useGetAvailableTimeSlotsQuery } from "../src/redux/apis/firebaseBookingsApiSlice";
import { useGetActiveServicesQuery } from "../src/redux/apis/firebaseServicesApiSlice";

type Props = {
  date: string;
  time: string;
  setTime: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
  serviceId: string;
  staffMemberId?: string;
};

const TimeSlotSelector = ({ date, time, setTime, onNext, onBack, serviceId, staffMemberId }: Props) => {
  
  const { data: services = [] } = useGetActiveServicesQuery({} as any);
  const selectedService = services.find((service: any) => service.id === serviceId);
  
 
  const defaultStaffId = staffMemberId || 
    (selectedService?.staffMembers?.[0]);
  
 
  console.log('TimeSlotSelector Debug:', {
    date: date ? new Date(date).toISOString().split('T')[0] : '',
    serviceId,
    defaultStaffId,
    selectedService: selectedService?.name,
    staffMembers: selectedService?.staffMembers
  });
  
  const { 
    data: slotsData = [], 
    isLoading: loading, 
    error 
  } = useGetAvailableTimeSlotsQuery(
    { 
      date: date ? new Date(date).toISOString().split('T')[0] : '', 
      serviceId, 
      staffMemberId: defaultStaffId 
    },
    { skip: !date || !serviceId || !defaultStaffId }
  );

  
  const slots = slotsData.map((slot: string) => {
    const time = new Date(`2000-01-01T${slot}`);
    return time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  });

  
  if (!defaultStaffId) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Pick a Time</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No staff members available for this service.</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onBack}
            style={[styles.button, styles.backButton]}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick a Time</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading available slots...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading time slots. Please try again.</Text>
        </View>
      ) : slots.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No available time slots for this date.</Text>
        </View>
      ) : (
        <FlatList
          data={slots}
          keyExtractor={(item) => item}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => {
            const isSelected = time === item;

            return (
              <TouchableOpacity
                onPress={() => setTime(item)}
                style={[
                  styles.timeSlot,
                  isSelected ? styles.selectedSlot : styles.unselectedSlot
                ]}
              >
                <Text style={[
                  styles.timeText,
                  isSelected ? styles.selectedText : styles.unselectedText
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={onBack}
          style={[styles.button, styles.backButton]}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!time}
          onPress={onNext}
          style={[
            styles.button,
            styles.nextButton,
            time ? styles.enabledNextButton : styles.disabledNextButton
          ]}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: '48%',
    borderWidth: 1,
    alignItems: 'center',
  },
  selectedSlot: {
    backgroundColor: '#2563eb',
    borderColor: '#1d4ed8',
  },
  unselectedSlot: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
  },
  timeText: {
    textAlign: 'center',
  },
  selectedText: {
    color: '#ffffff',
  },
  unselectedText: {
    color: '#000000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#d1d5db',
    marginRight: 8,
  },
  nextButton: {
    marginLeft: 8,
  },
  enabledNextButton: {
    backgroundColor: '#2563eb',
  },
  disabledNextButton: {
    backgroundColor: '#d1d5db',
  },
  backButtonText: {
    color: '#000000',
    fontWeight: '500',
  },
  nextButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default TimeSlotSelector;

import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";


type Service = {
  id?: string; 
  name: string;
  description?: string;
  duration?: number; 
  price?: number;
};

type Props = {
  service: string;
  setService: (id: string) => void;
  onNext: () => void;
  onBack?: () => void;
  services: Service[]; 
};

const ServiceSelector = ({ service, setService, onNext, onBack, services }: Props) => {
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Service</Text>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id || item.name}
        style={styles.list}
        renderItem={({ item }) => {
          const isSelected = service === item.id;

          return (
            <TouchableOpacity
              onPress={() => setService(item.id || '')}
              style={[
                styles.serviceItem,
                isSelected ? styles.selectedItem : styles.unselectedItem
              ]}
            >
              <Text
                style={[
                  styles.serviceName,
                  isSelected ? styles.selectedText : styles.unselectedText
                ]}
              >
                {item.name}
              </Text>
              {item.price && (
                <Text
                  style={[
                    styles.servicePrice,
                    isSelected ? styles.selectedText : styles.unselectedText
                  ]}
                >
                  KES {item.price}
                </Text>
              )}
            </TouchableOpacity>
          );
        }}
      />

      <View style={styles.buttonContainer}>
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            style={[styles.button, styles.backButton]}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          disabled={!service}
          onPress={onNext}
          style={[
            styles.button,
            styles.nextButton,
            onBack ? styles.buttonHalf : styles.buttonFull,
            !service && styles.disabledButton
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
    flex: 1,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  serviceItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  selectedItem: {
    backgroundColor: '#2563eb',
    borderColor: '#1d4ed8',
  },
  unselectedItem: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 14,
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
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#d1d5db',
    flex: 1,
    marginRight: 8,
  },
  nextButton: {
    backgroundColor: '#2563eb',
  },
  buttonFull: {
    flex: 1,
  },
  buttonHalf: {
    flex: 1,
    marginLeft: 8,
  },
  disabledButton: {
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

export default ServiceSelector;
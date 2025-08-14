
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useGetActiveServicesQuery } from '../src/redux/apis/firebaseServicesApiSlice';

const ServicesListScreen = ({ navigation }) => {
  const { 
    data: services, 
    isLoading, 
    error, 
    refetch 
  } = useGetActiveServicesQuery();

  const handleServicePress = (service) => {
    navigation.navigate('ServiceDetail', { serviceId: service.id });
  };

  const handleBookService = (service) => {
    navigation.navigate('Booking', { service });
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading services...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error loading services: {error.error}</Text>
        <TouchableOpacity
          onPress={refetch}
          style={{
            backgroundColor: '#007bff',
            padding: 10,
            borderRadius: 5,
            marginTop: 10,
          }}
        >
          <Text style={{ color: 'white' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderService = ({ item: service }) => (
    <View style={{
      backgroundColor: 'white',
      margin: 10,
      padding: 15,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }}>
      <TouchableOpacity onPress={() => handleServicePress(service)}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>
          {service.name}
        </Text>
        
        <Text style={{ color: '#666', marginBottom: 5 }}>
          {service.description}
        </Text>
        
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10 
        }}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>
            ${service.price}
          </Text>
          <Text style={{ color: '#666' }}>
            {service.duration} minutes
          </Text>
        </View>
        
        <Text style={{ 
          color: '#007bff', 
          backgroundColor: '#e7f3ff',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
          fontSize: 12,
          alignSelf: 'flex-start',
          marginBottom: 10
        }}>
          {service.category}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => handleBookService(service)}
        style={{
          backgroundColor: '#28a745',
          padding: 12,
          borderRadius: 5,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Book Now
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <Text style={{ 
        fontSize: 24, 
        fontWeight: 'bold', 
        padding: 20,
        textAlign: 'center' 
      }}>
        Our Services
      </Text>
      
      <FlatList
        data={services || []}
        renderItem={renderService}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ServicesListScreen;

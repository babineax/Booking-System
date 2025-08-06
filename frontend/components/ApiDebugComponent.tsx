import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useHealthCheckQuery } from '../src/redux/apis/healthApiSlice';
import { useGetServicesQuery } from '../src/redux/apis/servicesApiSlice';
import { useGetStaffMembersQuery } from '../src/redux/apis/usersApiSlice';

const ApiDebugComponent = () => {
  const { data: healthData, error: healthError, isLoading: healthLoading } = useHealthCheckQuery({});
  const { data: servicesData, error: servicesError, isLoading: servicesLoading } = useGetServicesQuery({});
  const { data: staffData, error: staffError, isLoading: staffLoading } = useGetStaffMembersQuery({});

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Debug Information</Text>
      
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Check</Text>
        {healthLoading ? <ActivityIndicator /> : (
          <>
            {healthError ? (
              <Text style={styles.error}>Error: {JSON.stringify(healthError)}</Text>
            ) : (
              <Text style={styles.success}>✓ Connected: {JSON.stringify(healthData)}</Text>
            )}
          </>
        )}
      </View>

      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services ({servicesData?.length || 0})</Text>
        {servicesLoading ? <ActivityIndicator /> : (
          <>
            {servicesError ? (
              <Text style={styles.error}>Error: {JSON.stringify(servicesError)}</Text>
            ) : (
              <Text style={styles.success}>
                ✓ Loaded: {servicesData?.map((s: any) => s.name).join(', ')}
              </Text>
            )}
          </>
        )}
      </View>

    
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Staff ({staffData?.length || 0})</Text>
        {staffLoading ? <ActivityIndicator /> : (
          <>
            {staffError ? (
              <Text style={styles.error}>Error: {JSON.stringify(staffError)}</Text>
            ) : (
              <Text style={styles.success}>
                ✓ Loaded: {staffData?.map((s: any) => `${s.firstName} ${s.lastName}`).join(', ')}
              </Text>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  success: {
    color: '#28a745',
    fontSize: 12,
  },
  error: {
    color: '#dc3545',
    fontSize: 12,
  },
});

export default ApiDebugComponent;

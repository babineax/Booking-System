// File: frontend/app/(staff)/edit-service.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import EditServiceForm from './components/EditServiceForm';

const EditServicePage = () => {
  return (
    <View style={styles.container}>
      <EditServiceForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
});

export default EditServicePage;

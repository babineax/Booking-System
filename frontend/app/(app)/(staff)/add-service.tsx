// File: frontend/app/(staff)/add-service.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import AddServiceForm from './components/AddServiceForm'; 

const AddServicePage = () => {
  return (
    <View style={styles.container}>
      <AddServiceForm />
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

export default AddServicePage;

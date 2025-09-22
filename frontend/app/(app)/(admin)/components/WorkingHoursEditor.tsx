import React from 'react';
import { View, Text, StyleSheet, Switch, TextInput } from 'react-native';

// Define the structure of the working hours data
export interface DayAvailability {
  isWorking: boolean;
  startTime: string;
  endTime: string;
}

export interface WorkingHours {
  [key: string]: DayAvailability;
}

interface WorkingHoursEditorProps {
  workingHours: WorkingHours;
  onUpdate: (day: string, updates: Partial<DayAvailability>) => void;
}

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const WorkingHoursEditor: React.FC<WorkingHoursEditorProps> = ({ workingHours, onUpdate }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Working Hours</Text>
      {DAYS_OF_WEEK.map(day => {
        const dayData = workingHours[day] || { isWorking: false, startTime: '09:00', endTime: '17:00' };
        return (
          <View key={day} style={styles.dayContainer}>
            <Text style={styles.dayLabel}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
            <View style={styles.controls}>
              <Switch
                value={dayData.isWorking}
                onValueChange={(isWorking) => onUpdate(day, { isWorking })}
              />
              {dayData.isWorking && (
                <View style={styles.timeContainer}>
                  <TextInput 
                    style={styles.timeInput} 
                    value={dayData.startTime} 
                    onChangeText={(startTime) => onUpdate(day, { startTime })} 
                    placeholder="09:00"
                  />
                  <Text> - </Text>
                  <TextInput 
                    style={styles.timeInput} 
                    value={dayData.endTime} 
                    onChangeText={(endTime) => onUpdate(day, { endTime })}
                    placeholder="17:00"
                  />
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  dayLabel: {
    fontSize: 16,
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 60,
    textAlign: 'center',
  },
});

export default WorkingHoursEditor;

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { useURL } from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { staffService } from "../../../firebase/services/staffService";

import StaffServiceSelector from "./components/StaffServiceSelector";
import WorkingHoursEditor, {
  WorkingHours,
} from "./components/WorkingHoursEditor";

import { User } from "../../../firebase/types";

// --- PLACEHOLDER ---
const GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID_HERE";
const REDIRECT_URI = Linking.createURL("");

// React Query hook for fetching staff member
const useStaffMember = (staffId?: string) => {
  return useQuery<User | null, Error>({
    queryKey: ["staffMember", staffId],
    queryFn: () => (staffId ? staffService.getStaffById(staffId) : null),
    enabled: !!staffId,
  });
};

export default function EditStaffScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { staffId } = useLocalSearchParams<{ staffId?: string }>();

  const { data: staffMember, isLoading } = useStaffMember(staffId);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [workingHours, setWorkingHours] = useState<WorkingHours>({});

  const isEditMode = !!staffId;

  // preload staff data if editing
  useEffect(() => {
    if (staffMember) {
      setFirstName(staffMember.firstName || "");
      setLastName(staffMember.lastName || "");
      setEmail(staffMember.email || "");
      setPhone(staffMember.phone || "");
      setBio(staffMember.bio || "");
      setServiceIds(staffMember.serviceIds || []);
      setWorkingHours(
        staffMember.workingHours || {
          monday: { isWorking: false, startTime: "09:00", endTime: "17:00" },
          tuesday: { isWorking: false, startTime: "09:00", endTime: "17:00" },
          wednesday: { isWorking: false, startTime: "09:00", endTime: "17:00" },
          thursday: { isWorking: false, startTime: "09:00", endTime: "17:00" },
          friday: { isWorking: false, startTime: "09:00", endTime: "17:00" },
          saturday: { isWorking: false, startTime: "09:00", endTime: "17:00" },
          sunday: { isWorking: false, startTime: "09:00", endTime: "17:00" },
        }
      );
    }
  }, [staffMember]);

  // service toggler
  const handleToggleService = (serviceId: string) => {
    setServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // working hours updater
  const handleUpdateWorkingHours = (day: string, updates: any) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], ...updates },
    }));
  };

  // ✅ updateStaff mutation
  const { mutate: updateStaff, isPending: isUpdating } = useMutation<
    User,
    Error,
    Partial<User>
  >({
    mutationFn: (updates) => staffService.updateStaff(staffId!, updates),
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Staff Updated" });
      queryClient.invalidateQueries({ queryKey: ["staffMembers"] });
      queryClient.invalidateQueries({ queryKey: ["staffMember", staffId] });
      setTimeout(() => {
        router.back();
      }, 500);
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: error.message,
      });
    },
  });

  // ✅ createStaff mutation
  const { mutate: createStaff, isPending: isCreating } = useMutation<
    User,
    Error,
    Omit<User, "id">
  >({
    mutationFn: (newData) => staffService.createStaff(newData as any),
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Staff Created" });
      queryClient.invalidateQueries({ queryKey: ["staffMembers"] });
      setTimeout(() => {
        router.back();
      }, 500);
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Creation Failed",
        text2: error.message,
      });
    },
  });

  // Google connect
  const handleGoogleConnect = async () => {
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(
        "https://www.googleapis.com/auth/calendar"
      )}` +
      `&access_type=offline` +
      `&prompt=consent`;

    await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);
  };

  const isGoogleConnected = !!staffMember?.googleAuth?.refreshToken;

  const { mutate: exchangeCode } = useMutation<
    any,
    Error,
    { code: string; staffId: string }
  >({
    mutationFn: (vars) => {
      const handleGoogleAuthCallback = httpsCallable(
        getFunctions(),
        "handleGoogleAuthCallback"
      );
      return handleGoogleAuthCallback(vars);
    },
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Google Calendar Connected!" });
      queryClient.invalidateQueries({ queryKey: ["staffMember", staffId] });
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Connection Failed",
        text2: error.message,
      });
    },
  });

  const url = useURL();

  useEffect(() => {
    if (url) {
      const { queryParams } = Linking.parse(url);
      if (queryParams?.code && staffId) {
        WebBrowser.dismissAuthSession();
        exchangeCode({ code: queryParams.code as string, staffId });
      }
    }
  }, [url, staffId]);

  // save handler
  const handleSave = () => {
    if (!firstName || !lastName || !email) {
      Alert.alert("Error", "First name, last name, and email are required.");
      return;
    }

    const staffData = {
      firstName,
      lastName,
      email,
      phone,
      bio,
      serviceIds,
      workingHours,
      role: "staff" as const,
    };

    if (isEditMode) {
      updateStaff(staffData);
    } else {
      createStaff(staffData as any);
    }
  };

  if (isLoading && isEditMode) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>
          {isEditMode ? "Edit Staff Member" : "Add New Staff"}
        </Text>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={[styles.input, isEditMode && styles.disabledInput]}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isEditMode}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            multiline
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
          />
        </View>

        <StaffServiceSelector
          selectedServiceIds={serviceIds}
          onToggleService={handleToggleService}
        />

        <WorkingHoursEditor
          workingHours={workingHours}
          onUpdate={handleUpdateWorkingHours}
        />

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Integrations</Text>
          <View style={styles.integrationRow}>
            <Text style={styles.integrationLabel}>Google Calendar</Text>
            {isGoogleConnected ? (
              <Text style={styles.connectedText}>Connected</Text>
            ) : (
              <Button title="Connect" onPress={handleGoogleConnect} />
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title={isEditMode ? "Save Changes" : "Create Staff Member"}
          onPress={handleSave}
          disabled={isUpdating || isCreating}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollContainer: { padding: 16, paddingBottom: 100 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  formSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 16,
    marginBottom: 12,
  },
  disabledInput: {
    backgroundColor: "#E5E7EB",
    color: "#9CA3AF",
  },
  integrationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  integrationLabel: {
    fontSize: 16,
  },
  connectedText: {
    fontSize: 16,
    color: "#34C759",
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },
});

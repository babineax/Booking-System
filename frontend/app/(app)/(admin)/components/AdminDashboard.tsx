import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useGetClients } from "../../../../features/clients/hooks/useGetClients";
import { useGetStaff } from "../../../../features/staff/hooks/useGetStaff";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: clients = [], isLoading: clientsLoading } = useGetClients();
  const { data: staff = [], isLoading: staffLoading } = useGetStaff();

  const menuItems = [
    {
      title: "Manage Clients",
      path: "/(app)/(admin)/clients",
      count: clients.length,
      icon: "👥",
      description: "View, add, edit, and delete client records",
    },
    {
      title: "Manage Staff",
      path: "/(app)/(admin)/staff",
      count: staff.length,
      icon: "👨‍💼",
      description: "View, add, edit, and delete staff members",
    },
    {
      title: "View Bookings",
      path: "/(app)/(admin)/bookings",
      count: 0,
      icon: "📅",
      description: "View and manage all bookings",
    },
    {
      title: "Developer Tools",
      path: "/(app)/(admin)/dev-tools",
      count: 0,
      icon: "🔧",
      description: "Database seeding and debugging tools",
    },
  ];

  return (
    <View>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{clients.length}</Text>
          <Text style={styles.statLabel}>Total Clients</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{staff.length}</Text>
          <Text style={styles.statLabel}>Staff Members</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => router.push(item.path)}
          >
            <View style={styles.menuItemHeader}>
              <Text style={styles.menuItemIcon}>{item.icon}</Text>
              <View style={styles.menuItemTextContainer}>
                <Text style={styles.menuItemText}>{item.title}</Text>
                {item.count > 0 && (
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{item.count}</Text>
                  </View>
                )}
              </View>
            </View>
            <Text style={styles.menuItemDescription}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  menuItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  menuItemIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  menuItemTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  countBadge: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: "center",
  },
  countText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  menuItemDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 36,
  },
});

import { Link, Tabs } from "expo-router";
import React from "react";
import { Platform, Text, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Ionicons } from "@expo/vector-icons";
import { SettingsIcon } from "lucide-react-native";

export default function TabLayout() {
  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#5B5AF1", // Bright yellow for active tabs
          tabBarInactiveTintColor: "#31343873", // Light gray for inactive tabs
          headerShown: true,
          headerStyle: {
            backgroundColor: "#5B5AF1", // Dark background
            // borderBottomWidth: 0.5,
            // borderBottomColor: "#31343873",
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleStyle: {
            fontSize: 17,
            fontWeight: "600",
            color: "grey", // Light gray text
          },
          headerTitleAlign: "center",
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            backgroundColor: "white", // Dark background
            borderTopWidth: 0.5,
            borderTopColor: "#31343873",
            height: Platform.OS === "ios" ? 83 : 75,
            paddingBottom: Platform.OS === "ios" ? 34 : 0,
            paddingTop: 8,
            position: Platform.OS === "ios" ? "absolute" : "relative",
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "500",
            marginTop: 2,
          },
          tabBarIconStyle: {
            marginBottom: 2,
          },
        }}
      >
        <Tabs.Screen
          name="calls"
          options={{
            title: "Calls",
            headerLeft: () => (
              <View style={{ marginLeft: 16 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    color: "#3134387373", // Light gray text
                  }}
                >
                  Carsle
                </Text>
              </View>
            ),
            headerTitle: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Link href={"/(tabs)/notifications"}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: "#5B5AF1", // Bright yellow background
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 8,
                    }}
                  >
                    <Ionicons name="home" size={18} color="#030712" />
                  </View>
                </Link>
              </View>
            ),
            headerRight: () => (
              <View
                style={{
                  marginRight: 16,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Link href={"/(tabs)/notifications"}>
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color="#31343873"
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: -2,
                      right: -2,
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#5B5AF1", // Bright yellow notification dot
                    }}
                  />
                </Link>
                <Link href={"/(tabs)/settings"}>
                  <SettingsIcon
                    size={20}
                    color="#31343873"
                    style={{ marginLeft: 16 }}
                  />
                </Link>
              </View>
            ),
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: focused ? "#cfcbf5ff" : "transparent",
                  padding: 4,
                  borderRadius: 8,
                  marginBottom: 2,
                }}
              >
                <Ionicons
                  size={22}
                  name={focused ? "call-outline" : "call-outline"}
                  color={focused ? "#5B5AF1" : "#31343873"}
                  backgroundColor={focused ? "#5B5AF1" : "transparent"}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: "Explore",
            headerLeft: () => (
              <View style={{ marginLeft: 16 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    color: "#31343873", // Light gray text
                  }}
                >
                  Carsle
                </Text>
              </View>
            ),
            headerTitle: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Link href={"/(tabs)/notifications"}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: "#5B5AF1", // Bright yellow background
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 8,
                    }}
                  >
                    <Ionicons name="home" size={18} color="#030712" />
                  </View>
                </Link>
              </View>
            ),
            headerRight: () => (
              <View
                style={{
                  marginRight: 16,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Link href={"/(tabs)/notifications"}>
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color="#31343873"
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: -2,
                      right: -2,
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#5B5AF1", // Bright yellow notification dot
                    }}
                  />
                </Link>
                <Link href={"/(tabs)/settings"}>
                  <SettingsIcon
                    size={20}
                    color="#31343873"
                    style={{ marginLeft: 16 }}
                  />
                </Link>
              </View>
            ),
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: focused ? "#cfcbf5ff" : "transparent",
                  padding: 4,
                  borderRadius: 8,
                  marginBottom: 2,
                }}
              >
                <Ionicons
                  size={22}
                  name={focused ? "compass-outline" : "compass-outline"}
                  color={focused ? "#5B5AF1" : "#31343873"}
                />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            headerLeft: () => (
              <View style={{ marginLeft: 16 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    color: "#31343873", // Light gray text
                  }}
                >
                  Carsle
                </Text>
              </View>
            ),
            headerTitle: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Link href={"/(tabs)/notifications"}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: "#5B5AF1", // Bright yellow background
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 8,
                    }}
                  >
                    <Ionicons name="search" size={18} color="#030712" />
                  </View>
                </Link>
              </View>
            ),
            headerRight: () => (
              <View
                style={{
                  marginRight: 16,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Link href={"/(tabs)/notifications"}>
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color="#31343873"
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: -2,
                      right: -2,
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#5B5AF1", // Bright yellow notification dot
                    }}
                  />
                </Link>
                <Link href={"/(tabs)/settings"}>
                  <SettingsIcon
                    size={20}
                    color="#31343873"
                    style={{ marginLeft: 16 }}
                  />
                </Link>
              </View>
            ),
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: focused ? "#cfcbf5ff" : "transparent",
                  padding: 4,
                  borderRadius: 8,
                  marginBottom: 2,
                }}
              >
                <Ionicons
                  size={22}
                  name={focused ? "search" : "search-outline"}
                  color={focused ? "#5B5AF1" : "#31343873"}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="schedule"
          options={{
            title: "Schedule",
            headerLeft: () => (
              <View style={{ marginLeft: 16 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    color: "#31343873", // Light gray text
                  }}
                >
                  Carsle
                </Text>
              </View>
            ),
            headerTitle: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Link href={"/(tabs)/notifications"}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: "#5B5AF1", // Bright yellow background
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 8,
                    }}
                  >
                    <Ionicons name="calendar" size={18} color="#030712" />
                  </View>
                </Link>
              </View>
            ),
            headerRight: () => (
              <View
                style={{
                  marginRight: 16,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Link href={"/(tabs)/notifications"}>
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color="#31343873"
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: -2,
                      right: -2,
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#5B5AF1", // Bright yellow notification dot
                    }}
                  />
                </Link>
                <Link href={"/(tabs)/settings"}>
                  <SettingsIcon
                    size={20}
                    color="#31343873"
                    style={{ marginLeft: 16 }}
                  />
                </Link>
              </View>
            ),
            tabBarIcon: ({ color, focused }) => (
               <View style={{ alignItems: "center", backgroundColor: focused ? "#cfcbf5ff" : "transparent", padding: 4, borderRadius: 8, marginBottom: 2 }}>
              <Ionicons
                size={22}
                name={focused ? "calendar-outline" : "calendar-outline"}
                color={focused ? "#5B5AF1" : "#31343873"}
              />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: "Messages",
            headerLeft: () => (
              <View style={{ marginLeft: 16 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    color: "#31343873", // Light gray text
                  }}
                >
                  Carsle
                </Text>
              </View>
            ),
            headerTitle: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Link href={"/(tabs)/notifications"}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: "#5B5AF1", // Bright yellow background
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 8,
                    }}
                  >
                    <Ionicons name="chatbubble" size={18} color="#030712" />
                  </View>
                </Link>
              </View>
            ),
            headerRight: () => (
              <View
                style={{
                  marginRight: 16,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Link href={"/(tabs)/notifications"}>
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color="#31343873"
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: -2,
                      right: -2,
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#5B5AF1", // Bright yellow notification dot
                    }}
                  />
                </Link>
                <Link href={"/(tabs)/settings"}>
                  <SettingsIcon
                    size={20}
                    color="#31343873"
                    style={{ marginLeft: 16 }}
                  />
                </Link>
              </View>
            ),
            tabBarIcon: ({ color, focused }) => (
               <View style={{ alignItems: "center", backgroundColor: focused ? "#cfcbf5ff" : "transparent", padding: 4, borderRadius: 8, marginBottom: 2 }}>
              <Ionicons
                size={22}
                name={focused ? "chatbubble-outline" : "chatbubble-outline"}
                color={focused ? "#5B5AF1" : "#31343873"}
              /></View>
            ),
          }}
        />
        <Tabs.Screen
          name="(wallet)/index"
          options={{
            title: "Wallet",
            headerLeft: () => (
              <View style={{ marginLeft: 16 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    color: "#31343873", // Light gray text
                  }}
                >
                  Carsle
                </Text>
              </View>
            ),
            headerTitle: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Link href={"/(tabs)/notifications"}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: "#5B5AF1", // Bright yellow background
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 8,
                    }}
                  >
                    <Ionicons name="wallet" size={18} color="#030712" />
                  </View>
                </Link>
              </View>
            ),
            headerRight: () => (
              <View
                style={{
                  marginRight: 16,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Link href={"/(tabs)/notifications"}>
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color="#31343873"
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: -2,
                      right: -2,
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#5B5AF1", // Bright yellow notification dot
                    }}
                  />
                </Link>
                <Link href={"/(tabs)/settings"}>
                  <SettingsIcon
                    size={20}
                    color="#31343873"
                    style={{ marginLeft: 16 }}
                  />
                </Link>
              </View>
            ),
            tabBarIcon: ({ color, focused }) => (
               <View style={{ alignItems: "center", backgroundColor: focused ? "#cfcbf5ff" : "transparent", padding: 4, borderRadius: 8, marginBottom: 2 }}>
              <Ionicons
                size={22}
                name={focused ? "wallet-outline" : "wallet-outline"}
                color={focused ? "#5B5AF1" : "#31343873"}
              /></View>
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="chatroom"
          options={{
            href: null,
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="expertDetail"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="videoConsultultation"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="startConsultationScreen"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="messageSettingsScreen"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="(wallet)/add-funds"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="(wallet)/payScreen"
          options={{
            href: null,
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="(wallet)/transactions"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="(wallet)/transferScreen"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="(wallet)/withdraw"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="chatroom/[id]"
          options={{
            href: null,
            headerShown: false,
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}

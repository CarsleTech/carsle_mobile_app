import { Link, Tabs } from "expo-router";
import React from "react";
import { Platform, View, Text } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function TabLayout() {
  return (
    <ProtectedRoute>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FCDF03", // Bright yellow for active tabs
        tabBarInactiveTintColor: "#E5E7EB", // Light gray for inactive tabs
        headerShown: true,
        headerStyle: {
          backgroundColor: "#030712", // Dark background
          borderBottomWidth: 0.5,
          borderBottomColor: "#E5E7EB",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontSize: 17,
          fontWeight: "600",
          color: "#E5E7EB", // Light gray text
        },
        headerTitleAlign: "center",
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: "#030712", // Dark background
          borderTopWidth: 0.5,
          borderTopColor: "#E5E7EB",
          height: Platform.OS === "ios" ? 83 : 65,
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
        name="index"
        options={{
          title: "Home",
          headerLeft: () => (
            <View style={{ marginLeft: 16 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "600",
                  color: "#E5E7EB", // Light gray text
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
                  backgroundColor: "#FCDF03", // Bright yellow background
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 8,
                }}
              >
                <Ionicons name="home" size={18} color="#030712" />
              </View></Link>
            </View>
          ),
          headerRight: () => (
            <View style={{ marginRight: 16 }}>
              <Link href={"/(tabs)/notifications"}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#E5E7EB"
              />
              <View
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#FCDF03", // Bright yellow notification dot
                }}
              /></Link>
            </View>
          ),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={22}
              name={focused ? "home" : "home-outline"}
              color={focused ? "#FCDF03" : "#E5E7EB"}
            />
          ),
        }}
      />
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
                  color: "#E5E7EB", // Light gray text
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
                  backgroundColor: "#FCDF03", // Bright yellow background
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 8,
                }}
              >
                <Ionicons name="call" size={18} color="#030712" />
              </View></Link>
            </View>
          ),
          headerRight: () => (
            <View style={{ marginRight: 16 }}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#E5E7EB"
              />
              <View
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#FCDF03", // Bright yellow notification dot
                }}
              />
            </View>
          ),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={22}
              name={focused ? "call" : "call-outline"}
              color={focused ? "#FCDF03" : "#E5E7EB"}
            />
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
                  color: "#E5E7EB", // Light gray text
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
                  backgroundColor: "#FCDF03", // Bright yellow background
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 8,
                }}
              >
                <Ionicons name="search" size={18} color="#030712" />
              </View></Link>
            </View>
          ),
          headerRight: () => (
            <View style={{ marginRight: 16 }}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#E5E7EB"
              />
              <View
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#FCDF03", // Bright yellow notification dot
                }}
              />
            </View>
          ),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={22}
              name={focused ? "search" : "search-outline"}
              color={focused ? "#FCDF03" : "#E5E7EB"}
            />
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
                  color: "#E5E7EB", // Light gray text
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
                  backgroundColor: "#FCDF03", // Bright yellow background
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 8,
                }}
              >
                <Ionicons name="calendar" size={18} color="#030712" />
              </View></Link>
            </View>
          ),
          headerRight: () => (
            <View style={{ marginRight: 16 }}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#E5E7EB"
              />
              <View
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#FCDF03", // Bright yellow notification dot
                }}
              />
            </View>
          ),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={22}
              name={focused ? "calendar" : "calendar-outline"}
              color={focused ? "#FCDF03" : "#E5E7EB"}
            />
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
                  color: "#E5E7EB", // Light gray text
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
                  backgroundColor: "#FCDF03", // Bright yellow background
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 8,
                }}
              >
                <Ionicons name="chatbubble" size={18} color="#030712" />
              </View></Link>
            </View>
          ),
          headerRight: () => (
            <View style={{ marginRight: 16 }}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#E5E7EB"
              />
              <View
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#FCDF03", // Bright yellow notification dot
                }}
              />
            </View>
          ),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={22}
              name={focused ? "chatbubble" : "chatbubble-outline"}
              color={focused ? "#FCDF03" : "#E5E7EB"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          headerLeft: () => (
            <View style={{ marginLeft: 16 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "600",
                  color: "#E5E7EB", // Light gray text
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
                  backgroundColor: "#FCDF03", // Bright yellow background
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 8,
                }}
              >
                <Ionicons name="wallet" size={18} color="#030712" />
              </View></Link>
            </View>
          ),
          headerRight: () => (
            <View style={{ marginRight: 16 }}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#E5E7EB"
              />
              <View
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#FCDF03", // Bright yellow notification dot
                }}
              />
            </View>
          ),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={22}
              name={focused ? "wallet" : "wallet-outline"}
              color={focused ? "#FCDF03" : "#E5E7EB"}
            />
          ),
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
        }}
      />
    </Tabs></ProtectedRoute>
  );
}

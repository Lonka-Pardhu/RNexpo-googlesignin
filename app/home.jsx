import { View, Text, SafeAreaView, Button, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { getUser, removeUser } from "../utils/storage";

const home = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await getUser();
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await removeUser();
    router.replace("/");
  };
  return (
    <SafeAreaView>
      <View className="flex-1 justify-center items-center">
        {user ? (
          <View>
            <Image source={{ uri: user.photo }} />
            <Text>{user.name}</Text>
            <Text>{user.email}</Text>
            <Button title="Logout" onPress={handleLogout} />
          </View>
        ) : (
          <Text>Loading user data...</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default home;

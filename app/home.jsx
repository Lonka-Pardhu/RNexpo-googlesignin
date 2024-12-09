import { View, Text, SafeAreaView, Button, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { getUser, removeUser } from "../utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const home = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        setUser(JSON.parse(user));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      router.replace("/");
    } catch (error) {
      console.warn("err removing user");
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center items-center">
        {user ? (
          <View className="items-center">
            <Image
              source={{ uri: user.photo }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <Text className=" text-black">{user.name}</Text>
            <Text className=" text-black">{user.email}</Text>
            <Button title="logout" onPress={handleLogout} />
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default home;

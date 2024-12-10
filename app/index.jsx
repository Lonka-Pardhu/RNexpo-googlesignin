import { View, Text, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { signIn } from "../services/auth";
import { Redirect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID, // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
  scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  forceCodeForRefreshToken: false, // [Android] related to `serverAuthCode`, read the docs link below *.
  iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID, // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  // hostedDomain: "", // specifies a hosted domain restriction
  // accountName: "", // [Android] specifies an account name on the device that should be used
  // googleServicePlistPath: "", // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. "GoogleService-Info-Staging"
  // openIdRealm: "", // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
  // profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});

const Index = () => {
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

  const handleSignin = async () => {
    try {
      const response = await signIn();
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
      router.push("/home");
    } catch (error) {
      console.log(error);
    }
  };

  if (user) {
    return <Redirect href={"/home"} />;
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center items-center">
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={handleSignin}
        />
      </View>
    </SafeAreaView>
  );
};
export default Index;

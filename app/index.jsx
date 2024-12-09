import { View, Text, SafeAreaView } from "react-native";
import React from "react";

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { signIn } from "../components/auth";
import { useRouter } from "expo-router";
import { storeUser } from "../utils/storage";

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

  const handleSignIn = async () => {
    const response = await signIn();

    if (response) {
      console.log(JSON.stringify(response.data.user));
      await storeUser(JSON.stringify(response.data.user));

      router.replace("/home");
    } else {
      console.warn("Sign-In failed:", response.error);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center items-center">
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={handleSignIn}
        />
      </View>
    </SafeAreaView>
  );
};
export default Index;

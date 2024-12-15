// auth.ts
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "../services/supabase";
import {
  CryptoDigestAlgorithm,
  digestStringAsync,
  randomUUID,
} from "expo-crypto";

export const getNonce = async () => {
  const nonce = randomUUID(); // Generate a unique random string
  const nonceDigest = await digestStringAsync(
    CryptoDigestAlgorithm.SHA256,
    nonce
  ); // Hash it using SHA-256
  return { nonce, nonceDigest };
};

export const signIn = async () => {
  try {
    await GoogleSignin.hasPlayServices(); // Check if Play Services are available
    const { nonce, nonceDigest } = await getNonce(); // Get nonce and its digest

    // Pass the hashed nonce to Google Sign-In
    const response = await GoogleSignin.signIn({ nonce: nonceDigest });

    if (response?.data.idToken) {
      // Pass the raw nonce to Supabase
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.data.idToken,
        nonce: nonce, // Raw nonce must be passed here
      });

      if (error) {
        console.error("Supabase Sign-In Error:", error);
      } else {
        console.log("User signed in successfully:", data.user);
      }
    } else {
      throw new Error("No ID token present!");
    }

    return response;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.warn("Sign-in process was canceled by the user.");
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.warn("Sign-in is already in progress.");
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.warn("Google Play Services not available.");
    } else {
      console.warn("An unknown error occurred during sign-in.");
    }
    return { success: false, error };
  }
};

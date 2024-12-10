import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "../services/supabase";

export const signIn = async () => {
  try {
    // Ensuring Google Play Services are available
    await GoogleSignin.hasPlayServices();

    const response = await GoogleSignin.signIn();
    if (response.data.idToken) {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.data.idToken,
      });
    } else {
      throw new Error("no ID token present!");
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

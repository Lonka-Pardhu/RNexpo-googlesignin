import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

export const signIn = async () => {
  try {
    // Ensuring Google Play Services are available
    await GoogleSignin.hasPlayServices();

    const response = await GoogleSignin.signIn();
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

// utils/getNonce.ts
import { digestStringAsync, CryptoDigestAlgorithm } from "expo-crypto";
import * as Crypto from "expo-crypto";

function getUrlSafeNonce(byteLength = 32) {
  if (byteLength < 1) {
    throw new Error("Byte length must be positive");
  }

  const randomBytes = Crypto.getRandomValues(new Uint8Array(byteLength));
  return btoa(String.fromCharCode(...randomBytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/[=]/g, "");
}

export const getNonce = async () => {
  try {
    // Generate raw nonce
    const rawNonce = getUrlSafeNonce();

    // Create nonce digest
    const nonceDigest = await digestStringAsync(
      CryptoDigestAlgorithm.SHA256,
      rawNonce
    );

    return {
      rawNonce,
      nonceDigest,
    };
  } catch (error) {
    console.error("Nonce Generation Error:", error);
    throw error;
  }
};

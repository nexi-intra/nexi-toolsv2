export function base64UrlDecode(base64Url: string): string {
  // Replace URL-safe characters to regular Base64 characters
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

  // Pad the string with "=" to make its length a multiple of 4 (necessary for decoding)
  while (base64.length % 4) {
    base64 += "=";
  }

  // Decode the Base64 string
  const decoded = atob(base64); // atob is a built-in browser function
  return decoded;
}

export function decodeJwtToken(token: string): Record<string, any> {
  // Split the token into 3 parts: Header, Payload, Signature
  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid JWT token");
  }

  // Decode the payload (second part)
  const payload = parts[1];

  // Decode from Base64URL to string
  const decodedPayload = base64UrlDecode(payload);

  // Parse the decoded string to an object
  const parsedPayload = JSON.parse(decodedPayload);

  return parsedPayload;
}

export function checkToken(token: string, clientId: string): boolean {
  if (!token) {
    console.log("No token");
    return false;
  }

  const decodeToken = decodeJwtToken(token);
  // Usage Example
  //const token = 'YOUR_JWT_TOKEN_HERE';

  if (clientId !== decodeToken.appid) {
    console.log("Wrong app id", decodeToken);
    return false;
  }
  if (decodeToken.exp && decodeToken.exp < Date.now() / 1000) {
    console.log("Token expired", decodeToken);
    return false;
  }
  return true;
}

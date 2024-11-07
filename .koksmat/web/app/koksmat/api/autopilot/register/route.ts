import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

// Microsoft's common JWKS endpoint
const msftJwksUri =
  "https://login.microsoftonline.com/common/discovery/v2.0/keys";

// JWKS client for verifying JWT signatures
const client = jwksClient({
  jwksUri: msftJwksUri,
});

interface RegistrationData {
  key: string;
  clientSecret: string;
}

// Function to get the signing key
const getSigningKey = (
  header: jwt.JwtHeader,
  callback: jwt.SigningKeyCallback
) => {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.getPublicKey();
    callback(err, signingKey);
  });
};

// Function to verify the JWT token
const verifyToken = (token: string): Promise<jwt.JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getSigningKey,
      // {
      //   algorithms: ["RS256"],
      //   issuer: /^https:\/\/login\.microsoftonline\.com\/.*\/v2\.0$/,
      // },
      (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded as jwt.JwtPayload);
        }
      }
    );
  });
};

export async function POST(request: NextRequest) {
  // Extract the Bearer token from the Authorization header
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing or invalid Authorization header" },
      { status: 401 }
    );
  }
  const token = authHeader.split(" ")[1];

  let decodedToken: jwt.JwtPayload;
  try {
    // Verify and decode the JWT token
    decodedToken = await verifyToken(token);
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Extract UPN from the token
  const upn = decodedToken.upn;
  if (!upn) {
    return NextResponse.json(
      { error: "UPN not found in token" },
      { status: 400 }
    );
  }

  // Parse the request body
  let data: RegistrationData;
  try {
    data = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  // Validate the registration data
  if (!data.key || !data.clientSecret) {
    return NextResponse.json(
      { error: "Missing key or clientSecret" },
      { status: 400 }
    );
  }

  // Here you would typically:
  // 1. Check if the client is already registered
  // 2. Store the client information in your database
  // 3. Generate a unique identifier for this registration

  // For this example, we'll just simulate a successful registration
  const registrationId = `reg_${Math.random().toString(36).substr(2, 9)}`;

  // In a real-world scenario, you might want to return more information
  // or perform additional actions here
  return NextResponse.json(
    {
      message: "Registration successful",
      registrationId: registrationId,
      upn: upn,
    },
    {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

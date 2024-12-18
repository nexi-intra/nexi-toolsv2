import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken"; // Use any JWT library for token decoding

export async function middleware(request: NextRequest) {
  // Get the caller's IP address
  const ip = request.ip || "IP not available";

  // Log the request method, path, and IP address
  console.log(`[${request.method}] ${request.nextUrl.pathname} - IP: ${ip}`);

  // // Extract and decode the user's authentication token (if present)
  // const authHeader = request.headers.get("authorization");
  // let userEmail = "Unknown";
  // let userTokenDetails = "No token provided";

  // if (authHeader && authHeader.startsWith("Bearer ")) {
  //   const token = authHeader.split(" ")[1];
  //   userTokenDetails = token;

  //   try {
  //     // Decode the token
  //     const decodedToken = jwt.decode(token);
  //     if (decodedToken && typeof decodedToken === "object") {
  //       userEmail =
  //         decodedToken.email || decodedToken.preferred_username || "Unknown";
  //       console.log(
  //         "Decoded token details:",
  //         JSON.stringify(decodedToken, null, 2)
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error decoding JWT token:", error);
  //   }
  // } else {
  //   console.log("No Authorization header or Bearer token provided");
  // }

  // // Log user information
  // console.log(`Authenticated user email: ${userEmail}`);
  // console.log(`Raw token: ${userTokenDetails}`);

  // Detect potential bot activity
  const SHOWBODY = false;
  const userAgent = request.headers.get("user-agent") || "Unknown";
  const botKeywords = [
    "bot",
    "spider",
    "crawl",
    "facebookexternalhit",
    "WhatsApp",
    "Slackbot",
    "Twitterbot",
    "LinkedInBot",
    "BingPreview",
  ];

  const isBot = botKeywords.some((keyword) =>
    userAgent.toLowerCase().includes(keyword)
  );

  // Check if the request has a body
  if (request.body) {
    const contentType = request.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      try {
        // Clone the request to read its body
        const reqClone = request.clone();
        const body = await reqClone.json();
        if (SHOWBODY)
          console.log("Request body (JSON):", JSON.stringify(body, null, 2));
      } catch (error) {
        console.error("Error parsing JSON body:", error);
      }
    } else if (contentType?.includes("application/x-www-form-urlencoded")) {
      try {
        // Clone the request to read its body
        const reqClone = request.clone();
        const formData = await reqClone.formData();
        if (SHOWBODY) console.log("Form data:", Object.fromEntries(formData));
      } catch (error) {
        console.error("Error parsing form data:", error);
      }
    } else if (contentType?.includes("text/plain")) {
      try {
        // Clone the request to read its body
        const reqClone = request.clone();
        const text = await reqClone.text();
        if (isBot) {
          console.error(
            `Bot detected: User-Agent: ${userAgent}, IP: ${ip}, body: ${text}`
          );
          // return new NextResponse("Bots are not allowed", { status: 403 });
        } else {
          if (SHOWBODY) console.log("Request body (plain text):", text);
        }
      } catch (error) {
        console.error("Error reading plain text body:", error);
      }
    } else {
      console.log("Body present, but not parsing (content-type):", contentType);
    }
  } else {
    //console.log("No body in the request");
  }

  // Return the response without modifying it
  return NextResponse.next();
}

// Optional: Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

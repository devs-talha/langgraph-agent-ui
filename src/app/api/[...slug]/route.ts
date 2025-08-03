import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

// This file acts as a proxy for requests to your LangGraph server.
// It forwards all HTTP methods with custom authorization headers.

const LANGGRAPH_API_URL = process.env.LANGGRAPH_API_URL || "";
const BASIC_AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME || "";
const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD || "";

async function proxyRequest(request: NextRequest, method: string) {
  try {
    const { pathname, search } = new URL(request.url);
    const slug = pathname.split("/api/")[1] || "";

    // Construct the target URL
    const targetUrl = `${LANGGRAPH_API_URL}/${slug}${search}`;

    // Get the request body if it exists
    let body: string | undefined;
    if (method !== "GET" && method !== "HEAD" && method !== "OPTIONS") {
      body = await request.text();
    }

    // Prepare headers
    const headers = new Headers();

    // Copy relevant headers from the original request
    request.headers.forEach((value, key) => {
      // Skip host and other headers that shouldn't be forwarded
      if (
        ![
          "host",
          "content-length",
          "connection",
          "upgrade",
          "proxy-connection",
          "proxy-authenticate",
          "proxy-authorization",
          "te",
          "trailers",
          "transfer-encoding",
        ].includes(key.toLowerCase())
      ) {
        headers.set(key, value);
      }
    });

    // Add basic HTTP authorization if credentials are provided
    if (BASIC_AUTH_USERNAME && BASIC_AUTH_PASSWORD) {
      const basicAuthCredentials = btoa(
        `${BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}`,
      );
      headers.set("Authorization", `Basic ${basicAuthCredentials}`);
    }

    // Set content type if body exists
    if (body && !headers.has("content-type")) {
      headers.set("Content-Type", "application/json");
    }

    // Make the proxied request
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
    });

    // Create response headers
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // Skip headers that shouldn't be forwarded
      if (
        ![
          "connection",
          "keep-alive",
          "proxy-authenticate",
          "proxy-authorization",
          "te",
          "trailers",
          "transfer-encoding",
          "upgrade",
        ].includes(key.toLowerCase())
      ) {
        responseHeaders.set(key, value);
      }
    });

    // Add CORS headers
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    );
    responseHeaders.set("Access-Control-Allow-Headers", "Content-Type");

    // Stream the response body whenever possible
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  return proxyRequest(request, "GET");
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, "POST");
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request, "PUT");
}

export async function PATCH(request: NextRequest) {
  return proxyRequest(request, "PATCH");
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request, "DELETE");
}

export async function OPTIONS(request: NextRequest) {
  // Handle preflight requests
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export const runtime = "edge";

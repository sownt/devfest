import { recaptchaMiddleware } from "@/app/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { slug: string[] } }): Promise<NextResponse | Response> {
  const apiEndpoint = process.env.API_ENDPOINT || "";
  const path = Array.isArray(params.slug) ? params.slug.join("/") : params.slug;
  const url = `${apiEndpoint.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

  const middlewareResponse = await recaptchaMiddleware(req);
  if (middlewareResponse) {
    return middlewareResponse;
  }

  try {
    const data = await req.json();
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }


    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    const resJson = await response.json();

    return new NextResponse(resJson, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    return NextResponse.json("Internal Server Error");
  }
}

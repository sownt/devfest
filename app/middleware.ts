import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function recaptchaMiddleware(req: NextRequest) {
  const token = req.headers.get("token");
  const secretKey: string | undefined = process.env.RECAPTCHA_SECRET_KEY;

  if (!token) {
    return new NextResponse(JSON.stringify({ message: "Token not found" }), {
      status: 400,
    });
  }

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
    );

    if (response.data.success) {
      return null;
    } else {
      return new NextResponse(
        JSON.stringify({ message: "Failed to verify reCAPTCHA" }),
        { status: 400 }
      );
    }
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

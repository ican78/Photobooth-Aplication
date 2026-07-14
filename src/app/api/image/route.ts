import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const filename = req.nextUrl.searchParams.get("filename");
    const subfolder = req.nextUrl.searchParams.get("subfolder") ?? "";
    const type = req.nextUrl.searchParams.get("type") ?? "output";

    if (!filename) {
      return new NextResponse("Filename is required", {
        status: 400,
      });
    }

    const comfyUrl =
      process.env.COMFY_URL ??
      "http://127.0.0.1:8188";

    const url =
      `${comfyUrl}/view` +
      `?filename=${encodeURIComponent(filename)}` +
      `&subfolder=${encodeURIComponent(subfolder)}` +
      `&type=${encodeURIComponent(type)}`;
const response = await axios.get(url, {
  responseType: "arraybuffer",
});

return new NextResponse(response.data, {
  headers: {
    "Content-Type": "image/png",
    "Cache-Control": "no-store",
  },
});
  } catch (err: any) {
    console.error(err);

    return new NextResponse(
      err.message ?? "Image Proxy Error",
      {
        status: 500,
      }
    );
  }
}
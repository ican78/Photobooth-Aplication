import { NextResponse } from "next/server";
import { copyImageToInput } from "@/lib/comfy";
import path from "path";

export async function GET() {
  try {
    const source = path.join(
      process.cwd(),
      "public",
      "test.jpg"
    );

    const result = await copyImageToInput(
    source,
    "test.jpg"
);

    return NextResponse.json({
      success: true,
      destination: result,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}
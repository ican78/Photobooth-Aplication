import { NextRequest, NextResponse } from "next/server";
import { getHistory } from "@/lib/comfy";

export async function GET(req: NextRequest) {
  try {
    const promptId =
      req.nextUrl.searchParams.get("promptId");

    if (!promptId) {
      return NextResponse.json(
        {
          success: false,
          error: "promptId is required",
        },
        {
          status: 400,
        }
      );
    }

    const history = await getHistory(promptId);

    return NextResponse.json(history);

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
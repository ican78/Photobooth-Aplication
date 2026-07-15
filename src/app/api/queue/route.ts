import { NextResponse } from "next/server";

export async function GET() {
  try {
    const comfyUrl = process.env.COMFY_URL!;

    const response = await fetch(`${comfyUrl}/queue`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Queue Error : ${response.status}`);
    }

    const queue = await response.json();

    return NextResponse.json({
      success: true,
      running: queue.queue_running ?? [],
      pending: queue.queue_pending ?? [],
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
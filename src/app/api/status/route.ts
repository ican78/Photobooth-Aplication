import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const promptId = searchParams.get("promptId");

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

    const comfyUrl = process.env.COMFY_URL;

    const response = await fetch(
      `${comfyUrl}/history/${promptId}`
    );

    const history = await response.json();

    const job = history[promptId];
    const outputs = job.outputs ?? {};
    const executedNodes = Object.keys(outputs);
    const executedCount = executedNodes.length;

  if (!job) {

    return NextResponse.json({
        success: true,
        status: "queued"
    });

  }

const completed =
    job.status?.completed ?? false;

const statusString =
    job.status?.status_str ?? "";

let filename = "";
let subfolder = "";
let type = "";

for (const nodeId of Object.keys(outputs)) {
    const node = outputs[nodeId];

    if (node.images && node.images.length > 0) {
        filename = node.images[0].filename;
        subfolder = node.images[0].subfolder;
        type = node.images[0].type;
        break;
    }
}

let progress = 0;
let message = "";

if (completed) {

    progress = 100;
    message = "Selesai";

} else {

    const estimated = Math.max(executedCount + 4, 10);

    progress = Math.floor(
        (executedCount / estimated) * 100
    );

    progress = Math.max(5, Math.min(progress, 95));

}

if (!completed) {

    if (progress < 15)
        message = "Masuk antrian...";

    else if (progress < 30)
        message = "Memuat model AI...";

    else if (progress < 50)
        message = "Menganalisa wajah...";

    else if (progress < 75)
        message = "AI sedang membuat gambar...";

    else
        message = "Menyempurnakan hasil...";
}

return NextResponse.json({
    success: true,
    status: completed ? "completed" : statusString,
    completed,
    progress,
    message,
    promptId,

    filename,
    subfolder,
    type
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
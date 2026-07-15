import { NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{
      filename: string;
    }>;
  }
) {
  try {
    const { filename } = await context.params;

    const outputDir = process.env.COMFY_OUTPUT!;

    const filePath = path.join(
      outputDir,
      filename
    );

    const image = await fs.readFile(filePath);

    return new Response(image, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error(err);

    return Response.json(
      {
        error: String(err),
      },
      {
        status: 500,
      }
    );
  }
}
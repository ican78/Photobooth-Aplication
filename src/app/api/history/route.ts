import { NextResponse } from "next/server";
import { getHistory } from "@/lib/comfy";

export async function GET() {
  try {

    const promptId =
      "cca02277-0914-430a-895e-a17546a790a0";

    const result =
      await getHistory(promptId);

    return NextResponse.json(result);

  } catch (err: any) {

    return NextResponse.json(
      {
        success:false,
        error:err.message
      },
      {
        status:500
      }
    );

  }
}

export function getOutputImage(
  history: any
) {

  const outputs =
    history.outputs;

  for (const nodeId in outputs) {

    const node =
      outputs[nodeId];

    if (node.images) {

      return node.images[0];

    }

  }

  return null;

}
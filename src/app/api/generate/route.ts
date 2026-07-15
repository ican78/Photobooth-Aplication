import { NextRequest, NextResponse } from "next/server";
import { getTheme } from "@/themes";
import fs from "fs/promises";
import path from "path";
import {getLatestOutputFile} from "@/lib/comfy";
import { uploadImage } from "@/services/uploadImage";
import { randomUUID } from "crypto";

import {
    copyImageToInput,
    queuePrompt,
    waitForCompletion,
} from "@/lib/comfy";

import {
    loadWorkflow,
    generateImageName,
    updateWorkflowImage,
    updateWorkflowPrompt,
     randomizeSeeds,
} from "@/lib/workflow";

export async function POST(req: NextRequest) {
    const clientId = randomUUID();
    try {

        const formData =
            await req.formData();

        const file =
            formData.get("image");

        if (
            !file ||
            !(file instanceof File)
        ) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Image not found"
                },
                {
                    status: 400
                }
            );

        }

        //--------------------------------------------------
        // save temporary
        //--------------------------------------------------

        const bytes =
            Buffer.from(
                await file.arrayBuffer()
            );

        const tempDir =
            process.env.TEMP_DIR!;

        await fs.mkdir(
            tempDir,
            {
                recursive: true
            }
        );

        const tempFile =
            path.join(
                tempDir,
                "capture.jpg"
            );

        await fs.writeFile(
            tempFile,
            bytes
        );
        const filename =
    generateImageName();
    console.log("INPUT IMAGE :", filename);

        //--------------------------------------------------
        // copy -> ComfyUI/input/current.jpg
        //--------------------------------------------------

        await copyImageToInput(
    tempFile,
    filename
);

        //--------------------------------------------------
        // load workflow
        //--------------------------------------------------

    const theme = getTheme("cyberpunk");

let workflow =
await loadWorkflow(
    theme.workflow
);

workflow = updateWorkflowPrompt(
    workflow,
    theme.positive,
    theme.negative
);
workflow =
updateWorkflowImage(
    workflow,
    filename
);
workflow =
randomizeSeeds(
    workflow
);

    
    console.log(
    "SET IMAGE =",
    workflow["95"].inputs.image
);

console.log(
    "Workflow node 95:",
    workflow["95"].inputs.image
);


        //--------------------------------------------------
        // queue
        //--------------------------------------------------

const queued = await queuePrompt(
    workflow,
    clientId
);
            
return NextResponse.json({
    success: true,
    promptId: queued.prompt_id,
    clientId,
});
    } catch (err: any) {

        return NextResponse.json(
            {
                success: false,
                error: err.message
            },
            {
                status: 500
            }
        );

    }

}
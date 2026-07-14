import { NextResponse } from "next/server";

import { loadWorkflow } from "@/lib/workflow";
import { queuePrompt } from "@/lib/comfy";

export async function GET() {

    try{

        const workflow = await loadWorkflow("cyberpunk");

        const result =
            await queuePrompt(workflow);

        return NextResponse.json(result);

    }catch(err:any){

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
import fs from "fs-extra";
import path from "path";
import { v4 as uuid } from "uuid";



export async function loadWorkflow(
    workflowName: string
) {

    const workflowPath = path.join(
        process.cwd(),
        "workflow",
        `${workflowName}.json`
    );

    return await fs.readJson(workflowPath);

}
export function generateImageName() {

    return `capture_${uuid()}.png`;

}
export function updateWorkflowImage(
    workflow: any,
    filename: string
){

    workflow["95"].inputs.image = filename;

    return workflow;

}
export function updateWorkflowPrompt(
    workflow: any,
    positive: string,
    negative: string
) {

    workflow["76:67"].inputs.text = positive;

    workflow["76:71"].inputs.text = negative;

    return workflow;
}
function findNodesByClass(
    workflow: any,
    className: string
) {
    return Object.entries(workflow).filter(
        ([, node]: any) => node.class_type === className
    );
}

function findNodesByTitle(
    workflow: any,
    title: string
) {
    return Object.entries(workflow).filter(
        ([, node]: any) =>
            node._meta?.title === title
    );
}
export function randomizeSeeds(
    workflow: any
) {
    const samplers =
        findNodesByClass(
            workflow,
            "KSampler"
        );

    for (const [, node] of samplers as any[]) {

        node.inputs.seed =
            Math.floor(
                Math.random() *
                999999999999999
            );

    }

    return workflow;
}
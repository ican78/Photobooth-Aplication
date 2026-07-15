import axios from "axios";
import fs from "fs/promises";
import path from "path";

const COMFY_URL = process.env.COMFY_URL!;

export async function checkComfy(){
    
    const res = await axios.get(
        `${COMFY_URL}/system_stats`
    );

    return res.data;

}

export async function copyImageToInput(
    sourceFile: string,
    targetFilename: string
) {

    const inputDir =
        process.env.COMFY_INPUT!;

    const destination =
        path.join(
            inputDir,
            targetFilename
        );

    await fs.copyFile(
        sourceFile,
        destination
    );

    return destination;

}

export async function queuePrompt(
    workflow: any,
    clientId: string
) {

    console.log("--------------------------------");
    console.log("CLIENT =", clientId);
    console.log("IMAGE =", workflow["95"].inputs.image);
    console.log("--------------------------------");

    const response = await axios.post(
        `${COMFY_URL}/prompt`,
        {
            prompt: workflow,
            client_id: clientId,
        }
    );

    return response.data;
}

export async function getHistory(promptId: string) {
  const res = await axios.get(
    `${COMFY_URL}/history/${promptId}`
  );

  return res.data;
}

export async function waitForCompletion(
  promptId: string) {

  while (true) {

    const history =
      await getHistory(promptId);

    const item = history[promptId];

if (
    item &&
    item.status &&
    item.status.completed
) {
    console.log("========== HISTORY ==========");
    console.log(JSON.stringify(item, null, 2));
    console.log("=============================");

    return item;
}

    await new Promise(
      resolve => setTimeout(resolve,1000)
    );

  }

}

export async function getLatestOutputFile() {

    const outputDir =
        process.env.COMFY_OUTPUT!;

    const files =
        await fs.readdir(outputDir);

    const pngFiles =
        files
            .filter(file => file.endsWith(".png"))
            .map(file => ({
                file,
                fullpath: path.join(outputDir, file)
            }));

    if (pngFiles.length === 0) {
        return null;
    }

    const stats =
        await Promise.all(
            pngFiles.map(async f => ({
                ...f,
                stat: await fs.stat(f.fullpath)
            }))
        );

    stats.sort(
        (a,b)=>
            b.stat.mtimeMs-a.stat.mtimeMs
    );

    return {

    filename: stats[0].file,

    filepath: stats[0].fullpath

};

}
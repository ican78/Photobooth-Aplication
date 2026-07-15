import { NextResponse } from "next/server";
import fs from "fs-extra";
import path from "path";

export async function GET() {
    try {

        const folder = path.join(
            process.cwd(),
            "generated"
        );

        await fs.ensureDir(folder);

        const files = await fs.readdir(folder);

        const images = files
            .filter(file =>
                file.endsWith(".png") ||
                file.endsWith(".jpg") ||
                file.endsWith(".jpeg")
            )
            .sort()
            .reverse()
            .map(file => `/generated/${file}`);

        return NextResponse.json(images);

    } catch (err:any) {

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
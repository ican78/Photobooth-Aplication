type ProgressCallback = (progress: number, message: string) => void;

type FinishCallback = () => void;

export function connectComfySocket(
    clientId: string,
    onProgress: ProgressCallback,
    onFinish: FinishCallback
) {

    const ws = new WebSocket(
        `ws://127.0.0.1:8188/ws?clientId=${clientId}`
    );

    ws.onmessage = (event) => {

        const data = JSON.parse(event.data);

        switch (data.type) {

            case "status":

                onProgress(10, "Masuk antrian...");
                break;

            case "executing":

                if (data.data.node) {

                    onProgress(40, "AI sedang bekerja...");
                }

                break;

            case "progress":

                if (data.data.max > 0) {

                    const value =
                        Math.floor(
                            40 +
                            (data.data.value / data.data.max) * 50
                        );

                    onProgress(value, "Generate AI...");
                }

                break;

            case "execution_success":

                onProgress(100, "Selesai");

                onFinish();

                ws.close();

                break;
        }

    };

    return ws;

}
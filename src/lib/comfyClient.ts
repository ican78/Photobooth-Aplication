export type ComfyNodeCallback = (node: string) => void;

export function connectComfyWS(
    promptId: string,
    clientId: string,
    onNode: ComfyNodeCallback,
    onFinish: () => void,
    onError?: (err: Event) => void
) {
    const comfyUrl =
        process.env.NEXT_PUBLIC_COMFY_URL!
            .replace("http://", "ws://")
            .replace("https://", "wss://");

    const ws = new WebSocket(
        `${comfyUrl}/ws?clientId=${clientId}`
    );

    ws.onopen = () => {
        console.log("✅ ComfyUI WebSocket Connected");
    };

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log(message);
        if (message.type === "executing") {

            if (message.data.prompt_id !== promptId)
                return;

            onNode(String(message.data.node ?? ""));
        }

        if (message.type === "execution_success") {

            if (message.data.prompt_id !== promptId)
                return;

            onFinish();

            ws.close();
        }
    };

    ws.onerror = (err) => {
        console.error("WebSocket Error", err);

        if (onError)
            onError(err);
    };

    ws.onclose = () => {
        console.log("🔌 WebSocket Closed");
    };

    return ws;
}
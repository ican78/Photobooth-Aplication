"use client";

type Props = {
    progress: number;
    message: string;
};

export default function LoadingScreen({
    progress,
    message,
}: Props) {
    return (
        <main className="h-screen bg-black text-white flex flex-col items-center justify-center">

            <h1 className="text-4xl font-bold">
                Generating AI Photo...
            </h1>

            <div className="mt-8 w-[520px] h-5 bg-white/20 rounded-full overflow-hidden">

                <div
                    className="h-full bg-white transition-all duration-500"
                    style={{
                        width: `${progress}%`,
                    }}
                />

            </div>

            <h2 className="mt-5 text-3xl font-bold">
                {progress}%
            </h2>

            <p className="mt-2 text-white/60">
                {message}
            </p>

        </main>
    );
}
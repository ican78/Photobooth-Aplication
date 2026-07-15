"use client";

import QRCode from "react-qr-code";

type Props = {
    imageUrl: string;
    downloadUrl: string;
    countdown: number;
    onRetry: () => void;
    onFinish: () => void;
};

export default function ResultScreen({
    imageUrl,
    downloadUrl,
    countdown,
    onRetry,
    onFinish,
}: Props) {
    return (
        <main className="h-screen bg-black text-white flex items-center justify-center">

            <div className="w-[92%] max-w-7xl flex gap-12">

                {/* FOTO */}

                <div className="flex-1 flex justify-center">

                    <img
                        src={imageUrl}
                        className="rounded-3xl max-h-[82vh] object-contain shadow-2xl"
                        alt="AI Result"
                    />

                </div>

                {/* PANEL */}

                <div className="w-[360px] flex flex-col justify-center">

                    <h2 className="text-3xl font-bold text-center">
                        Scan QR
                    </h2>

                    <p className="text-white/70 text-center mt-2">
                        untuk mengunduh hasil AI
                    </p>

                    <div className="bg-white rounded-2xl p-5 mt-8 flex justify-center">

                        <QRCode
                            value={downloadUrl}
                            size={250}
                        />

                    </div>

                    <p className="mt-8 text-center text-white/60">
                        Halaman akan kembali dalam
                    </p>

                    <p className="text-center text-4xl font-bold mt-2">
                        00:{String(countdown).padStart(2, "0")}
                    </p>

                    <div className="flex gap-3 mt-10">

                        <button
                            onClick={onRetry}
                            className="flex-1 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition"
                        >
                            ✨ Coba Lagi
                        </button>

                        <button
                            onClick={onFinish}
                            className="flex-1 py-4 rounded-xl border border-white/30 hover:bg-white/10 transition"
                        >
                            ✓ Selesai
                        </button>

                    </div>

                </div>

            </div>

        </main>
    );
}
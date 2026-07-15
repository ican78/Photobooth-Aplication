"use client"

import Webcam from "react-webcam"
import { useRef,useState } from "react"
import QRCode from "react-qr-code";
import LoadingScreen from "./LoadingScreen";
import ResultScreen from "./ResultScreen";

export default function CameraScreen({
onComplete
}:{
onComplete: () => void;
}){

const webcamRef=
useRef<Webcam>(null)

const [photo,setPhoto]=
useState<string|null>(null)

const [countdown,
setCountdown]

=
useState<number|null>(
null
)

const [flash,
setFlash]

=
useState(
false
)

const [loading,setLoading]=useState(false);
const [progress, setProgress] = useState(0);
const [progressText, setProgressText] = useState("");
const [result,setResult]=useState<string | null>(null);
const [error,setError]=useState("");
const [cloudinaryUrl, setDownloadUrl] = useState("");

const capture=()=>{
  let countdownInterval: NodeJS.Timeout;
setCountdown(3);

countdownInterval = setInterval(() => {

    setCountdown((prev)=>{

        if(prev===1){

            clearInterval(countdownInterval);

            const image=webcamRef.current?.getScreenshot()

            if(image){

                setFlash(true)

                setTimeout(()=>{

                setFlash(false)

                },150)

                setPhoto(image)

                setCountdown(null)
            }

            return null
        }

        return (prev ?? 0)-1    
    })

},1000)

}

const generatePhoto = async () => {
    if (!photo) return;

    try {
        console.log("Generate Photo diklik");
        setLoading(true);
        setError("");
        setProgress(5);
        setProgressText("Menyiapkan foto...");
        // ubah base64 menjadi Blob
            const blob = await (await fetch(photo)).blob();
            const formData = new FormData();
        formData.append("image", blob, "capture.jpg");
        setProgress(10);
        setProgressText("Mengunggah foto...");
            const response = await fetch("/api/generate", {
            method: "POST",
            body: formData,
        });
            if (!response.ok) {
            throw new Error("Generate gagal");
            }
            const data = await response.json();
        console.log("PROMPT :", data);
            if (!data.promptId) {
            throw new Error("Prompt ID tidak ditemukan");
            }
        setProgress(15);
        setProgressText("Masuk ke antrian AI...");
            const status = await waitUntilCompleted(data.promptId);
        console.log("FINAL STATUS :", status);
            if (!status.completed) {
            throw new Error("Generate belum selesai");
            }
        setProgress(95);
        setProgressText("Mengambil hasil AI...");
            const filename = status.filename;
            const imageUrl =
            `/api/image?filename=${encodeURIComponent(filename)}`;
        setResult(imageUrl);
            if (status.cloudinaryUrl) {
            setDownloadUrl(status.cloudinaryUrl);
            }
        setProgress(100);
        setProgressText("Selesai");
    } catch (err: any) {
        console.error(err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

const waitUntilCompleted = async (promptId: string) => {

    let currentProgress = 15;

    while (true) {

        const res = await fetch(
            `/api/status?promptId=${promptId}`
        );

        if (!res.ok) {
            throw new Error("Status API gagal");
        }

        const status = await res.json();

        console.log("STATUS :", status);

        //------------------------------------------------------
        // progress tidak pernah mundur
        //------------------------------------------------------

        if (status.progress !== undefined) {

            currentProgress = Math.max(
                currentProgress,
                status.progress
            );

            setProgress(currentProgress);
        }

        //------------------------------------------------------
        // message realtime
        //------------------------------------------------------

        if (status.message) {
            setProgressText(status.message);
        }

        //------------------------------------------------------
        // selesai
        //------------------------------------------------------

        if (status.completed) {

            setProgress(100);

            return status;
        }

        //------------------------------------------------------

        await new Promise(resolve =>
            setTimeout(resolve, 1000)
        );
    }
};

if (loading) {
    return (
        <LoadingScreen
            progress={progress}
            message={progressText}
        />
    );
}

if (result) {
    return (
        <ResultScreen
            imageUrl={result}
            downloadUrl={cloudinaryUrl}
            countdown={30}
            onRetry={() => {
                setResult(null);
                setPhoto(null);
                setDownloadUrl("");
                setProgress(0);
                setProgressText("");
                setError("");
            }}
            onFinish={onComplete}
        />
    );
}

return(   
<main
className="
h-screen

bg-black

text-white

flex

flex-col

items-center

justify-center
"
>

<h1
className="
text-5xl

font-bold

mb-10
"
>

POSISIKAN DIRI

</h1>

<div
className="
relative

overflow-hidden

rounded-[40px]

border

border-white/20
"
>

{!photo ? (

<>

<Webcam

ref={webcamRef}

audio={false}

mirrored={true}

screenshotFormat="image/jpeg"

videoConstraints={{
width:720,
height:1280,
facingMode:"user"
}}

className="
w-[520px]
h-[720px]
object-cover
"
/>

{
countdown!==null && (

<div
className="
absolute
inset-0

flex
items-center
justify-center

bg-black/30

text-[180px]

font-black

text-white

pointer-events-none
"
>
{countdown}

</div>

)
}

{
flash && (

<div
className="
absolute

inset-0

bg-white

animate-pulse
"
/>

)
}

</>

):( 

<img

src={photo}

alt="preview"

className="
w-[520px]
h-[720px]
object-cover
"

/>

)}

</div>

<div
className="
mt-8
flex
gap-4
"
>

{

!photo

?

(

<button

onClick={()=>
!countdown
&&
capture()
}

className="
px-10
py-4
bg-white
text-black
rounded-full
"

>

AMBIL FOTO

</button>

)

:

<>

<button

onClick={()=>
setPhoto(null)
}

className="
px-10
py-4
border
rounded-full
"

>

ULANG

</button>

<button

onClick={generatePhoto}

className="
px-10
py-4
bg-white
text-black
rounded-full
"

>

LANJUTKAN

</button>

</>

}

</div>

</main>

)

}

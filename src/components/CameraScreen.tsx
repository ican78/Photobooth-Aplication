"use client"

import Webcam from "react-webcam"
import { useRef,useState } from "react"
import QRCode from "react-qr-code";

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
const [promptId, setPromptId] = useState("");

const capture=()=>{
  let countdownInterval: NodeJS.Timeout;
setCountdown(3);

countdownInterval = setInterval(() => {

setCountdown(
(prev)=>{

if(
prev===1
){

clearInterval(countdownInterval);

const image=
webcamRef.current
?.getScreenshot()

if(image){

setFlash(
true
)

setTimeout(()=>{

setFlash(
false
)

},150)

setPhoto(
image
)

setCountdown(
null
)

}

return null

}

return (
prev ?? 0
)-1

})

},1000)

}

const generatePhoto = async () => {
  let interval: NodeJS.Timeout | null = null;
    console.log("Generate Photo diklik");
  if (!photo) return;

  try {
    setLoading(true);
    setProgress(5);
    setProgressText("Menyiapkan foto...");
    setError("");

    const blob = await (await fetch(photo)).blob();
    setProgress(10);
    setProgressText("Mengunggah foto...");

    const formData = new FormData();

    formData.append(
      "image",
      blob,
      "capture.jpg"
    );

    const response = await fetch("/api/generate",
      {
        method: "POST",
        body: formData,
      }
    );
    setProgress(15);
    setProgressText("Workflow dikirim ke AI...");
    console.log(response.status);
    const data = await response.json();
    console.log(data);
    setPromptId(data.promptId);
    setProgress(45);
    setProgressText("AI masuk ke antrian...");
    const status = await waitUntilCompleted(data.promptId);
    console.log("FINAL STATUS", status);

    if(interval !== null){
            clearInterval(interval);
        }

    // setResult(data.url);
    // setProgress(100);
    // setProgressText("Selesai");
    // setDownloadUrl(data.cloudinaryUrl);
  } 
  catch (err:any) {
    console.error(err);
    setError(err.message);
    }

  finally {

    if(interval !== null){
            clearInterval(interval);
        }

        setLoading(false);

    setProgress(100);

    }
};

const waitUntilCompleted = async (promptId: string) => {
    while (true) {

        const res = await fetch(
            `/api/status?promptId=${promptId}`
        );

        const status = await res.json();
        console.log("STATUS :", status);
        setProgress((prev) => {

        if (status.progress <= prev) {
        return prev;
        }

        return status.progress;
        });
        
        setProgressText(status.message ?? "");
        if (status.completed) {
        return status;
        }

await new Promise(resolve => setTimeout(resolve,1000));
    }
}


if (loading) {
    return (
        <main className="h-screen bg-black text-white flex flex-col items-center justify-center">

            <div className="text-4xl font-bold">
                Generating AI Photo...
            </div>

            <div className="mt-6 w-[500px] h-5 rounded-full bg-white/20 overflow-hidden">

                <div
                    className="h-full bg-white transition-all duration-500"
                    style={{
                        width: `${progress}%`
                    }}
                />

            </div>

            <div className="mt-4 text-xl">

                {progress}%

            </div>

            <div className="mt-2 text-white/70">

                {progressText}

            </div>

        </main>
    );
}
if (result) {
  return (
    <main className="h-screen bg-black text-white flex items-center justify-center">

        <div className="w-[92%] max-w-7xl flex gap-12">

            {/* FOTO */}

            <div className="flex-1 flex justify-center">

                <img
                    src={result}
                    className="rounded-3xl max-h-[82vh] object-contain shadow-2xl"
                />

            </div>

            {/* PANEL KANAN */}

            <div className="w-[360px] flex flex-col justify-center">

                <h2 className="text-3xl font-bold text-center">
                    Scan QR
                </h2>

                <p className="text-white/70 text-center mt-2">
                    untuk mengunduh hasil AI
                </p>

                <div className="bg-white rounded-2xl p-5 mt-8 flex justify-center">

                    <QRCode
                        value={cloudinaryUrl}
                        size={250}
                    />

                </div>

                <p className="mt-8 text-center text-white/60">

                    Halaman akan kembali dalam

                </p>

                <p className="text-center text-4xl font-bold mt-2">

                    00:30

                </p>

                <div className="flex gap-3 mt-10">

                    <button

                        onClick={()=>{
                            setResult(null);
                            setPhoto(null);
                            setDownloadUrl("");
                        }}

                        className="flex-1 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition"
                    >

                        ✨ Coba Lagi

                    </button>

                    <button

                        onClick={onComplete}

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

"use client"

import Image from "next/image"
import { useState } from "react"

const themes=[

{
name:"NEO CITY",
image:"/themes/neo.jpg"
},

{
name:"PREMIUM",
image:"/themes/premium.jpg"
},

{
name:"EPIC",
image:"/themes/epic.jpg"
}

]

export default function ThemeCarousel({
onSelect
}:{
onSelect:(theme:string)=>void
}){
    

const [active,setActive]=
useState(0)

return(

<div
className="
mt-10
w-full
flex
flex-col
items-center
"
>

<div
className="
relative

flex

items-center

justify-center

w-full
"
>

<button
onClick={()=>
setActive(
Math.max(0,active-1)
)
}
className="
absolute
left-[24%]

z-20

text-6xl

opacity-40
hover:opacity-100
hover:scale-110
transition
"
>

←

</button>
{
active>0 && (

<div
className="
absolute

left-[18%]

w-[220px]
h-[360px]

rounded-[30px]

overflow-hidden

opacity-20

scale-[0.85]
"
>

<Image
src={themes[active-1].image}
alt=""
fill
className="object-cover"
/>

</div>

)
}
<div
className="
relative

w-[460px]
h-[700px]

rounded-[42px]

overflow-hidden

border
border-white/20

shadow-[0_0_120px_rgba(255,255,255,0.08)]

transition

duration-500
"
>

<Image

src={
themes[active].image
}

alt="theme"

fill

className="
object-cover
"
/>

<div
className="
absolute

bottom-0

w-full

p-10

bg-gradient-to-t

from-black

via-black/40

to-transparent
"
>

<p
className="
text-sm

tracking-[0.5em]

text-gray-400
"
>

THEME

</p>

<h2
className="
mt-2

text-5xl

font-black
"
>

{themes[active].name}

</h2>

</div>

</div>
{
active<
themes.length-1

&&

(

<div
className="
absolute

right-[18%]

w-[220px]
h-[360px]

rounded-[30px]

overflow-hidden

opacity-20

scale-[0.85]
"
>

<Image
src={
themes[
active+1
].image
}

alt=""

fill

className="
object-cover
"
/>

</div>

)
}

<button

onClick={()=>
setActive(
Math.min(
themes.length-1,
active+1
)
)
}

className="
absolute
right-[24%]
z-20
text-6xl
opacity-40
hover:opacity-100
hover:scale-110
transition
"
>

→

</button>

</div>

<div
className="
mt-8

flex

gap-3

items-center
"
>

{

themes.map(
(_,i)=>(

<div

key={i}

className={`
w-2
h-2

rounded-full

transition

${
i===active

?

"bg-white scale-125"

:

"bg-gray-600"

}

`}

/>

)

)

}

</div>

<button

onClick={()=>
onSelect(
themes[active].name
)
}

className="
mt-8

px-14
py-5

rounded-full

bg-white

text-black

font-bold

text-lg

hover:scale-105

transition
"

>

LANJUTKAN

</button>

</div>

)

}
type Job={

id:number

status:
"waiting"
|
"processing"
|
"done"

}

let jobs:Job[]=[]

export function addJob(){

const job={

id:
Date.now(),

status:
"waiting"

} as Job

jobs.push(job)

return job

}

export function startJob(
id:number
){

jobs=
jobs.map(
job=>

job.id===id

?

{
...job,

status:
"processing"
}

:

job

)

}

export function finishJob(
id:number
){

jobs=
jobs.map(
job=>

job.id===id

?

{
...job,

status:
"done"
}

:

job

)

}

export function getQueue(){

return jobs

}
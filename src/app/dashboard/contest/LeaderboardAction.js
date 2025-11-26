"use server"



export async function LeaderboardAction() {
    const res = await fetch('http://localhost:3000/dashboard/contest').then((res) => res)
    const data =  JSON.stringify( res)
    console.log({actionData:data})
    return res
}
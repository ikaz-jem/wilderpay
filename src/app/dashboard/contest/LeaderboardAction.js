"use server"



export async function LeaderboardAction() {
    const res = await fetch('https://wilderpay.com/api/contest').then((res) => res)
    const data =  JSON.stringify( res)
    console.log({actionData:data})
    return res
}
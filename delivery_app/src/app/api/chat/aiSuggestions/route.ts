import connectdb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectdb()
        const { message, role } = await req.json()
        const prompt=`You are a professional delivery assistant chatbot.

                    Your task is to generate exactly 3 WhatsApp-style reply suggestions based on:
                    1. The role of the person who will send the reply: "${role}"
                    2. The last received message: "${message}"

                    Role can be either:
                        - "user"
                        - "delivery boy"

                    Rules:
                        - The replies must match the context and intent of the last message.
                        - The replies must be short, human-like, and natural.
                        - Use emojis naturally, only where appropriate.
                        - Do not generate generic replies like "Okay", "Thanks", or "I understand" unless they clearly fit the context.
                        - Replies must be helpful, relevant, and respectful.
                        - Replies should be related to delivery status, order help, address, payment, delay, pickup, drop, or location.
                        - If the last message asks for location, suggest replies sharing or asking about location clearly.
                        - If the last message is about delay, suggest polite delay/status replies.
                        - If the last message is about delivery confirmation, suggest confirmation-style replies.
                        - If the last message is unclear, still generate useful delivery-related replies.
                        - Do not include numbering.
                        - Do not include explanations.
                        - Do not include extra text or instructions.
                        - Output only 3 reply suggestions.
                        - Separate the 3 replies using | only.

                        Output format:
                    reply 1, reply 2, reply 3`
        const response = await fetch(`${process.env.GEMINI_URI}?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "contents": [
                    {
                        "parts": [
                            {
                                "text":prompt
                            }
                        ]
                    }
                ]
            })
        })
        const data=await response.json()
        const replyText=data.candidates?.[0].content.parts?.[0].text||""
        const suggestions=replyText.split("|").map((s:string)=>s.trim())
        return NextResponse.json(suggestions,{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: `ai suggesstions error ${error}`},{status:500})
    }
}
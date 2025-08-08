import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text, voice } = await request.json();

    if (!text || !voice) {
      return NextResponse.json(
        { error: "Text and voice are required" },
        { status: 400 }
      );
    }

    const ssml = `
      <speak version='1.0' xml:lang='${voice.split("-")[0]}-${
      voice.split("-")[1]
    }'>
      <voice name='${voice}'>
        ${text}
      </voice>
    </speak>
    `;

    const azureEndpoint = `https://${process.env.AZURE_TTS_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;

    const azureResponse = await fetch(azureEndpoint, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.AZURE_TTS_KEY!,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-48khz-192kbitrate-mono-mp3",
      },
      body: ssml,
    });

    if (!azureResponse.ok) {
      const errorText = await azureResponse.text(); // Capture full error
      return NextResponse.json(
        {
          error: `Azure TTS Error: ${azureResponse.status} ${azureResponse.statusText}`,
          details: errorText,
        },
        { status: azureResponse.status }
      );
    }

    const buffer = await azureResponse.arrayBuffer();

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "attachment; filename="+voice.split("-")[2]+".mp3", // 🔁 Force download
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

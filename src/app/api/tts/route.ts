import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const ssml = `
      <speak version='1.0' xml:lang='hi-IN'>
        <voice name='hi-IN-ArjunNeural'>${text}</voice>
      </speak>
    `;

    const azureEndpoint = `https://${process.env.AZURE_TTS_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;

    const azureResponse = await fetch(azureEndpoint, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.AZURE_TTS_KEY!,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-16khz-32kbitrate-mono-mp3"
      },
      body: ssml
    });

    if (!azureResponse.ok) {
      const errorText = await azureResponse.text(); // Capture full error
      return NextResponse.json(
        {
          error: `Azure TTS Error: ${azureResponse.status} ${azureResponse.statusText}`,
          details: errorText
        },
        { status: azureResponse.status }
      );
    }

    const buffer = await azureResponse.arrayBuffer();

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "attachment; filename=speech.mp3" // 🔁 Force download
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

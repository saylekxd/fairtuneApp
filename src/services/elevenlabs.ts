const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API ;

// Polish voice IDs from ElevenLabs
const POLISH_VOICES = {
  'Antoni': 'pNInz6obpgDQGcFmaJgB',    // Male Polish voice
  'Julia': 'XB0fDUnXU5powFXDhCwa',     // Female Polish voice
  'Zofia': '21m00Tcm4TlvDq8ikWAM',     // Female Polish voice 2
  'Marek': 'AZnzlk1XvdvUeBnXmlld',     // Male Polish voice 2
  'Kasia': 'ThT5KcBeYPX3keUQqHPh'      // Female Polish voice 3
};

export const synthesizeSpeech = async (text: string, voiceId: string = 'Julia'): Promise<ArrayBuffer> => {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ElevenLabs API key is not configured. Please add your API key in src/services/elevenlabs.ts');
  }

  try {
    const selectedVoiceId = POLISH_VOICES[voiceId as keyof typeof POLISH_VOICES] || POLISH_VOICES.Julia;

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.75,      // Increased stability for clearer speech
            similarity_boost: 0.75, // Increased similarity for more consistent voice
            style: 0.5,          // Balanced style
            use_speaker_boost: true,
            speaking_rate: 0.8    // Slower speaking rate (0.8 = 20% slower)
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.detail?.message || 'Failed to synthesize speech. Please check your API key.');
    }

    return response.arrayBuffer();
  } catch (error) {
    console.error('Speech synthesis error:', error);
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key is not configured. Please add your API key in src/services/elevenlabs.ts');
    }
    throw new Error('Failed to synthesize speech. Please check your API key and try again.');
  }
};
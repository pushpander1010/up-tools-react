import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import FAQ from '../components/FAQ'

const TITLE = 'Voice & Video AI: Text-to-Speech (TTS), Voice Cloning & Talking Avatars'
const DESC = 'Learn how AI voice synthesis and video generation work with an interactive TTS & talking-avatar simulator — explore text-to-phoneme conversion, mel-spectrogram acoustic modeling, vocoder synthesis (HiFi-GAN), pitch/speed modulation, and viseme lip-syncing. Includes Python & JavaScript code, 5 practice questions, 4 FAQs and interview tips.'
const URL = 'https://www.uptools.in/learning/ai/voice-and-video-ai/'

// ---------------------------------------------------------------------------
// Sample Text & Voice Presets
// ---------------------------------------------------------------------------
const VOICE_PRESETS = [
  {
    id: 'tech-explainer',
    name: '🤖 AI Tech Explainer',
    voiceName: 'Nova (Warm Neural Studio)',
    gender: 'Female',
    basePitch: 1.05,
    baseSpeed: 1.0,
    accentColor: '#06b6d4',
    secondaryColor: '#8b5cf6',
    text: 'Welcome to UpTools AI. Today we are exploring neural text-to-speech, acoustic spectrograms, and real-time talking avatars.',
    phonemes: [
      { char: 'Wel', ipa: '/wɛl/', viseme: 'viseme_fv', start: 0, end: 12 },
      { char: 'come', ipa: '/kʌm/', viseme: 'viseme_mbp', start: 13, end: 24 },
      { char: 'to', ipa: '/tuː/', viseme: 'viseme_oh', start: 25, end: 32 },
      { char: 'Up', ipa: '/ʌp/', viseme: 'viseme_mbp', start: 33, end: 42 },
      { char: 'Tools', ipa: '/tuːlz/', viseme: 'viseme_oh', start: 43, end: 55 },
      { char: 'AI', ipa: '/eɪ.aɪ/', viseme: 'viseme_aa', start: 56, end: 72 },
      { char: 'Voice', ipa: '/vɔɪs/', viseme: 'viseme_fv', start: 73, end: 88 },
      { char: 'Syn', ipa: '/sɪn/', viseme: 'viseme_ee', start: 89, end: 100 },
    ],
    spectrogramPattern: [
      [85, 70, 92, 45, 60, 80, 95, 40, 75, 88, 65, 90, 78, 50, 68, 84],
      [40, 65, 85, 90, 75, 55, 70, 88, 92, 60, 45, 80, 85, 70, 60, 75],
      [90, 85, 60, 70, 95, 80, 65, 50, 88, 92, 70, 60, 75, 85, 90, 65],
      [55, 75, 80, 60, 45, 90, 85, 70, 60, 78, 88, 95, 70, 55, 65, 80],
    ],
  },
  {
    id: 'podcast-narrator',
    name: '🎙️ Deep Podcast Narrator',
    voiceName: 'Echo (Deep Resonant Baritone)',
    gender: 'Male',
    basePitch: 0.82,
    baseSpeed: 0.92,
    accentColor: '#3b82f6',
    secondaryColor: '#ec4899',
    text: 'In a world shaped by generative models, synthetic voices and neural avatars speak with genuine emotional inflection.',
    phonemes: [
      { char: 'In', ipa: '/ɪn/', viseme: 'viseme_ee', start: 0, end: 10 },
      { char: 'a', ipa: '/ə/', viseme: 'viseme_aa', start: 11, end: 18 },
      { char: 'world', ipa: '/wɜːld/', viseme: 'viseme_oh', start: 19, end: 32 },
      { char: 'shaped', ipa: '/ʃeɪpt/', viseme: 'viseme_ee', start: 33, end: 48 },
      { char: 'by', ipa: '/baɪ/', viseme: 'viseme_aa', start: 49, end: 60 },
      { char: 'AI', ipa: '/eɪ.aɪ/', viseme: 'viseme_aa', start: 61, end: 76 },
      { char: 'hu', ipa: '/hjuː/', viseme: 'viseme_oh', start: 77, end: 88 },
      { char: 'mans', ipa: '/mənz/', viseme: 'viseme_mbp', start: 89, end: 100 },
    ],
    spectrogramPattern: [
      [95, 90, 85, 75, 65, 50, 45, 40, 60, 75, 85, 90, 95, 80, 70, 60],
      [70, 85, 95, 90, 80, 65, 55, 50, 70, 85, 90, 88, 75, 65, 55, 45],
      [60, 70, 80, 88, 92, 85, 75, 65, 55, 70, 80, 85, 90, 85, 70, 60],
      [40, 50, 65, 75, 85, 90, 80, 70, 60, 50, 65, 75, 80, 85, 70, 55],
    ],
  },
  {
    id: 'customer-support',
    name: '🎧 Fast Assistant Agent',
    voiceName: 'Sol (Energetic Dynamic Agent)',
    gender: 'Neutral',
    basePitch: 1.18,
    baseSpeed: 1.15,
    accentColor: '#10b981',
    secondaryColor: '#f59e0b',
    text: 'Your support ticket #8492 has been resolved! A verification receipt was securely sent to your registered inbox.',
    phonemes: [
      { char: 'Your', ipa: '/jɔːr/', viseme: 'viseme_oh', start: 0, end: 12 },
      { char: 'sup', ipa: '/sə/', viseme: 'viseme_aa', start: 13, end: 22 },
      { char: 'port', ipa: '/pɔːrt/', viseme: 'viseme_mbp', start: 23, end: 36 },
      { char: 'tick', ipa: '/tɪk/', viseme: 'viseme_ee', start: 37, end: 48 },
      { char: 'et', ipa: '/ɪt/', viseme: 'viseme_ee', start: 49, end: 58 },
      { char: 'is', ipa: '/ɪz/', viseme: 'viseme_ee', start: 59, end: 68 },
      { char: 're', ipa: '/rɪ/', viseme: 'viseme_ee', start: 69, end: 80 },
      { char: 'solved', ipa: '/zɒlvd/', viseme: 'viseme_fv', start: 81, end: 100 },
    ],
    spectrogramPattern: [
      [60, 80, 95, 90, 75, 85, 90, 80, 65, 85, 95, 90, 75, 80, 85, 70],
      [80, 90, 85, 70, 85, 95, 88, 75, 85, 90, 85, 70, 80, 90, 85, 75],
      [75, 85, 90, 80, 65, 75, 85, 90, 80, 70, 85, 90, 80, 65, 75, 85],
      [90, 85, 70, 60, 75, 85, 90, 80, 70, 80, 90, 85, 70, 60, 75, 85],
    ],
  },
]

// Available Viseme Morph Target Frames
const VISEME_FRAMES = [
  { id: 'idle', label: 'Neutral / Idle', ipa: '[Silence / Rest]', desc: 'Lips closed loosely, relaxed jaw posture, neutral tongue position.' },
  { id: 'viseme_aa', label: 'Open Jaw (/AA/, /AH/)', ipa: '[ɑː, ʌ, æ]', desc: 'Lower jaw drops wide, tongue flat on floor of mouth. Words: "father", "cat", "run".' },
  { id: 'viseme_oh', label: 'Rounded Lips (/OH/, /OO/)', ipa: '[oʊ, uː, ɔː]', desc: 'Lips purse and protrude forward in a tight O-ring. Words: "voice", "tool", "glow".' },
  { id: 'viseme_ee', label: 'Wide Smile (/EE/, /IY/)', ipa: '[iː, ɪ, eɪ]', desc: 'Lip corners pull back toward cheeks, revealing upper and lower teeth. Words: "speech", "tree".' },
  { id: 'viseme_mbp', label: 'Bilabial Seal (/M/, /B/, /P/)', ipa: '[m, b, p]', desc: 'Upper and lower lips press firmly together before releasing air pressure. Words: "model", "bot".' },
  { id: 'viseme_fv', label: 'Labiodental (/F/, /V/)', ipa: '[f, v]', desc: 'Top incisors touch inner lower lip, creating a narrow fricative air channel. Words: "video", "flow".' },
]

function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="rounded-xl overflow-hidden border border-white/10">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5">
        <span className="text-xs font-bold text-slate-300">{lang}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code).then(() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            })
          }}
          className="text-xs font-semibold text-emerald-300 hover:text-white bg-transparent border-0 cursor-pointer"
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <pre className="m-0 p-4 text-xs leading-relaxed overflow-x-auto bg-black/40 text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  )
}

const QUESTIONS = [
  {
    q: 'How does a modern 2-stage Neural Text-to-Speech (TTS) pipeline work end-to-end?',
    a: 'A modern neural TTS pipeline separates speech synthesis into two core stages: 1) Acoustic Modeling (Text-to-Spectrogram): The input text is cleaned (text normalization) and translated into phonetic IPA tokens via Grapheme-to-Phoneme (G2P). An acoustic transformer or diffusion model (e.g. FastSpeech 2, VITS, or Kokoro) predicts an intermediate 80-band log Mel-Spectrogram that captures pitch (F0), duration, timbre, and rhythm. 2) Neural Vocoding (Spectrogram-to-Waveform): A neural vocoder (such as HiFi-GAN or BigVGAN) synthesizes continuous raw 24kHz/48kHz PCM audio pressure waveforms from the frequency spectrogram with sub-millisecond precision.',
  },
  {
    q: 'What is a Mel-Spectrogram and why do acoustic models predict frequency spectrograms rather than raw audio waveforms?',
    a: 'A raw 24kHz audio file contains 24,000 individual amplitude numbers for every single second of sound. Generating audio sample-by-sample with an autoregressive network is computationally intense and prone to noise drift. A Mel-Spectrogram compresses audio into a 2D time-frequency heat map using the Mel scale — a logarithmic frequency scale modeled after human auditory perception (which is sensitive to subtle pitch shifts at lower frequencies but less so above 4kHz). Predicting 80 Mel frequency bins at 86 frames-per-second is hundreds of times faster and allows the acoustic model to focus on rhythm, intonation, and pronunciation.',
  },
  {
    q: 'How does Zero-Shot Voice Cloning replicate a new speaker from just a 3-second audio sample?',
    a: 'Zero-shot voice cloning uses a pretrained Speaker Encoder (such as a d-vector or ECAPA-TDNN network). When given a short 3-second reference audio clip of an unseen person, the encoder extracts a compact, fixed-dimensional numerical vector (typically 192, 256, or 512 numbers) known as a Speaker Embedding. This embedding captures vocal tract geometry, nasality, base pitch, and accent. During synthesis, this speaker vector is injected into the cross-attention or FiLM conditioning layers of the acoustic model, conditioning the output to adopt the new speaker’s voice characteristics without retraining or fine-tuning the model.',
  },
  {
    q: 'What is the difference between Phonemes and Visemes, and how do talking avatars achieve audio-driven lip sync?',
    a: 'A Phoneme is the smallest unit of acoustic sound (e.g. /p/, /b/, /m/, /f/, /θ/), whereas a Viseme is the visual appearance of the lips, jaw, and tongue corresponding to speech. Because multiple phonemes produce identical visual mouth positions (for example, /p/, /b/, and /m/ all require closed lips), there are fewer visemes (~15 to 21) than acoustic phonemes (~44 in English). Video avatar models (like Wav2Lip, SadTalker, or LivePortrait) take raw audio, extract phonetic/spectral representations, and predict 52 ARKit blendshape morph weights or latent warp fields that animate the avatar face frame-by-frame with seamless sync.',
  },
  {
    q: 'How do Diffusion Video Models (like Sora or Kling) differ from Audio-Driven Talking Head Avatars (like Wav2Lip)?',
    a: 'Audio-driven talking head models (e.g. Wav2Lip, SadTalker) are specialized real-time systems that modify only the facial region and head pose of an existing reference video or portrait, guided frame-by-frame by acoustic phonemes. They operate at low latency (ideal for live interactive video bots). In contrast, generative video diffusion models (OpenAI Sora, Runway Gen-3, Kling, Luma) generate entire 3D spatio-temporal video volumes (backgrounds, physics, dynamic camera moves, lighting) from text prompts by denoising 3D latent video tokens across time.',
  },
]

const FAQS = [
  {
    q: 'What is the difference between Concatenative, Parametric, and Neural TTS?',
    a: 'Concatenative TTS (1990s–2000s) spliced together thousands of tiny pre-recorded voice clips from human voice actors, sounding robotic with audible glitchy seams. Parametric Formant TTS (2000s–2010s) mathematically generated synthetic vocal buzzes using digital filters, sounding smooth but unnatural. Neural TTS (2018–present) uses deep neural networks (Transformers, Flow Matching, GAN vocoders) trained on thousands of hours of speech to synthesize breath sounds, vocal fry, emotional cadence, and human-level prosody indistinguishable from real speech.',
  },
  {
    q: 'What is Real-Time Factor (RTF) and how do modern AI voice assistants achieve sub-100ms latency?',
    a: 'Real-Time Factor (RTF) measures synthesis speed: RTF = (Compute Time in Seconds) / (Audio Duration in Seconds). An RTF of 0.1 means the model synthesizes 10 seconds of speech in just 1 second. For interactive conversational AI agents, models stream audio chunk-by-chunk using non-autoregressive acoustic architectures (like FastSpeech, Kokoro, or VITS) combined with streaming vocoders and WebSocket/WebRTC protocols, delivering the first audible word in under 100 milliseconds.',
  },
  {
    q: 'How do AI companies watermark synthetic voices and detect deepfake speech?',
    a: 'Modern voice generators embed imperceptible acoustic watermarks (such as SynthID for Audio or high-frequency phase perturbations) directly into the generated waveform. These watermarks are mathematically robust against MP3 compression, background noise, and filtering. AI detection models analyze subtle vocoder phase artifacts, lack of biometric throat resonance variation, and unnatural pitch transitions (F0 continuity) to detect synthetic deepfakes with high accuracy.',
  },
  {
    q: 'What is the difference between 2D Talking Avatars and 3D Gaussian Splatting / NeRF Digital Humans?',
    a: '2D talking avatars (like Wav2Lip or SadTalker) warp 2D pixel coordinates or blend predefined image patches, which works great for frontal webcam video but breaks when the head turns to extreme angles. 3D Neural Radiance Fields (NeRF) and 3D Gaussian Splatting reconstruct a complete volumetric 3D digital human head mesh. This allows free-viewpoint rendering, dynamic lighting, realistic depth parallax, and accurate gaze tracking from any camera angle in real time.',
  },
]

const PY_CODE = `# Complete End-to-End Neural TTS & Audio-Driven Talking Avatar in Python
import torch
import torchaudio
from transformers import SpeechT5Processor, SpeechT5ForTextToSpeech, SpeechT5HifiGan
from datasets import load_dataset

# 1. Load Pretrained Acoustic Model (SpeechT5) & Neural Vocoder (HiFi-GAN)
device = "cuda" if torch.cuda.is_available() else "cpu"
processor = SpeechT5Processor.from_pretrained("microsoft/speecht5_tts")
model = SpeechT5ForTextToSpeech.from_pretrained("microsoft/speecht5_tts").to(device)
vocoder = SpeechT5HifiGan.from_pretrained("microsoft/speecht5_hifigan").to(device)

# 2. Prepare Input Text (G2P Tokenization)
text_prompt = "Welcome to UpTools AI. Generating neural voice synthesis and talking avatars in Python!"
inputs = processor(text=text_prompt, return_tensors="pt").to(device)

# 3. Load or Extract Speaker Embedding (Voice Cloning Vector: 512-dim tensor)
embeddings_dataset = load_dataset("Matthijs/cmu-arctic-xvectors", split="validation")
speaker_embeddings = torch.tensor(embeddings_dataset[7306]["xvector"]).unsqueeze(0).to(device)

# 4. Generate Mel-Spectrogram & Synthesize Raw 16kHz/24kHz Audio Waveform
with torch.no_grad():
    speech_waveform = model.generate_speech(
        inputs["input_ids"], 
        speaker_embeddings, 
        vocoder=vocoder
    )

# 5. Save Synthesized Audio to Disk
torchaudio.save("ai_voice_output.wav", speech_waveform.unsqueeze(0).cpu(), sample_rate=16000)
print("✅ Neural Audio Synthesized: ai_voice_output.wav")

# 6. (Optional) Run Wav2Lip / LivePortrait Pipeline to Sync Avatar Video
# python inference.py --checkpoint_path wav2lip.pth --face avatar_portrait.jpg --audio ai_voice_output.wav`

const JS_CODE = `// Modern AI Voice Synthesis with ElevenLabs / OpenAI Audio API & Web Speech (Node.js & Web)
import { ElevenLabsClient } from "elevenlabs";
import fs from "fs";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

async function synthesizeVoiceAndLipSync() {
  console.log("🎙️ Requesting Neural Voice Stream from ElevenLabs Turbo v2.5...");

  const audioStream = await elevenlabs.generate({
    voice: "Nova - Warm Neural",
    text: "Welcome to UpTools AI! Real-time voice cloning and talking video avatars in JavaScript.",
    model_id: "eleven_turbo_v2_5",
    voice_settings: {
      stability: 0.75,          // Voice consistency vs emotional variation
      similarity_boost: 0.85,   // Proximity to reference speaker embedding
      style: 0.20,              // Stylistic expressive exaggeration
      use_speaker_boost: true
    }
  });

  const fileStream = fs.createWriteStream("output_speech.mp3");
  audioStream.pipe(fileStream);

  fileStream.on("finish", () => {
    console.log("✅ Audio successfully downloaded: output_speech.mp3");
    console.log("🎬 Passing audio buffer to WebRTC Talking Avatar Stream...");
  });
}

// synthesizeVoiceAndLipSync();`

export default function VoiceVideoPage() {
  const [activeTab, setActiveTab] = useState('simulator') // 'simulator' | 'pillars' | 'hyperparams'
  const [selectedPresetId, setSelectedPresetId] = useState('tech-explainer')
  const [inputText, setInputText] = useState(VOICE_PRESETS[0].text)
  const [pitch, setPitch] = useState(1.05)
  const [speed, setSpeed] = useState(1.0)
  const [selectedViseme, setSelectedViseme] = useState('idle')
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [blinkState, setBlinkState] = useState(false)

  const timerRef = useRef(null)
  const canvasRef = useRef(null)

  const activePreset = useMemo(() => {
    return VOICE_PRESETS.find(p => p.id === selectedPresetId) || VOICE_PRESETS[0]
  }, [selectedPresetId])

  // Total steps in simulated speech timeline
  const maxSteps = 100
  const progressPercent = Math.min(100, Math.round((currentStep / maxSteps) * 100))

  // Determine active phoneme based on progress
  const activePhoneme = useMemo(() => {
    const list = activePreset.phonemes
    const match = list.find(ph => progressPercent >= ph.start && progressPercent <= ph.end)
    return match || list[0]
  }, [activePreset, progressPercent])

  // Periodic subtle eye blink effect for realistic avatar rendering
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(true)
      setTimeout(() => setBlinkState(false), 140)
    }, 3200)
    return () => clearInterval(blinkInterval)
  }, [])

  // Auto-play speech animation stepper
  useEffect(() => {
    if (isPlaying) {
      if (currentStep < maxSteps) {
        const stepDelay = Math.max(25, Math.floor(60 / speed))
        timerRef.current = setTimeout(() => {
          setCurrentStep(prev => prev + 1)
        }, stepDelay)
      } else {
        setIsPlaying(false)
      }
    }
    return () => clearTimeout(timerRef.current)
  }, [isPlaying, currentStep, maxSteps, speed])

  // Dynamic viseme morph selection: if playing, sync with active phoneme, else use manual selector
  const effectiveVisemeId = isPlaying ? activePhoneme.viseme : selectedViseme

  // Update text when preset changes
  const handleSelectPreset = (p) => {
    setSelectedPresetId(p.id)
    setInputText(p.text)
    setPitch(p.basePitch)
    setSpeed(p.baseSpeed)
    setCurrentStep(0)
    setIsPlaying(false)
  }

  // Canvas visual rendering of Waveform, Spectrogram, and Talking Avatar
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // Clear background
    ctx.fillStyle = '#0a0f1d'
    ctx.fillRect(0, 0, width, height)

    // Left half: Talking Avatar Render | Right half: Waveform + Mel Spectrogram
    const leftWidth = Math.floor(width * 0.44)
    const rightX = leftWidth + 10
    const rightWidth = width - rightX - 10

    // -------------------------------------------------------------------------
    // 1. AVATAR STUDIO (LEFT PANEL)
    // -------------------------------------------------------------------------
    ctx.save()
    // Avatar frame boundary
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.lineWidth = 1
    ctx.strokeRect(10, 10, leftWidth - 10, height - 20)

    const avCenterX = 10 + (leftWidth - 10) / 2
    const avCenterY = height * 0.52

    // Audio ripple aura around head when speaking
    if (isPlaying || effectiveVisemeId !== 'idle') {
      const pulseRadius = 78 + Math.sin(currentStep * 0.4 * pitch) * 6
      const aura = ctx.createRadialGradient(avCenterX, avCenterY - 10, 30, avCenterX, avCenterY - 10, pulseRadius + 30)
      aura.addColorStop(0, `${activePreset.accentColor}33`)
      aura.addColorStop(0.7, `${activePreset.secondaryColor}15`)
      aura.addColorStop(1, 'transparent')
      ctx.fillStyle = aura
      ctx.beginPath()
      ctx.arc(avCenterX, avCenterY - 10, pulseRadius + 30, 0, Math.PI * 2)
      ctx.fill()
    }

    // Avatar shoulders / torso
    ctx.fillStyle = '#1e293b'
    ctx.beginPath()
    ctx.ellipse(avCenterX, avCenterY + 80, 68, 38, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = activePreset.accentColor + '66'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Avatar Neck
    ctx.fillStyle = '#334155'
    ctx.fillRect(avCenterX - 14, avCenterY + 25, 28, 30)

    // Avatar Head / Face Shape
    const headGradient = ctx.createLinearGradient(avCenterX - 45, avCenterY - 60, avCenterX + 45, avCenterY + 30)
    headGradient.addColorStop(0, '#1e293b')
    headGradient.addColorStop(1, '#0f172a')
    ctx.fillStyle = headGradient
    ctx.beginPath()
    ctx.ellipse(avCenterX, avCenterY - 15, 46, 56, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = activePreset.accentColor
    ctx.lineWidth = 2
    ctx.stroke()

    // Stylized Cyber Hair / Cap
    ctx.fillStyle = activePreset.secondaryColor + 'bb'
    ctx.beginPath()
    ctx.arc(avCenterX, avCenterY - 32, 44, Math.PI * 0.9, Math.PI * 2.1)
    ctx.fill()

    // Eyes (with natural blink animation)
    const eyeY = avCenterY - 22
    const eyeLeftX = avCenterX - 18
    const eyeRightX = avCenterX + 18

    if (blinkState) {
      // Closed eyelids (thin line)
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(eyeLeftX - 7, eyeY)
      ctx.lineTo(eyeLeftX + 7, eyeY)
      ctx.moveTo(eyeRightX - 7, eyeY)
      ctx.lineTo(eyeRightX + 7, eyeY)
      ctx.stroke()
    } else {
      // Open glowing cyber eyes
      ctx.fillStyle = '#38bdf8'
      ctx.shadowColor = '#06b6d4'
      ctx.shadowBlur = 8
      ctx.beginPath()
      ctx.arc(eyeLeftX, eyeY, 4.5, 0, Math.PI * 2)
      ctx.arc(eyeRightX, eyeY, 4.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // Highlights
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(eyeLeftX - 1.5, eyeY - 1.5, 1.5, 0, Math.PI * 2)
      ctx.arc(eyeRightX - 1.5, eyeY - 1.5, 1.5, 0, Math.PI * 2)
      ctx.fill()
    }

    // Dynamic Morphing Mouth (Viseme Engine)
    const mouthY = avCenterY + 12
    ctx.save()
    ctx.fillStyle = '#0f172a'
    ctx.strokeStyle = '#f43f5e'
    ctx.lineWidth = 2.5

    if (effectiveVisemeId === 'viseme_aa') {
      // Wide open jaw /AA/
      const openness = 14 + (isPlaying ? Math.sin(currentStep * 0.8) * 3 : 0)
      ctx.beginPath()
      ctx.ellipse(avCenterX, mouthY, 15, openness, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      // Tongue & teeth
      ctx.fillStyle = '#fda4af'
      ctx.beginPath()
      ctx.ellipse(avCenterX, mouthY + openness * 0.4, 9, 5, 0, 0, Math.PI)
      ctx.fill()
    } else if (effectiveVisemeId === 'viseme_oh') {
      // Rounded protruded lips /OH/, /OO/
      ctx.beginPath()
      ctx.ellipse(avCenterX, mouthY, 8, 12, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = '#e11d48'
      ctx.beginPath()
      ctx.arc(avCenterX, mouthY, 4, 0, Math.PI * 2)
      ctx.fill()
    } else if (effectiveVisemeId === 'viseme_ee') {
      // Wide smile with visible upper teeth /EE/
      ctx.beginPath()
      ctx.ellipse(avCenterX, mouthY, 19, 7, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(avCenterX - 11, mouthY - 4, 22, 3.5)
    } else if (effectiveVisemeId === 'viseme_mbp') {
      // Bilabial tightly pressed lips /M/, /B/, /P/
      ctx.beginPath()
      ctx.moveTo(avCenterX - 14, mouthY)
      ctx.lineTo(avCenterX + 14, mouthY)
      ctx.stroke()
    } else if (effectiveVisemeId === 'viseme_fv') {
      // Labiodental teeth over lower lip /F/, /V/
      ctx.beginPath()
      ctx.ellipse(avCenterX, mouthY + 1, 14, 5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      // Top incisors
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(avCenterX - 8, mouthY - 3, 16, 3)
    } else {
      // Resting neutral idle
      ctx.beginPath()
      ctx.moveTo(avCenterX - 10, mouthY)
      ctx.quadraticCurveTo(avCenterX, mouthY + 2, avCenterX + 10, mouthY)
      ctx.stroke()
    }
    ctx.restore()

    // Avatar Label Overlay
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fillRect(16, height - 38, leftWidth - 22, 22)
    ctx.fillStyle = '#cbd5e1'
    ctx.font = '10px monospace'
    ctx.fillText(`AVATAR: ${effectiveVisemeId.toUpperCase()}`, 24, height - 24)

    ctx.restore()

    // -------------------------------------------------------------------------
    // 2. RAW AUDIO WAVEFORM (TOP-RIGHT)
    // -------------------------------------------------------------------------
    const waveY = 15
    const waveH = 95

    // Box header
    ctx.fillStyle = '#94a3b8'
    ctx.font = '11px sans-serif'
    ctx.fillText('RAW PCM AUDIO WAVEFORM (24 kHz)', rightX + 6, waveY + 14)

    // Waveform grid line
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(rightX, waveY + waveH / 2)
    ctx.lineTo(rightX + rightWidth, waveY + waveH / 2)
    ctx.stroke()

    // Animated Bar Equalizer & Continuous Sine Wave
    const numBars = 36
    const barW = Math.max(3, Math.floor(rightWidth / numBars) - 2)
    const midY = waveY + waveH / 2 + 5

    for (let i = 0; i < numBars; i++) {
      const barX = rightX + i * (barW + 2) + 4
      const normI = i / numBars
      const activeFactor = (progressPercent / 100 > normI - 0.1 && progressPercent / 100 < normI + 0.15) ? 1.6 : 0.4
      const energy = isPlaying
        ? Math.sin(i * 0.7 + currentStep * 0.3 * pitch) * Math.cos(i * 0.3) * 32 * activeFactor
        : (effectiveVisemeId !== 'idle' ? Math.sin(i * 0.5) * 16 : 3)

      const barHeight = Math.max(4, Math.abs(energy))

      ctx.fillStyle = i <= (progressPercent / 100) * numBars ? activePreset.accentColor : '#334155'
      ctx.fillRect(barX, midY - barHeight / 2, barW, barHeight)
    }

    // Playhead line
    const playheadX = rightX + (progressPercent / 100) * rightWidth
    ctx.strokeStyle = '#f43f5e'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(playheadX, waveY + 6)
    ctx.lineTo(playheadX, waveY + waveH)
    ctx.stroke()

    // -------------------------------------------------------------------------
    // 3. MEL-SPECTROGRAM FREQUENCY HEAT MAP (BOTTOM-RIGHT)
    // -------------------------------------------------------------------------
    const specY = waveY + waveH + 15
    const specH = 110

    ctx.fillStyle = '#94a3b8'
    ctx.font = '11px sans-serif'
    ctx.fillText('80-BAND LOG MEL-SPECTROGRAM (Acoustic Latent)', rightX + 6, specY + 12)

    const specCols = 24
    const specRows = 8
    const cellW = rightWidth / specCols
    const cellH = (specH - 24) / specRows

    const pattern = activePreset.spectrogramPattern

    for (let r = 0; r < specRows; r++) {
      for (let c = 0; c < specCols; c++) {
        const x = rightX + c * cellW
        const y = specY + 20 + r * cellH

        const patRow = pattern[r % pattern.length]
        const baseIntensity = patRow[c % patRow.length] || 50
        const freqShift = Math.floor(baseIntensity * (pitch / 1.05))

        const isPast = (c / specCols) <= (progressPercent / 100)
        const alpha = isPast ? Math.min(1, freqShift / 100) : 0.15

        // Mel heat map color gradient (Dark Purple -> Cyan -> Yellow)
        if (freqShift > 75) {
          ctx.fillStyle = `rgba(245, 158, 11, ${alpha})` // Amber high frequency
        } else if (freqShift > 50) {
          ctx.fillStyle = `rgba(6, 182, 212, ${alpha})` // Cyan mid resonance
        } else {
          ctx.fillStyle = `rgba(139, 92, 246, ${alpha})` // Purple low formant
        }
        ctx.fillRect(x, y, cellW - 1, cellH - 1)
      }
    }

    // Mel Spectrogram Playhead
    ctx.strokeStyle = '#f43f5e'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(playheadX, specY + 20)
    ctx.lineTo(playheadX, specY + specH)
    ctx.stroke()

  }, [currentStep, maxSteps, activePreset, pitch, speed, isPlaying, effectiveVisemeId, blinkState, activePhoneme, progressPercent])

  const handleStepForward = () => {
    if (currentStep < maxSteps) {
      setCurrentStep(prev => prev + 5)
    }
  }

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => Math.max(0, prev - 5))
    }
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setSelectedViseme('idle')
  }

  const handleRunFull = () => {
    setCurrentStep(0)
    setIsPlaying(true)
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: TITLE,
    description: DESC,
    image: 'https://www.uptools.in/assets/og/default.png',
    author: { '@type': 'Organization', name: 'UpTools', url: 'https://www.uptools.in/' },
    publisher: {
      '@type': 'Organization',
      name: 'UpTools',
      logo: { '@type': 'ImageObject', url: 'https://www.uptools.in/assets/logo/uptools-logo.svg' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
  }

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How Text-to-Speech and Talking Avatars Work Step-by-Step',
    step: [
      {
        '@type': 'HowToStep',
        text: 'Text Normalization & G2P: Written text numbers, dates, and symbols are expanded into clean words and converted into phonetic IPA sound tokens.',
      },
      {
        '@type': 'HowToStep',
        text: 'Acoustic Modeling (Mel-Spectrogram Generation): An acoustic transformer model (FastSpeech / Kokoro) predicts an 80-band frequency mel-spectrogram capturing voice timbre, duration, and pitch (F0).',
      },
      {
        '@type': 'HowToStep',
        text: 'Neural Vocoding: A GAN vocoder (HiFi-GAN / BigVGAN) translates the 2D frequency spectrogram into smooth 24kHz/48kHz continuous raw audio waveforms.',
      },
      {
        '@type': 'HowToStep',
        text: 'Audio-to-Viseme Mapping: The synthesized audio is aligned frame-by-frame with visual mouth shapes (visemes) and 52 facial blendshape parameters.',
      },
      {
        '@type': 'HowToStep',
        text: 'Neural Avatar Video Rendering: The facial warp engine (Wav2Lip / LivePortrait) composites realistic lip motion, blinking, and head sway onto the video canvas in real time.',
      },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <Helmet>
        <title>{TITLE} | UpTools</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content={`${TITLE} | UpTools`} />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="UpTools" />
        <meta property="og:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson9-hero.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${TITLE} | UpTools`} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson9-hero.jpg" />
        <meta
          name="keywords"
          content="voice AI explained, video AI tutorial, neural text to speech, TTS pipeline, mel spectrogram, HiFi-GAN vocoder, voice cloning zero shot, talking avatars, visemes lip sync, Wav2Lip, Python TTS code"
        />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.uptools.in/' },
              { '@type': 'ListItem', position: 2, name: 'Learning', item: 'https://www.uptools.in/learning/' },
              { '@type': 'ListItem', position: 3, name: 'AI', item: 'https://www.uptools.in/learning/ai/' },
              { '@type': 'ListItem', position: 4, name: 'Voice and Video AI', item: URL },
            ],
          })}
        </script>
      </Helmet>

      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5 flex-wrap" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-slate-700">›</span>
        <Link to="/learning" className="hover:text-white transition-colors">Learning</Link>
        <span className="text-slate-700">›</span>
        <Link to="/learning/ai" className="hover:text-white transition-colors">AI</Link>
        <span className="text-slate-700">›</span>
        <span className="text-slate-300 font-medium">Voice and Video AI</span>
      </nav>

      {/* BADGE & HEADER */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mb-4">
        <span>🎤</span> AI · Lesson 9 · Beginner
      </div>
      <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight m-0 mb-3">
        Voice &amp; Video AI: How Neural TTS, Voice Cloning &amp; Talking Avatars Work
      </h1>
      <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
        AI doesn&rsquo;t just generate text and still pictures. Modern <strong>Neural Text-to-Speech (TTS)</strong> models transform written words into expressive, human-quality speech by predicting <strong>Mel-Spectrograms</strong> and synthesizing raw waveforms with <strong>HiFi-GAN vocoders</strong>. Simultaneously, <strong>Audio-Driven Video Avatars</strong> extract phonetic timing to synchronize mouth visemes and facial blendshapes frame-by-frame. Play with the live pipeline simulator below to explore voice pitch, speech velocity, acoustic heat maps, and talking avatar viseme frames.
 </p>
 <figure className="m-0 mb-6 rounded-xl border border-white/10 overflow-hidden">
 <img src="/assets/learning/ai/ai-lesson9-hero.jpg" alt="Text turning into voice waves and a talking avatar" loading="lazy" />
 </figure>

 {/* LIVE INTERACTIVE ANIMATOR */}
      <section
        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6"
        aria-label="Live Voice & Video AI Pipeline Simulator"
      >
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-white m-0">▶ Live Demo: Text-to-Speech &amp; Talking Avatar Synthesis Studio</h2>
            <p className="text-xs text-slate-400 m-0 mt-0.5">
              Type custom text, adjust pitch/speed sliders, test viseme lip-sync frames, and watch the spectrogram &amp; avatar animate in real time.
            </p>
          </div>
          <div className="flex rounded-xl bg-black/40 border border-white/10 p-1 flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'simulator' ? 'bg-cyan-500/30 text-cyan-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              🎙️ Live Voice &amp; Viseme
            </button>
            <button
              onClick={() => setActiveTab('pillars')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'pillars' ? 'bg-cyan-500/30 text-cyan-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              🔬 The 4 Core Pillars
            </button>
            <button
              onClick={() => setActiveTab('hyperparams')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'hyperparams' ? 'bg-cyan-500/30 text-cyan-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              ⚙️ Latency, Pitch &amp; Blendshapes
            </button>
          </div>
        </div>

        {/* TAB 1: INTERACTIVE SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-4">
            {/* PRESET SELECTOR BUTTONS */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-semibold shrink-0">Voice Presets:</span>
              {VOICE_PRESETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-all ${
                    selectedPresetId === p.id
                      ? 'border-cyan-500 bg-cyan-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* TEXT INPUT BOX */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Input Text to Synthesize (Grapheme-to-Phoneme Engine)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  placeholder="Type any sentence to inspect speech synthesis..."
                />
                <button
                  onClick={handleRunFull}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 cursor-pointer hover:opacity-95 shrink-0"
                >
                  {isPlaying ? 'Speaking...' : '🎙️ Synthesize & Speak'}
                </button>
              </div>
            </div>

            {/* VISUALIZER CANVAS (AVATAR + WAVEFORM + SPECTROGRAM) */}
            <div className="rounded-xl border border-white/10 bg-black/50 p-2 overflow-hidden">
              <canvas
                ref={canvasRef}
                width={720}
                height={270}
                className="w-full h-auto block rounded-lg"
              />
            </div>

            {/* TIMELINE PROGRESS & CONTROLS */}
            <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold text-cyan-300">
                    Active Phoneme: <code className="text-white bg-white/10 px-1.5 py-0.5 rounded font-mono">{activePhoneme.ipa}</code> ({activePhoneme.char})
                  </span>
                  <span className="font-mono text-slate-400">
                    Progress: {progressPercent}% ({currentStep}/{maxSteps} frames)
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={maxSteps}
                  value={currentStep}
                  onChange={e => {
                    setIsPlaying(false)
                    setCurrentStep(parseInt(e.target.value, 10))
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* TRANSPORT PLAYBACK CONTROLS */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 cursor-pointer"
                  >
                    {isPlaying ? '⏸ Pause' : '▶ Play'}
                  </button>
                  <button
                    onClick={handleStepBack}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 cursor-pointer"
                  >
                    ⏮ -5 Frames
                  </button>
                  <button
                    onClick={handleStepForward}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 cursor-pointer"
                  >
                    +5 Frames ⏭
                  </button>
                  <button
                    onClick={handleReset}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 cursor-pointer"
                  >
                    🔄 Reset
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-semibold">Pitch:</span>
                    <input
                      type="range"
                      min={0.7}
                      max={1.4}
                      step={0.05}
                      value={pitch}
                      onChange={e => setPitch(parseFloat(e.target.value))}
                      className="w-20 accent-cyan-400 cursor-pointer"
                    />
                    <span className="font-mono text-cyan-300 w-8 text-right">{pitch.toFixed(2)}x</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-semibold">Speed:</span>
                    <input
                      type="range"
                      min={0.6}
                      max={1.8}
                      step={0.1}
                      value={speed}
                      onChange={e => setSpeed(parseFloat(e.target.value))}
                      className="w-20 accent-cyan-400 cursor-pointer"
                    />
                    <span className="font-mono text-cyan-300 w-8 text-right">{speed.toFixed(1)}x</span>
                  </div>
                </div>
              </div>

              {/* TALKING AVATAR VISEME FRAME SELECTOR */}
              <div className="pt-3 border-t border-white/10">
                <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                  <span>👄 Talking-Avatar Viseme / Morph Target Frame Selector:</span>
                  <span className="text-[11px] text-slate-400 font-normal">Click a frame to freeze &amp; inspect mouth geometry</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {VISEME_FRAMES.map(vf => (
                    <button
                      key={vf.id}
                      onClick={() => {
                        setIsPlaying(false)
                        setSelectedViseme(vf.id)
                      }}
                      className={`text-left p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        effectiveVisemeId === vf.id
                          ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-lg shadow-cyan-500/10'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="font-bold text-cyan-300 mb-0.5">{vf.label}</div>
                      <div className="font-mono text-[10px] text-slate-400">{vf.ipa}</div>
                      <div className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">{vf.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 4 CORE PILLARS */}
        {activeTab === 'pillars' && (
          <div className="rounded-xl border border-white/10 bg-black/30 p-5 mb-4">
            <h3 className="text-sm font-bold text-white mb-2">🔬 The 4 Core Pillars of Voice &amp; Video AI</h3>
            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              Modern voice agents and real-time talking video avatars bridge four distinct machine learning and signal processing sub-systems:
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  step: '01',
                  title: 'Grapheme-to-Phoneme (G2P)',
                  icon: '🔤',
                  color: 'border-blue-500/30 bg-blue-500/[0.04]',
                  text: 'Normalizes numbers, acronyms, and homographs ("read" vs "read"). Maps raw text into precise International Phonetic Alphabet (IPA) sound tokens.',
                },
                {
                  step: '02',
                  title: 'Acoustic Model (Mel Latent)',
                  icon: '📊',
                  color: 'border-purple-500/30 bg-purple-500/[0.04]',
                  text: 'Predicts 80-band frequency Mel-Spectrograms from phoneme tokens, calculating pitch curve (F0), phoneme duration, and speaker emotion embeddings.',
                },
                {
                  step: '03',
                  title: 'Neural Vocoder (Waveform)',
                  icon: '🌊',
                  color: 'border-emerald-500/30 bg-emerald-500/[0.04]',
                  text: 'Translates 2D frequency spectrograms into continuous 24kHz/48kHz PCM raw pressure waves using fast GANs (HiFi-GAN) or diffusion flow matching.',
                },
                {
                  step: '04',
                  title: 'Lip-Sync & Viseme Avatars',
                  icon: '🎬',
                  color: 'border-amber-500/30 bg-amber-500/[0.04]',
                  text: 'Extracts phonetic sync timestamps to drive 52 ARKit facial blendshapes or latent neural warps (Wav2Lip, LivePortrait) for lifelike video motion.',
                },
              ].map(st => (
                <div key={st.step} className={`p-4 rounded-xl border ${st.color} flex flex-col justify-between`}>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{st.icon}</span>
                      <span className="text-xs font-mono font-extrabold text-slate-400">STAGE {st.step}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1.5">{st.title}</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed m-0">{st.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: HYPERPARAMETERS & METRICS */}
        {activeTab === 'hyperparams' && (
          <div className="rounded-xl border border-white/10 bg-black/30 p-5 mb-4">
            <h3 className="text-sm font-bold text-white mb-2">⚙️ Voice &amp; Video AI Hyperparameters Cheatsheet</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Key engineering levers that control synthesis latency, emotional prosody, voice similarity, and visual video alignment:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-white/15 bg-white/5">
                    <th className="p-3 text-white font-bold">Parameter / Metric</th>
                    <th className="p-3 text-cyan-300 font-bold">Production Target</th>
                    <th className="p-3 text-emerald-300 font-bold">What It Controls &amp; Engineering Trade-offs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-3 font-semibold text-white">Real-Time Factor (RTF)</td>
                    <td className="p-3 text-cyan-300 font-mono">&lt; 0.15x</td>
                    <td className="p-3 text-slate-300">Ratio of compute time to audio duration. Lower RTF allows streaming words to users in under 100ms.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Sample Rate (PCM)</td>
                    <td className="p-3 text-cyan-300 font-mono">24,000 Hz / 48,000 Hz</td>
                    <td className="p-3 text-slate-300">Acoustic fidelity. 16kHz is fine for phone IVR; 24kHz–48kHz is standard for broadcast studio quality.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Speaker Embedding Dim</td>
                    <td className="p-3 text-cyan-300 font-mono">256 or 512-dim d-vector</td>
                    <td className="p-3 text-slate-300">Latent fingerprint of vocal tract resonance and accent used for zero-shot instant voice cloning.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Mel-Filterbank Bins</td>
                    <td className="p-3 text-cyan-300 font-mono">80 or 128 Mel channels</td>
                    <td className="p-3 text-slate-300">Logarithmic frequency resolution for acoustic modeling matching human psychoacoustic sensitivity.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Viseme Sync Window</td>
                    <td className="p-3 text-cyan-300 font-mono">30 FPS / 33.3ms per frame</td>
                    <td className="p-3 text-slate-300">Temporal resolution for lip-sync blendshapes. Smooth interpolation prevents jerky mouth chatter.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-[11px] text-slate-500 m-0">
          💡 <strong>Key Takeaway:</strong> Neural Voice and Video AI converts symbolic text into acoustic frequency blueprints (Mel-Spectrograms), converts them to continuous audio with neural vocoders, and synchronizes video avatar mouth geometry (visemes) in real time.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <figure className="m-0 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson9-pipeline.jpg" alt="Speech pipeline from text to phonemes to waveform" loading="lazy" />
        </figure>
        <figure className="m-0 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson9-avatar.jpg" alt="Robot on a video call with lipsync waves" loading="lazy" />
        </figure>
      </div>
      {/* EXPLANATION */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-3">How Neural Speech &amp; Video Avatars Work Under the Hood</h2>
        <ol className="text-sm text-slate-300 leading-relaxed space-y-2.5 list-decimal pl-5 m-0">
          <li>
            <strong className="text-white">Text Normalization &amp; Phonetic Tokenization:</strong> The pipeline parses raw strings (&ldquo;$50&rdquo; &rarr; &ldquo;fifty dollars&rdquo;) and uses Grapheme-to-Phoneme (G2P) networks to convert words into phonemes (/f/, /ɪ/, /f/, /t/, /i/).
          </li>
          <li>
            <strong className="text-white">Acoustic Latent Modeling:</strong> A neural network (such as FastSpeech 2 or Kokoro) predicts the duration of each sound, the fundamental pitch contour (F0), and generates a 2D Mel-Spectrogram that details sound frequencies over time.
          </li>
          <li>
            <strong className="text-white">HiFi-GAN Neural Vocoder Synthesis:</strong> The vocoder runs multi-scale transposed convolutions to synthesize raw 24,000-sample-per-second air pressure audio waves from the spectrogram without robotic distortion.
          </li>
          <li>
            <strong className="text-white">Audio-Driven Viseme Lip-Syncing:</strong> Audio features are passed to a lip synchronization model (such as Wav2Lip or SadTalker) to drive 52 facial blendshapes or latent neural warps, rendering synchronized video avatars frame-by-frame.
          </li>
        </ol>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 text-center">
          {[
            ['G2P Tokenizer', 'Phoneme expansion', 'IPA phonetic mapping'],
            ['Acoustic Model', 'Mel-Spectrogram', '80-band frequency latent'],
            ['HiFi-GAN Vocoder', 'Waveform synthesis', '24kHz raw PCM audio'],
            ['Viseme Engine', 'ARKit blendshapes', '30 FPS lip-sync video'],
          ].map(([a, b, c]) => (
            <div key={a} className="rounded-xl bg-black/30 border border-white/10 px-2 py-3">
              <div className="text-[11px] text-slate-400 font-semibold">{a}</div>
              <div className="text-sm sm:text-base font-extrabold text-white">{b}</div>
              <div className="text-[10px] text-slate-500 leading-snug">{c}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CODE BLOCK */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-3">Code: Complete Neural Voice &amp; Video Pipeline in Python &amp; JavaScript</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">
          Synthesize voice audio programmatically with custom speaker embeddings and invoke real-time talking avatar streams:
        </p>
        <div className="space-y-3">
          <CodeBlock lang="Python (SpeechT5 / Torchaudio / Transformers)" code={PY_CODE} />
          <CodeBlock lang="JavaScript (ElevenLabs / Node.js Stream)" code={JS_CODE} />
        </div>
      </section>

      {/* PRACTICE QUESTIONS */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-1">Practice questions</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">
          Common machine learning and AI developer interview questions on speech synthesis, acoustic modeling, and generative video avatars.
        </p>
        <div className="space-y-2.5">
          {QUESTIONS.map((it, i) => (
            <details key={i} className="rounded-xl bg-black/30 border border-white/10 px-4 py-1 group">
              <summary className="cursor-pointer text-sm font-semibold text-white py-2.5 list-none flex items-center gap-2">
                <span className="text-cyan-400 text-xs font-bold shrink-0">Q{i + 1}</span>
                {it.q}
              </summary>
              <p className="text-xs text-slate-300 pb-3 pl-8 leading-relaxed m-0">{it.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* INTERVIEW TIPS */}
      <section
        className="rounded-2xl border border-cyan-500/20 p-5 sm:p-6 mb-6"
        style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(17,24,39,0.4))' }}
      >
        <h2 className="text-lg font-bold text-white mt-0 mb-3">🎤 Interview tips</h2>
        <ul className="text-sm text-slate-300 leading-relaxed space-y-2 list-disc pl-5 m-0">
          <li>
            <strong className="text-white">Explain the 2-stage TTS breakdown:</strong> &ldquo;Modern TTS pipelines split generation into Acoustic Modeling (text &rarr; 80-band Mel-Spectrogram) and Neural Vocoding (spectrogram &rarr; 24kHz raw PCM waveform). This separation makes training stable and allows mixing and matching speaker embeddings.&rdquo;
          </li>
          <li>
            <strong className="text-white">Master Speaker Embeddings (d-vectors):</strong> &ldquo;Zero-shot voice cloning uses a speaker encoder to extract a fixed-dimensional embedding (e.g. 256 dimensions) from a reference audio clip, conditioning cross-attention layers to mirror vocal timbre without model fine-tuning.&rdquo;
          </li>
          <li>
            <strong className="text-white">Articulate the difference between Phonemes &amp; Visemes:</strong> &ldquo;Phonemes are acoustic sound units (~44 in English), while Visemes are visual mouth shapes (~15 to 21). Multiple phonemes (like /p/, /b/, /m/) map to the same visual bilabial closure viseme.&rdquo;
          </li>
          <li>
            <strong className="text-white">Discuss Low-Latency Streaming Architectures:</strong> &ldquo;For conversational voice bots, we stream text tokens via WebSockets and use non-autoregressive chunked acoustic models with streaming HiFi-GAN vocoders to achieve sub-100ms Time-to-First-Audio (TTFA).&rdquo;
          </li>
          <li>
            <strong className="text-white">Contrast 2D Lip-Sync vs 3D Gaussian Avatars:</strong> &ldquo;2D models (Wav2Lip) warp 2D face pixels for frontal video. 3D Gaussian Splatting and NeRF digital humans reconstruct full volumetric 3D meshes, supporting head rotation and dynamic camera angles.&rdquo;
          </li>
        </ul>
      </section>

      {/* FAQ ACCORDION COMPONENT */}
      <FAQ questions={FAQS} />

      {/* PREV / NEXT NAVIGATION */}
      <div className="flex items-center justify-between flex-wrap gap-3 mt-6">
        <Link to="/learning/ai/image-generation-basics" className="text-sm font-semibold text-cyan-300 no-underline hover:text-white transition-colors">
          ← Lesson 8: Image Generation Basics
        </Link>
        <Link to="/learning/ai/ai-for-resumes-interviews" className="text-sm font-semibold text-cyan-300 no-underline hover:text-white transition-colors">
          Lesson 10: AI for Resumes &amp; Interviews →
        </Link>
      </div>
    </>
  )
}

import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import FAQ from '../components/FAQ'

const TITLE = 'Image Generation Basics: How Diffusion Models Turn Text into Images'
const DESC = 'Learn how AI image generation works with an interactive diffusion simulator — explore prompt strength (CFG scale), step-by-step progressive denoising stages, text conditioning with CLIP, and latent space decoding. Includes Python & JavaScript code, 5 practice questions, 4 FAQs and interview tips.'
const URL = 'https://www.uptools.in/learning/ai/image-generation-basics/'

// ---------------------------------------------------------------------------
// Sample Prompt Presets
// ---------------------------------------------------------------------------
const PROMPT_PRESETS = [
  {
    id: 'cyber-cat',
    name: '🐱 Cyberpunk Cat Astronaut',
    prompt: 'A cyberpunk cat astronaut in a glowing neon helmet exploring a crystal alien planet, volumetric lighting, vibrant purple and cyan bioluminescence, 8k resolution',
    negativePrompt: 'blurry, low quality, distorted anatomy, extra ears, oversaturated artifacts',
    seed: 42819,
    accentColor: '#06b6d4',
    secondaryColor: '#a855f7',
    subject: 'Cyberpunk Cat Astronaut',
    stages: [
      { stepPercent: 0, label: 'Pure Gaussian Noise', desc: 'Random latent tensor sampled from standard normal distribution z ~ N(0, I). No intelligible structure.' },
      { stepPercent: 25, label: 'Coarse Composition & Colors', desc: 'CLIP text embeddings guide U-Net to establish warm violet background and central helmet silhouette.' },
      { stepPercent: 50, label: 'Structural Contours & Facial Geometry', desc: 'U-Net iteratively subtracts predicted noise. Cat whiskers, visor glass reflection, and shoulder suit contours appear.' },
      { stepPercent: 75, label: 'High-Frequency Textures & Lighting', desc: 'Volumetric light streaks, crystal reflections, suit fabric stitching, and neon glow halos resolve.' },
      { stepPercent: 100, label: 'VAE Decoded High-Resolution Output', desc: 'Latent representation is decoded by the VAE decoder into crisp 512x512 RGB pixel space.' },
    ],
  },
  {
    id: 'watercolor-cottage',
    name: '🏡 Misty Watercolor Cottage',
    prompt: 'A serene watercolor painting of a fairy-tale stone cottage near a misty mountain lake at sunrise, soft pastel washes, gold and pine green tones, masterclass illustration',
    negativePrompt: 'harsh digital lines, photorealistic, dark gloomy colors, oversaturated, deformed doors',
    seed: 19842,
    accentColor: '#10b981',
    secondaryColor: '#f59e0b',
    subject: 'Watercolor Cottage',
    stages: [
      { stepPercent: 0, label: 'Pure Gaussian Noise', desc: 'Initial latent noise tensor. Zero semantic meaning, maximum entropy.' },
      { stepPercent: 25, label: 'Horizon & Palette Blocking', desc: 'Text conditioning establishes soft morning mist horizon and dominant earthy watercolor washes.' },
      { stepPercent: 50, label: 'Cottage Silhouette & Lake Reflection', desc: 'Stone wall geometry, chimney smoke curve, and watery mirror reflections begin resolving.' },
      { stepPercent: 75, label: 'Texture Washes & Pine Needles', desc: 'Fine watercolor paper grain, subtle mountain ridges, and glowing sunrise rim-lighting emerge.' },
      { stepPercent: 100, label: 'Final Masterpiece Render', desc: 'VAE translates the denoised latent tensor into an authentic, textured watercolor art piece.' },
    ],
  },
  {
    id: 'neon-hypercar',
    name: '🏎️ Neon Cyber Hypercar',
    prompt: 'Sleek futuristic electric hypercar speeding through a rainy Tokyo street at midnight, neon light trail reflections on wet asphalt, cinematic bokeh, photorealistic 8k',
    negativePrompt: 'cartoon, low-res, deformed wheels, asymmetrical headlights, bad reflections',
    seed: 90214,
    accentColor: '#3b82f6',
    secondaryColor: '#ec4899',
    subject: 'Cyber Hypercar',
    stages: [
      { stepPercent: 0, label: 'Pure Gaussian Noise', desc: 'Initial random noise matrix across 4 latent channels.' },
      { stepPercent: 25, label: 'Perspective Grid & Color Streaks', desc: 'Text prompt conditions the network to lay down a central vanishing point with blue and pink light bars.' },
      { stepPercent: 50, label: 'Aerodynamic Chassis & Wet Ground', desc: 'Curved hood, illuminated carbon-fiber bodywork, and puddles forming asphalt reflections.' },
      { stepPercent: 75, label: 'Rain Streaks & Headlight Flares', desc: 'Reflective raindrops on the windshield, tire water spray, and sharp neon billboard bokeh.' },
      { stepPercent: 100, label: 'Photorealistic Final Render', desc: 'VAE decompresses 64x64 latent features into sharp, cinematic 8k-style RGB pixels.' },
    ],
  },
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
    q: 'How does a Diffusion Model generate an image from random Gaussian noise?',
    a: 'Diffusion models work in two phases: Forward Diffusion (training) and Reverse Diffusion (generation). During training, Gaussian noise is gradually added to millions of real images over 1,000 steps until they become pure noise. A neural network (U-Net or Diffusion Transformer) is trained to predict the exact noise added at each step. During generation (inference), the model starts with pure random noise and a text prompt. Over 20 to 50 iterations, it uses the prompt to iteratively predict and subtract the noise, gradually sculpting crisp shapes, textures, and details out of chaos.',
  },
  {
    q: 'What is Classifier-Free Guidance (CFG / Prompt Strength) and what happens if it is set too high or low?',
    a: 'Classifier-Free Guidance (CFG scale) controls how strictly the diffusion model adheres to your text prompt versus creative hallucination. Mathematically, the model computes two noise predictions at each step: one unconditional (empty prompt) and one conditional (your text prompt). The final direction is: Final = Unconditional + CFG * (Conditional - Unconditional). A low CFG (1–3) results in creative, dreamy, but prompt-ignoring images. A balanced CFG (6–8) gives sharp detail and faithful prompt alignment. A very high CFG (>14) forces unnatural contrast, color banding, and fried/oversaturated artifacts.',
  },
  {
    q: 'Why do modern models like Stable Diffusion operate in Latent Space instead of Pixel Space?',
    a: 'A standard 512x512 RGB image contains 786,432 numerical pixel values (512x512x3). Running a deep neural network across 50 denoising steps directly in pixel space is computationally prohibitive and slow. Latent Diffusion Models (LDM) use a pre-trained Variational Autoencoder (VAE) to compress the image by a factor of 8x into a compact 64x64x4 latent tensor (only 16,384 values — 48x fewer numbers). The diffusion process happens entirely in this efficient latent space, and the VAE decoder expands the final latent back into a high-resolution pixel image at the very last step.',
  },
  {
    q: 'What is the role of the Text Encoder (CLIP / T5) and Cross-Attention in image generation?',
    a: 'The diffusion U-Net understands spatial numbers, not raw words. A pretrained Text Encoder (such as OpenAI CLIP ViT-L or Google T5-XXL) converts the input prompt text into rich token embedding vectors. Inside each layer of the U-Net or Diffusion Transformer, Cross-Attention layers compute mathematical dot products between the image feature maps and the text token embeddings. This allows the model to inject the prompt’s meaning ("cat", "neon helmet", "sunset") directly into the corresponding spatial regions of the developing image.',
  },
  {
    q: 'How do Negative Prompts work mathematically in the diffusion sampling step?',
    a: 'Negative prompts allow you to specify concepts you want the model to avoid (e.g. "blurry, extra fingers, text, watermark"). Instead of calculating unconditional noise using an empty prompt, the model calculates the negative conditioning using the negative prompt tokens. In the CFG formula, it subtracts the noise vector that leads toward the negative prompt concepts, steering the reverse diffusion trajectory away from those undesirable visual features.',
  },
]

const FAQS = [
  {
    q: 'What is the difference between Diffusion Models and GANs (Generative Adversarial Networks)?',
    a: 'GANs use two competing networks: a Generator that creates fake images in a single forward pass, and a Discriminator that tries to spot the fakes. While GANs are very fast, they suffer from training instability and "mode collapse" (producing limited variations). Diffusion models generate images iteratively by reversing a step-by-step noise process. They offer far superior prompt alignment, diverse sample quality, and stable training, making them the standard foundation for modern AI image generators (Stable Diffusion, Midjourney, DALL-E 3, Flux).',
  },
  {
    q: 'What are Sampling Schedulers (Euler, DDIM, DPM++) and why do step counts matter?',
    a: 'A sampling scheduler determines the mathematical algorithm used to estimate and subtract noise at each step. Older schedulers like DDPM required 1,000 steps. Modern numerical ODE/SDE solvers (such as Euler a, DPM++ 2M Karras, or DDIM) can produce high-quality images in just 20 to 30 steps. Increasing steps beyond 40–50 yields diminishing returns and higher compute latency without noticeable quality gains.',
  },
  {
    q: 'What is a LoRA (Low-Rank Adaptation) and how does it customize image models?',
    a: 'A LoRA is a lightweight fine-tuning technique that allows you to teach a base image model new characters, specific artistic styles, or objects with tiny file sizes (typically 10MB to 150MB, compared to 2GB–10GB for full models). LoRA freezes the base model weights and only trains small low-rank matrix decomposition adapter layers, making it easy to share, combine, and switch styles on the fly.',
  },
  {
    q: 'How does Image-to-Image (Img2Img) and Inpainting work in diffusion pipelines?',
    a: 'In Img2Img, instead of starting from 100% pure random noise, the pipeline encodes an existing input image with the VAE and adds a controlled amount of noise (determined by a Denoising Strength slider, e.g. 0.6 = 60% noise). The reverse diffusion starts midway, preserving the overall composition while changing textures and styles according to the new prompt. Inpainting uses a black-and-white mask: unmasked pixels are kept frozen, while masked regions are filled with noise and redrawn to match the prompt seamlessly.',
  },
]

const PY_CODE = `import torch
from diffusers import StableDiffusionXLPipeline, DPMSolverMultistepScheduler

# 1. Load Pretrained Latent Diffusion Pipeline (e.g., SDXL / SD 1.5)
model_id = "stabilityai/stable-diffusion-xl-base-1.0"
pipe = StableDiffusionXLPipeline.from_pretrained(
    model_id, 
    torch_dtype=torch.float16, 
    variant="fp16",
    use_safetensors=True
)

# 2. Use high-efficiency fast sampler (DPM++ 2M Karras solver: 25-30 steps)
pipe.scheduler = DPMSolverMultistepScheduler.from_config(
    pipe.scheduler.config, 
    use_karras_sigmas=True
)
pipe.to("cuda" if torch.cuda.is_available() else "cpu")

# 3. Define Prompt, Negative Prompt & Hyperparameters
prompt = "A cyberpunk cat astronaut in a glowing neon helmet exploring a crystal alien planet, volumetric lighting, 8k"
negative_prompt = "blurry, low quality, distorted anatomy, extra limbs, watermark, artifacts"

# 4. Generate Image with Controlled Guidance Scale & Steps
generator = torch.Generator("cuda").manual_seed(42819)

image = pipe(
    prompt=prompt,
    negative_prompt=negative_prompt,
    num_inference_steps=30,      # Number of progressive denoising iterations
    guidance_scale=7.5,           # Classifier-Free Guidance (CFG) prompt adherence
    height=1024,
    width=1024,
    generator=generator
).images[0]

# 5. Save final VAE-decoded RGB output
image.save("cyberpunk_cat_astronaut.png")
print("✅ Image generated and saved successfully!")`

const JS_CODE = `// Modern AI Image Generation with Replicate / HuggingFace Inference API (Node.js & Web)
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function generateAIImage() {
  console.log("🎨 Submitting prompt to Latent Diffusion Pipeline...");

  const input = {
    prompt: "A cyberpunk cat astronaut in a glowing neon helmet exploring a crystal alien planet, volumetric lighting, 8k",
    negative_prompt: "blurry, low quality, distorted anatomy, extra limbs, watermark",
    width: 1024,
    height: 1024,
    num_inference_steps: 30,  // Progressive reverse diffusion steps
    guidance_scale: 7.5,      // CFG scale: prompt adherence strength
    scheduler: "K_EULER_ANCESTRAL",
    seed: 42819
  };

  try {
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      { input }
    );

    console.log("✅ Generation complete! Output image URL:", output[0]);
    return output[0];
  } catch (error) {
    console.error("❌ Image generation failed:", error);
  }
}

// generateAIImage();`

export default function ImageGenPage() {
  const [activeTab, setActiveTab] = useState('simulator') // 'simulator' | 'components' | 'hyperparams'
  const [selectedPresetId, setSelectedPresetId] = useState('cyber-cat')
  const [cfgScale, setCfgScale] = useState(7.5)
  const [maxSteps, setMaxSteps] = useState(30)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(120) // ms per step
  const [negativePromptEnabled, setNegativePromptEnabled] = useState(true)
  const [seed, setSeed] = useState(42819)
  const [resolution, setResolution] = useState('512x512')

  const timerRef = useRef(null)
  const canvasRef = useRef(null)

  const activePreset = useMemo(() => {
    return PROMPT_PRESETS.find(p => p.id === selectedPresetId) || PROMPT_PRESETS[0]
  }, [selectedPresetId])

  // Denoising progress percentage (0% = pure noise, 100% = clear image)
  const progressPercent = Math.min(100, Math.round((currentStep / maxSteps) * 100))
  const noiseRemaining = Math.max(0, 100 - progressPercent)

  // Auto-play stepper
  useEffect(() => {
    if (isPlaying) {
      if (currentStep < maxSteps) {
        timerRef.current = setTimeout(() => {
          setCurrentStep(prev => prev + 1)
        }, playbackSpeed)
      } else {
        setIsPlaying(false)
      }
    }
    return () => clearTimeout(timerRef.current)
  }, [isPlaying, currentStep, maxSteps, playbackSpeed])

  // Canvas visual simulation of progressive noise reduction and emergent artwork
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    const t = currentStep / maxSteps // 0.0 to 1.0
    const contrastFactor = Math.min(1.6, Math.max(0.6, cfgScale / 7.5))

    // Base background gradient based on preset and step
    const grad = ctx.createLinearGradient(0, 0, width, height)
    if (activePreset.id === 'cyber-cat') {
      grad.addColorStop(0, `rgba(${Math.floor(20 + t * 40)}, ${Math.floor(10 + t * 15)}, ${Math.floor(40 + t * 70)}, 1)`)
      grad.addColorStop(1, `rgba(${Math.floor(10 + t * 15)}, ${Math.floor(30 + t * 60)}, ${Math.floor(60 + t * 90)}, 1)`)
    } else if (activePreset.id === 'watercolor-cottage') {
      grad.addColorStop(0, `rgba(${Math.floor(40 + t * 80)}, ${Math.floor(40 + t * 60)}, ${Math.floor(50 + t * 30)}, 1)`)
      grad.addColorStop(1, `rgba(${Math.floor(20 + t * 30)}, ${Math.floor(40 + t * 70)}, ${Math.floor(30 + t * 40)}, 1)`)
    } else {
      grad.addColorStop(0, `rgba(${Math.floor(15 + t * 25)}, ${Math.floor(20 + t * 40)}, ${Math.floor(50 + t * 90)}, 1)`)
      grad.addColorStop(1, `rgba(${Math.floor(30 + t * 50)}, ${Math.floor(10 + t * 20)}, ${Math.floor(40 + t * 60)}, 1)`)
    }
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)

    // Render progressive composition shapes as t increases
    if (t > 0.05) {
      ctx.save()
      ctx.globalAlpha = Math.min(1, t * 1.3)

      if (activePreset.id === 'cyber-cat') {
        // Neon cat astronaut composition
        const cx = width / 2
        const cy = height * 0.52

        // Glow aura
        const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 120 * contrastFactor)
        glow.addColorStop(0, `rgba(6, 182, 212, ${0.4 * t})`)
        glow.addColorStop(0.7, `rgba(168, 85, 247, ${0.3 * t})`)
        glow.addColorStop(1, 'transparent')
        ctx.fillStyle = glow
        ctx.fillRect(0, 0, width, height)

        // Space suit shoulders
        ctx.fillStyle = `rgba(${Math.floor(40 * contrastFactor)}, ${Math.floor(50 * contrastFactor)}, ${Math.floor(70 * contrastFactor)}, ${t})`
        ctx.beginPath()
        ctx.ellipse(cx, cy + 90, 110, 60, 0, 0, Math.PI * 2)
        ctx.fill()

        // Helmet ring / visor
        ctx.lineWidth = 6 * contrastFactor
        ctx.strokeStyle = `rgba(6, 182, 212, ${Math.min(1, t * 1.2)})`
        ctx.beginPath()
        ctx.arc(cx, cy, 65, 0, Math.PI * 2)
        ctx.stroke()

        // Visor glass fill with neon reflection
        const visorGrad = ctx.createLinearGradient(cx - 50, cy - 50, cx + 50, cy + 50)
        visorGrad.addColorStop(0, `rgba(15, 23, 42, ${0.85 * t})`)
        visorGrad.addColorStop(0.6, `rgba(168, 85, 247, ${0.5 * t})`)
        visorGrad.addColorStop(1, `rgba(6, 182, 212, ${0.7 * t})`)
        ctx.fillStyle = visorGrad
        ctx.beginPath()
        ctx.arc(cx, cy, 62, 0, Math.PI * 2)
        ctx.fill()

        // Cat ears on helmet
        ctx.fillStyle = `rgba(30, 41, 59, ${t})`
        ctx.beginPath()
        ctx.moveTo(cx - 45, cy - 45)
        ctx.lineTo(cx - 65, cy - 95)
        ctx.lineTo(cx - 20, cy - 60)
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(cx + 45, cy - 45)
        ctx.lineTo(cx + 65, cy - 95)
        ctx.lineTo(cx + 20, cy - 60)
        ctx.fill()

        // Glowing cat eyes inside visor (emerge at step > 40%)
        if (t > 0.35) {
          const eyeAlpha = Math.min(1, (t - 0.35) * 1.8)
          ctx.fillStyle = `rgba(52, 211, 153, ${eyeAlpha})`
          ctx.beginPath()
          ctx.ellipse(cx - 22, cy - 10, 8 * contrastFactor, 12 * contrastFactor, -0.1, 0, Math.PI * 2)
          ctx.ellipse(cx + 22, cy - 10, 8 * contrastFactor, 12 * contrastFactor, 0.1, 0, Math.PI * 2)
          ctx.fill()

          // Visor cyan reflection arc
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.6 * eyeAlpha})`
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(cx - 15, cy - 15, 40, -Math.PI * 0.7, -Math.PI * 0.2)
          ctx.stroke()
        }
      } else if (activePreset.id === 'watercolor-cottage') {
        // Watercolor cottage composition
        const cx = width * 0.48
        const cy = height * 0.58

        // Sunrise sky wash
        const sky = ctx.createLinearGradient(0, 0, 0, height * 0.5)
        sky.addColorStop(0, `rgba(251, 191, 36, ${0.45 * t})`)
        sky.addColorStop(0.6, `rgba(244, 114, 182, ${0.35 * t})`)
        sky.addColorStop(1, `rgba(217, 249, 157, ${0.2 * t})`)
        ctx.fillStyle = sky
        ctx.fillRect(0, 0, width, height * 0.55)

        // Distant mist mountains
        ctx.fillStyle = `rgba(74, 93, 110, ${0.5 * t})`
        ctx.beginPath()
        ctx.moveTo(0, height * 0.45)
        ctx.lineTo(width * 0.3, height * 0.3)
        ctx.lineTo(width * 0.65, height * 0.42)
        ctx.lineTo(width, height * 0.32)
        ctx.lineTo(width, height * 0.5)
        ctx.lineTo(0, height * 0.5)
        ctx.fill()

        // Lake reflection water
        const water = ctx.createLinearGradient(0, height * 0.55, 0, height)
        water.addColorStop(0, `rgba(56, 189, 248, ${0.4 * t})`)
        water.addColorStop(1, `rgba(16, 185, 129, ${0.6 * t})`)
        ctx.fillStyle = water
        ctx.fillRect(0, height * 0.55, width, height * 0.45)

        // Stone Cottage
        ctx.fillStyle = `rgba(120, 85, 60, ${t})`
        ctx.fillRect(cx - 50, cy - 25, 100, 55)

        // Cottage Triangular Roof
        ctx.fillStyle = `rgba(180, 83, 9, ${t * contrastFactor})`
        ctx.beginPath()
        ctx.moveTo(cx - 65, cy - 25)
        ctx.lineTo(cx, cy - 70)
        ctx.lineTo(cx + 65, cy - 25)
        ctx.closePath()
        ctx.fill()

        // Glowing warm window
        if (t > 0.4) {
          ctx.fillStyle = `rgba(253, 224, 71, ${Math.min(1, (t - 0.4) * 2)})`
          ctx.fillRect(cx - 30, cy - 10, 20, 20)
          ctx.fillRect(cx + 10, cy - 10, 20, 20)
        }
      } else {
        // Neon Cyber Hypercar composition
        const cx = width / 2
        const cy = height * 0.62

        // Rainy street reflection grid
        const road = ctx.createLinearGradient(0, height * 0.5, 0, height)
        road.addColorStop(0, `rgba(15, 23, 42, ${0.8 * t})`)
        road.addColorStop(0.6, `rgba(30, 27, 75, ${0.9 * t})`)
        road.addColorStop(1, `rgba(15, 23, 42, ${t})`)
        ctx.fillStyle = road
        ctx.fillRect(0, height * 0.45, width, height * 0.55)

        // Neon street speed streaks
        ctx.strokeStyle = `rgba(236, 72, 153, ${0.6 * t})`
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(cx - 140, height)
        ctx.lineTo(cx - 30, height * 0.5)
        ctx.moveTo(cx + 140, height)
        ctx.lineTo(cx + 30, height * 0.5)
        ctx.stroke()

        // Car body chassis
        ctx.fillStyle = `rgba(30, 58, 138, ${t * contrastFactor})`
        ctx.beginPath()
        ctx.ellipse(cx, cy, 95, 28, 0, 0, Math.PI * 2)
        ctx.fill()

        // Windshield and roofline
        ctx.fillStyle = `rgba(15, 23, 42, ${t * 1.1})`
        ctx.beginPath()
        ctx.ellipse(cx, cy - 14, 55, 18, 0, 0, Math.PI * 2)
        ctx.fill()

        // Cyberpunk Headlights & Taillights
        if (t > 0.3) {
          const lightAlpha = Math.min(1, (t - 0.3) * 1.8)
          // Front neon cyan laser lights
          ctx.fillStyle = `rgba(6, 182, 212, ${lightAlpha})`
          ctx.shadowColor = '#06b6d4'
          ctx.shadowBlur = 15 * contrastFactor
          ctx.fillRect(cx - 85, cy + 2, 35, 6)
          ctx.fillRect(cx + 50, cy + 2, 35, 6)
          ctx.shadowBlur = 0
        }
      }

      ctx.restore()
    }

    // Overlay Gaussian Noise matrix according to remaining noise level
    if (noiseRemaining > 0) {
      const imgData = ctx.getImageData(0, 0, width, height)
      const data = imgData.data
      const noiseAlpha = noiseRemaining / 100 // 1.0 down to 0.0
      const noiseIntensity = 220 * noiseAlpha

      // Deterministic noise seeded pattern with step jitter
      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < noiseAlpha) {
          const rand = (Math.random() - 0.5) * noiseIntensity
          data[i] = Math.min(255, Math.max(0, data[i] + rand))
          data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + rand))
          data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + rand))
        }
      }
      ctx.putImageData(imgData, 0, 0)
    }
  }, [currentStep, maxSteps, activePreset, cfgScale, noiseRemaining])

  const handleStepForward = () => {
    if (currentStep < maxSteps) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
  }

  const handleRunFull = () => {
    setCurrentStep(0)
    setIsPlaying(true)
  }

  const handleRandomizeSeed = () => {
    const newSeed = Math.floor(10000 + Math.random() * 89999)
    setSeed(newSeed)
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
    name: 'How Text-to-Image Diffusion Models Generate Images Step-by-Step',
    step: [
      {
        '@type': 'HowToStep',
        text: 'Text Tokenization & Conditioning: The text encoder (CLIP / T5) turns your written prompt into numerical embedding vectors.',
      },
      {
        '@type': 'HowToStep',
        text: 'Latent Noise Initialization: A random Gaussian noise tensor is generated in compact latent space (e.g. 64x64x4 for a 512x512 image).',
      },
      {
        '@type': 'HowToStep',
        text: 'Progressive Denoising (Reverse Diffusion): Over 20 to 50 iterations, the U-Net or DiT predicts and subtracts noise, guided by Classifier-Free Guidance (CFG).',
      },
      {
        '@type': 'HowToStep',
        text: 'Negative Prompt Subtraction: The scheduler steers the latent vector away from unwanted visual concepts listed in the negative prompt.',
      },
      {
        '@type': 'HowToStep',
        text: 'VAE Latent Decoding: The Variational Autoencoder decoder uncompresses the clean latent matrix into full-resolution RGB pixel space.',
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
        <meta property="og:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson8-hero.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${TITLE} | UpTools`} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson8-hero.jpg" />
        <meta
          name="keywords"
          content="AI image generation explained, diffusion models tutorial, Stable Diffusion architecture, latent diffusion, CFG scale guidance, CLIP text encoder, reverse diffusion denoising, VAE decoder, Python diffusers code"
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
              { '@type': 'ListItem', position: 4, name: 'Image Generation Basics', item: URL },
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
        <span className="text-slate-300 font-medium">Image Generation Basics</span>
      </nav>

      {/* BADGE & HEADER */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/30 text-purple-300 mb-4">
        <span>🎨</span> AI · Lesson 8 · Beginner
      </div>
      <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight m-0 mb-3">
        Image Generation Basics: How Diffusion Models Turn Text into Art &amp; Photos
      </h1>
      <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
        Text-to-image AI doesn&rsquo;t copy and paste existing photos from the internet. Instead, <strong>Diffusion Models</strong> start with a canvas of random Gaussian noise (like static on an old TV) and iteratively predict and subtract noise step-by-step, guided by text embeddings from <strong>CLIP</strong> or <strong>T5</strong>. Play with the live denoising simulator below to see how prompt strength (CFG scale) and step counts sculpt high-resolution artwork out of pure static.
 </p>
 <figure className="m-0 mb-6 rounded-xl border border-white/10 overflow-hidden">
 <img src="/assets/learning/ai/ai-lesson8-hero.jpg" alt="Robot painting a picture from words in a text prompt" loading="lazy" />
 </figure>

 {/* LIVE INTERACTIVE ANIMATOR */}
      <section
        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6"
        aria-label="Live Diffusion Prompt-to-Image Denoising Simulator"
      >
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-white m-0">▶ Live Demo: Diffusion Prompt-to-Image Progressive Denoising Simulator</h2>
            <p className="text-xs text-slate-400 m-0 mt-0.5">
              Tweak the CFG prompt strength, scrub through sampling steps, and watch latent noise transform into clean art.
            </p>
          </div>
          <div className="flex rounded-xl bg-black/40 border border-white/10 p-1">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'simulator' ? 'bg-purple-500/30 text-purple-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              🎨 Live Denoising Flow
            </button>
            <button
              onClick={() => setActiveTab('components')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'components' ? 'bg-purple-500/30 text-purple-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              🔬 The 3 Core Components
            </button>
            <button
              onClick={() => setActiveTab('hyperparams')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'hyperparams' ? 'bg-purple-500/30 text-purple-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              ⚙️ CFG, Steps &amp; Schedulers
            </button>
          </div>
        </div>

        {/* TAB 1: INTERACTIVE SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-4">
            {/* PROMPT SELECTOR & CONTROLS */}
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Sample Prompt Preset:
                  </span>
                  <div className="flex gap-1.5 flex-wrap">
                    {PROMPT_PRESETS.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedPresetId(p.id)
                          setCurrentStep(0)
                          setIsPlaying(false)
                        }}
                        className={`text-xs font-medium px-2.5 py-1 rounded-lg border cursor-pointer transition-all ${
                          selectedPresetId === p.id
                            ? 'bg-purple-500/20 border-purple-500/50 text-purple-200'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PROMPT TEXT DISPLAY */}
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-xs text-slate-200">
                  <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1 flex items-center justify-between">
                    <span>🟢 Positive Prompt (CLIP Conditioned):</span>
                    <span className="text-slate-400 font-normal">Seed: {seed}</span>
                  </div>
                  &ldquo;{activePreset.prompt}&rdquo;
                </div>

                {/* NEGATIVE PROMPT TOGGLE */}
                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-black/20 border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 font-bold text-[10px] uppercase">🔴 Negative Prompt:</span>
                    <span className="text-slate-400 truncate max-w-xs sm:max-w-md">
                      {negativePromptEnabled ? activePreset.negativePrompt : '(Disabled — potential visual artifacts)'}
                    </span>
                  </div>
                  <button
                    onClick={() => setNegativePromptEnabled(!negativePromptEnabled)}
                    className={`text-[11px] font-bold px-2 py-0.5 rounded border cursor-pointer ${
                      negativePromptEnabled
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : 'bg-white/5 text-slate-400 border-white/10'
                    }`}
                  >
                    {negativePromptEnabled ? 'Active' : 'Off'}
                  </button>
                </div>
              </div>
            </div>

            {/* SLIDERS & TELEMETRY */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* SLIDER 1: CFG SCALE (PROMPT STRENGTH) */}
              <div className="rounded-xl border border-white/10 bg-black/30 p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>🎯 CFG Scale (Prompt Strength):</span>
                  </label>
                  <span className="text-xs font-mono font-extrabold text-purple-300 px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30">
                    {cfgScale.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="15.0"
                  step="0.5"
                  value={cfgScale}
                  onChange={e => setCfgScale(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>1.0 (Creative/Abstract)</span>
                  <span className="text-purple-400 font-bold">7.5 (Balanced)</span>
                  <span>15.0 (High Contrast)</span>
                </div>
              </div>

              {/* SLIDER 2: SAMPLING STEPS */}
              <div className="rounded-xl border border-white/10 bg-black/30 p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>⏳ Denoising Steps (Inference):</span>
                  </label>
                  <span className="text-xs font-mono font-extrabold text-blue-300 px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/30">
                    {currentStep} / {maxSteps}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxSteps}
                  value={currentStep}
                  onChange={e => {
                    setCurrentStep(parseInt(e.target.value, 10))
                    setIsPlaying(false)
                  }}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Step 0 (100% Noise)</span>
                  <span className="text-blue-400 font-bold">{progressPercent}% Denoised</span>
                  <span>Step {maxSteps} (Clear)</span>
                </div>
              </div>

              {/* LATENT RESOLUTION & SEED */}
              <div className="rounded-xl border border-white/10 bg-black/30 p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">🗜️ Latent Space Compression:</span>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    8x VAE (48x size reduction)
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-2">
                  <span className="text-[11px] text-slate-400">
                    Latent: <strong className="text-slate-200">64x64x4</strong> → RGB: <strong className="text-slate-200">{resolution}</strong>
                  </span>
                  <button
                    onClick={handleRandomizeSeed}
                    className="text-[10px] font-bold px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 cursor-pointer transition-all"
                  >
                    🎲 Roll Seed
                  </button>
                </div>
              </div>
            </div>

            {/* MAIN SIMULATION DISPLAY */}
            <div className="grid lg:grid-cols-12 gap-4 items-stretch">
              {/* LEFT: CANVAS PROGRESSIVE VISUALIZER */}
              <div className="lg:col-span-6 rounded-xl border border-white/10 bg-black/50 p-4 flex flex-col items-center justify-center">
                <div className="relative w-full aspect-square max-w-[340px] rounded-lg overflow-hidden border border-white/15 shadow-2xl bg-black">
                  <canvas
                    ref={canvasRef}
                    width={340}
                    height={340}
                    className="w-full h-full block"
                  />
                  {/* OVERLAY BADGE */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-white/15 text-[10px] font-mono text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: progressPercent === 100 ? '#10b981' : '#a855f7' }} />
                    {progressPercent === 100 ? 'VAE Decoded RGB Output' : `Reverse Diffusion Step ${currentStep}/${maxSteps}`}
                  </div>

                  {/* NOISE LEVEL BADGE */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-white/15 text-[10px] font-mono text-slate-300">
                    Noise σ(t): {noiseRemaining}%
                  </div>
                </div>

                {/* PLAYBACK CONTROLS */}
                <div className="flex items-center justify-center gap-2 mt-4 flex-wrap w-full">
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 cursor-pointer transition-all"
                  >
                    ⏮ Reset
                  </button>
                  <button
                    onClick={handleStepBack}
                    disabled={currentStep === 0}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    ◀ -1 Step
                  </button>
                  <button
                    onClick={() => {
                      if (isPlaying) {
                        setIsPlaying(false)
                      } else if (currentStep >= maxSteps) {
                        handleRunFull()
                      } else {
                        setIsPlaying(true)
                      }
                    }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer border-0 shadow-lg transition-all ${
                      isPlaying
                        ? 'bg-amber-500 text-black hover:bg-amber-400'
                        : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90'
                    }`}
                  >
                    {isPlaying ? '⏸ Pause' : currentStep >= maxSteps ? '🔄 Re-Generate' : '▶ Generate (Play)'}
                  </button>
                  <button
                    onClick={handleStepForward}
                    disabled={currentStep >= maxSteps}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    +1 Step ▶
                  </button>
                </div>
              </div>

              {/* RIGHT: REAL-TIME DIFFUSION TELEMETRY & STAGES */}
              <div className="lg:col-span-6 rounded-xl border border-white/10 bg-black/30 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                    📊 Diffusion Pipeline Telemetry &amp; Latent State
                  </h3>

                  {/* PROGRESS METRICS */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Gaussian Noise Level (z_t):</span>
                        <span className="font-mono text-purple-300 font-bold">{noiseRemaining}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-150"
                          style={{ width: `${noiseRemaining}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Prompt Alignment (Cross-Attention):</span>
                        <span className="font-mono text-emerald-300 font-bold">
                          {Math.min(100, Math.round(progressPercent * (cfgScale / 7.5)))}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-150"
                          style={{ width: `${Math.min(100, Math.round(progressPercent * (cfgScale / 7.5)))}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">High-Frequency Edge Details:</span>
                        <span className="font-mono text-blue-300 font-bold">{progressPercent}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-150"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* STAGE BREAKDOWN CARD */}
                  <div className="rounded-lg bg-black/40 border border-white/5 p-3">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Active Denoising Phase:
                    </div>
                    {(() => {
                      let activeStage = activePreset.stages[0]
                      if (progressPercent >= 100) activeStage = activePreset.stages[4]
                      else if (progressPercent >= 70) activeStage = activePreset.stages[3]
                      else if (progressPercent >= 40) activeStage = activePreset.stages[2]
                      else if (progressPercent >= 15) activeStage = activePreset.stages[1]

                      return (
                        <div>
                          <div className="text-xs font-extrabold text-white flex items-center gap-2 mb-1">
                            <span className="text-purple-400">●</span> {activeStage.label}
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed m-0">
                            {activeStage.desc}
                          </p>
                        </div>
                      )
                    })()}
                  </div>
                </div>

                {/* FOOTER NOTE */}
                <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Sampler: DPM++ 2M Karras</span>
                  <span>Latent Shape: (1, 4, 64, 64)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 3 CORE COMPONENTS */}
        {activeTab === 'components' && (
          <div className="rounded-xl border border-white/10 bg-black/30 p-5 mb-4">
            <h3 className="text-sm font-bold text-white mb-2">🔬 The 3 Core Pillars of Latent Diffusion Models</h3>
            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              Modern image generators (Stable Diffusion, Midjourney, DALL-E 3, Flux) combine three distinct machine learning sub-systems working in harmony:
            </p>

            <div className="grid sm:grid-cols-3 gap-3">
              {[
                {
                  step: '01',
                  title: 'Text Encoder (CLIP / T5)',
                  icon: '🔤',
                  color: 'border-blue-500/30 bg-blue-500/[0.04]',
                  text: 'Translates natural language prompts and keywords into high-dimensional semantic token vectors. Cross-attention layers inject these meanings into the visual tensor at every step.',
                },
                {
                  step: '02',
                  title: 'Latent U-Net / DiT (Denoising Engine)',
                  icon: '🧠',
                  color: 'border-purple-500/30 bg-purple-500/[0.04]',
                  text: 'The core neural network trained to predict and subtract noise. Over multiple sampling iterations, it reshapes the random latent matrix into coherent object shapes and lighting.',
                },
                {
                  step: '03',
                  title: 'VAE Decoder (Pixel Synthesizer)',
                  icon: '🖼️',
                  color: 'border-emerald-500/30 bg-emerald-500/[0.04]',
                  text: 'Takes the completed 64x64 latent representation and upscales it 8x into the final high-resolution 512x512 or 1024x1024 RGB pixel image you see and download.',
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

        {/* TAB 3: HYPERPARAMETERS & SAMPLERS */}
        {activeTab === 'hyperparams' && (
          <div className="rounded-xl border border-white/10 bg-black/30 p-5 mb-4">
            <h3 className="text-sm font-bold text-white mb-2">⚙️ Diffusion Hyperparameters &amp; Controls Cheatsheet</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Every production AI image pipeline exposes key levers that directly control generation speed, creativity, fidelity, and style:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-white/15 bg-white/5">
                    <th className="p-3 text-white font-bold">Parameter</th>
                    <th className="p-3 text-purple-300 font-bold">Recommended Value</th>
                    <th className="p-3 text-emerald-300 font-bold">What It Controls &amp; Trade-offs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-3 font-semibold text-white">CFG Guidance Scale</td>
                    <td className="p-3 text-purple-300 font-mono">6.5 – 8.0</td>
                    <td className="p-3 text-slate-300">Prompt fidelity. Low values allow more model freedom; &gt;14 causes fried colors and severe contrast banding.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Inference Steps</td>
                    <td className="p-3 text-purple-300 font-mono">25 – 35 steps</td>
                    <td className="p-3 text-slate-300">Number of denoising iterations. 25-30 is the sweet spot; &gt;50 wastes compute with virtually zero visible gain.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Sampler / Scheduler</td>
                    <td className="p-3 text-purple-300 font-mono">DPM++ 2M Karras or Euler a</td>
                    <td className="p-3 text-slate-300">The numerical ODE algorithm used to estimate noise trajectory. Modern solvers converge 10x faster than legacy DDPM.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Seed</td>
                    <td className="p-3 text-purple-300 font-mono">Any Integer (e.g. 42819)</td>
                    <td className="p-3 text-slate-300">The initial random noise generator seed. Locking the seed enables reproducible testing while tweaking prompts.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">LoRA Weight</td>
                    <td className="p-3 text-purple-300 font-mono">0.6 – 0.85</td>
                    <td className="p-3 text-slate-300">Blending factor for fine-tuned character or art-style adapters without overpowering the base foundation model.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-[11px] text-slate-500 m-0">
          💡 <strong>Key Takeaway:</strong> Image diffusion is the mathematical process of turning structured noise into pixels through guided iteration. Rather than generating an entire image in one step, it makes dozens of micro-corrections based on your prompt.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <figure className="m-0 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson8-steps.jpg" alt="Denoising stages from noise to clear image" loading="lazy" />
        </figure>
        <figure className="m-0 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson8-prompt.jpg" alt="Finished painting held by a robot" loading="lazy" />
        </figure>
      </div>
      {/* EXPLANATION */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-3">How Diffusion AI Generates New Images Out of Thin Air</h2>
        <ol className="text-sm text-slate-300 leading-relaxed space-y-2.5 list-decimal pl-5 m-0">
          <li>
            <strong className="text-white">Forward Diffusion (Training):</strong> The model takes millions of images and adds tiny amounts of random Gaussian noise across 1,000 steps until they turn into static. It learns the mathematical distribution of noise at each stage.
          </li>
          <li>
            <strong className="text-white">Reverse Diffusion (Inference):</strong> When you type a prompt, the model starts from pure static and runs backwards. At each step, it asks: &ldquo;Given this noisy canvas and the user&rsquo;s prompt, what noise should I remove next?&rdquo;
          </li>
          <li>
            <strong className="text-white">Cross-Attention Guidance:</strong> The text prompt is encoded by CLIP or T5 into dense vectors. Attention heads steer the noise subtraction so that words like &ldquo;cat&rdquo; or &ldquo;neon&rdquo; manifest in corresponding spatial coordinates.
          </li>
          <li>
            <strong className="text-white">Latent Space Compression:</strong> By computing the 30–50 denoising steps in an 8x compressed latent space (via a Variational Autoencoder), the model runs fast enough to generate high-resolution art on consumer GPUs in seconds.
          </li>
        </ol>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 text-center">
          {[
            ['Forward Diffusion', 'Noise addition training', 'Markov chain noise decay'],
            ['Reverse Diffusion', 'Iterative denoising', 'U-Net noise prediction'],
            ['Cross-Attention', 'Text-to-pixel binding', 'CLIP / T5 embeddings'],
            ['Latent VAE', '8x compression ratio', '48x faster compute'],
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
        <h2 className="text-lg font-bold text-white mt-0 mb-3">Code: Complete Stable Diffusion Pipeline in Python &amp; JavaScript</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">
          Generate images programmatically with exact prompt parameters, fast schedulers (DPM++ 2M Karras), and custom seeds:
        </p>
        <div className="space-y-3">
          <CodeBlock lang="Python (diffusers)" code={PY_CODE} />
          <CodeBlock lang="JavaScript (Replicate API)" code={JS_CODE} />
        </div>
      </section>

      {/* PRACTICE QUESTIONS */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-1">Practice questions</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">
          Common machine learning and AI developer interview questions on generative vision models. Tap to reveal the answer.
        </p>
        <div className="space-y-2.5">
          {QUESTIONS.map((it, i) => (
            <details key={i} className="rounded-xl bg-black/30 border border-white/10 px-4 py-1 group">
              <summary className="cursor-pointer text-sm font-semibold text-white py-2.5 list-none flex items-center gap-2">
                <span className="text-purple-400 text-xs font-bold shrink-0">Q{i + 1}</span>
                {it.q}
              </summary>
              <p className="text-xs text-slate-300 pb-3 pl-8 leading-relaxed m-0">{it.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* INTERVIEW TIPS */}
      <section
        className="rounded-2xl border border-purple-500/20 p-5 sm:p-6 mb-6"
        style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(17,24,39,0.4))' }}
      >
        <h2 className="text-lg font-bold text-white mt-0 mb-3">🎤 Interview tips</h2>
        <ul className="text-sm text-slate-300 leading-relaxed space-y-2 list-disc pl-5 m-0">
          <li>
            <strong className="text-white">Explain Latent Diffusion clearly:</strong> &ldquo;Operating in raw pixel space is O(H × W × C). Latent diffusion trains a VAE first to compress images into a low-dimensional latent space, reducing compute by ~48x while preserving perceptual quality.&rdquo;
          </li>
          <li>
            <strong className="text-white">Master the Classifier-Free Guidance (CFG) formula:</strong> &ldquo;ε_guided = ε_unconditional + s × (ε_conditional - ε_unconditional). Higher guidance scale s pushes the generation strongly in the direction of the prompt vector.&rdquo;
          </li>
          <li>
            <strong className="text-white">Compare GANs vs Diffusion:</strong> &ldquo;GANs generate in 1 step via adversarial loss but suffer from mode collapse. Diffusion models generate iteratively by reversing noise addition, yielding far better coverage of the true image distribution.&rdquo;
          </li>
          <li>
            <strong className="text-white">Understand Modern Diffusion Transformers (DiT):</strong> &ldquo;Modern models like SD3, Flux, and Sora replace the traditional convolutional U-Net with Vision Transformer (ViT) patch architectures, scaling better with compute and token count.&rdquo;
          </li>
          <li>
            <strong className="text-white">Discuss Fine-Tuning (LoRA vs Full Fine-Tuning):</strong> &ldquo;LoRA injects rank-decomposition matrices into cross-attention projection weights, reducing trainable parameters by 99% while enabling fast style/character adaptation.&rdquo;
          </li>
        </ul>
      </section>

      {/* FAQ ACCORDION COMPONENT */}
      <FAQ questions={FAQS} />

      {/* PREV / NEXT NAVIGATION */}
      <div className="flex items-center justify-between flex-wrap gap-3 mt-6">
        <Link to="/learning/ai/ai-agents-that-do-tasks" className="text-sm font-semibold text-purple-300 no-underline hover:text-white transition-colors">
          ← Lesson 7: AI Agents That Do Tasks
        </Link>
        <Link to="/learning/ai/voice-and-video-ai" className="text-sm font-semibold text-purple-300 no-underline hover:text-white transition-colors">
          Lesson 9: Voice and Video AI →
        </Link>
      </div>
    </>
  )
}

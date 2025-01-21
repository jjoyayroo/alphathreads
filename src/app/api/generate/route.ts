import { NextResponse } from 'next/server';
import Replicate from 'replicate';

type ModelType = 'flux' | 'sdxl' | 'ideogram';

interface ModelConfig {
  version: `${string}/${string}` | `${string}/${string}:${string}`;
  params: {
    [key: string]: any;
  };
}

const MODELS: Record<ModelType, ModelConfig> = {
  flux: {
    version: "black-forest-labs/flux-1.1-pro",
    params: {
      aspect_ratio: "1:1",
      output_format: "webp",
      output_quality: 80,
      safety_tolerance: 2,
      prompt_upsampling: true,
    }
  },
  sdxl: {
    version: "stability-ai/sdxl:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
    params: {
      width: 768,
      height: 768,
      num_inference_steps: 50,
      guidance_scale: 7.5,
    }
  },
  ideogram: {
    version: "ideogram-ai/ideogram-v2",
    params: {
      resolution: "None",
      style_type: "None",
      aspect_ratio: "1:1",
      magic_prompt_option: "Auto",
    }
  }
};

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
});

export async function POST(req: Request) {
  try {
    const { prompt, model } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const modelConfig = MODELS[model as ModelType];
    if (!modelConfig) {
      return NextResponse.json(
        { error: 'Invalid model selected' },
        { status: 400 }
      );
    }

    const output = await replicate.run(
      modelConfig.version,
      {
        input: {
          prompt,
          ...modelConfig.params
        }
      }
    );

    return NextResponse.json({ output });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
} 
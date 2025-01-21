import { NextResponse } from 'next/server';
import Replicate from "replicate";

const MODELS = {
  flux: {
    version: "black-forest-labs/flux-1.1-pro",
    params: {
      aspect_ratio: "1:1",
      output_format: "webp",
      output_quality: 80,
      safety_tolerance: 2,
      prompt_upsampling: true
    }
  },
  sdxl: {
    version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
    params: {
      width: 768,
      height: 768,
      num_inference_steps: 50,
      guidance_scale: 7.5
    }
  },
  ideogram: {
    version: "ideogram-ai/ideogram-v2",
    params: {
      aspect_ratio: "1:1",
      resolution: "None",
      style_type: "None",
      magic_prompt_option: "Auto"
    }
  }
};

export async function POST(request: Request) {
  try {
    const { prompt, model = 'flux' } = await request.json();

    if (!process.env.REPLICATE_API_KEY) {
      throw new Error('REPLICATE_API_KEY is not configured');
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_KEY,
    });

    const modelConfig = MODELS[model];
    
    const output = await replicate.run(
      modelConfig.version,
      {
        input: {
          prompt,
          ...modelConfig.params
        }
      }
    );

    console.log('Generation result:', output);
    
    return NextResponse.json({ output });
  } catch (error) {
    console.error('Error in generate route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    );
  }
} 
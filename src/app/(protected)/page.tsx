'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/context/AuthContext';
import { uploadFile, addDocument } from '@/lib/firebase/firebaseUtils';

// Models configuration
const MODELS = {
  flux: {
    id: "flux",
    name: "Flux 1.1 Pro",
    version: "black-forest-labs/flux-1.1-pro",
    parameters: {
      width: 1024,
      height: 1024,
      num_outputs: 1,
      aspect_ratio: "1:1",
      output_format: "webp",
      output_quality: 80,
      safety_tolerance: 2,
      prompt_upsampling: true
    }
  },
  sdxl: {
    id: "sdxl",
    name: "Stable Diffusion XL",
    version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
    parameters: {
      width: 768,
      height: 768,
      num_outputs: 1,
      num_inference_steps: 50,
      guidance_scale: 7.5
    }
  },
  ideogram: {
    id: "ideogram",
    name: "Ideogram v2",
    version: "ideogram-ai/ideogram-v2",
    parameters: {
      resolution: "None",
      style_type: "None",
      aspect_ratio: "1:1",
      magic_prompt_option: "Auto"
    }
  }
};

export default function ImageGeneration() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModelInfo, setShowModelInfo] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'flux' | 'sdxl' | 'ideogram'>('flux');
  const { user } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt,
          model: selectedModel 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (!data.output) {
        throw new Error('No image was generated');
      }

      setImage(data.output);

      // Save the image to Firebase Storage
      if (user) {
        const timestamp = Date.now();
        const filename = `${user.uid}/${timestamp}.webp`;
        
        // Convert base64 to blob
        const response = await fetch(data.output);
        const blob = await response.blob();
        const file = new File([blob], filename, { type: 'image/webp' });
        
        // Upload to Firebase Storage
        const imageUrl = await uploadFile(file, filename);
        
        // Save metadata to Firestore
        await addDocument('images', {
          userId: user.uid,
          prompt,
          model: selectedModel,
          imageUrl,
          createdAt: timestamp,
        });
      }
    } catch (err) {
      console.error('Error generating image:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const currentModel = MODELS[selectedModel];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Create Stunning AI-Generated Images
        </h2>
        <p className="text-lg text-gray-600">
          Transform your ideas into beautiful, print-ready artwork with our advanced AI models
        </p>
      </div>

      {/* Model Selector */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Choose Your AI Model
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(MODELS).map(([id, model]) => (
            <button
              key={id}
              onClick={() => setSelectedModel(id as 'flux' | 'sdxl' | 'ideogram')}
              className={`group relative flex flex-col p-6 rounded-xl border-2 transition-all ${
                selectedModel === id
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-white'
              }`}
            >
              <div className="absolute top-3 right-3">
                {selectedModel === id && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </div>
              <div className="text-xl font-semibold text-gray-900 mb-3">{model.name}</div>
              <div className="text-sm text-gray-600 flex-grow">
                Advanced AI model with excellent image quality and prompt adherence.
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Image Generation Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe Your Image
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Be creative! Describe the image you want to generate in detail..."
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={4}
          />
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pro tip: Include details about style, colors, and composition for better results
          </div>
          <button
            type="submit"
            disabled={loading || !prompt}
            className="mt-4 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </span>
            ) : (
              'Generate Image'
            )}
          </button>
        </form>
      </div>

      {/* Generated Image Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {image && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              src={image}
              alt={prompt}
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Generated with {currentModel.name}
          </div>
        </div>
      )}
    </div>
  );
} 
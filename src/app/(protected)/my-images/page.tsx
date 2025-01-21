'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/context/AuthContext';
import { getDocuments } from '@/lib/firebase/firebaseUtils';

interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  model: string;
  createdAt: number;
  userId: string;
}

export default function MyImages() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadImages() {
      if (!user) return;

      try {
        const docs = await getDocuments('images') as GeneratedImage[];
        const userImages = docs
          .filter((doc) => doc.userId === user.uid)
          .sort((a, b) => b.createdAt - a.createdAt);

        setImages(userImages);
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        setLoading(false);
      }
    }

    loadImages();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">No Images Yet</h2>
        <p className="text-lg text-gray-600 mb-8">
          Start generating images to build your collection!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">My Generated Images</h2>
        <p className="text-lg text-gray-600">
          Your collection of AI-generated masterpieces
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((image) => (
          <div
            key={image.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="aspect-square relative">
              <Image
                src={image.imageUrl}
                alt={image.prompt}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-2">
                {new Date(image.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {image.prompt}
              </p>
              <p className="text-xs text-gray-500">
                Generated with {image.model}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
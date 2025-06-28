'use client'

import { useSearchParams } from 'next/navigation'
import { SecureVideoPlayer } from './SecureVideoPlayer'
import React from 'react'

export default function Player({ params }: { params: { title: string } }) {
  const searchParams = useSearchParams()
  const videoId = searchParams.get('id')
  const decodedTitle = decodeURIComponent(params.title)

  if (!videoId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Vidéo non trouvée</h2>
          <p className="mt-2">Aucun identifiant de vidéo fourni</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-sky-100 rounded-lg shadow-lg overflow-hidden">
        <div className="w-full aspect-video bg-black">
          <SecureVideoPlayer 
            videoId={videoId}
            title={decodedTitle}
          />
        </div>
        
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900">{decodedTitle}</h1>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900">À propos de cette vidéo</h2>
            <p className="mt-2 text-gray-700">
              Vous regardez actuellement : {decodedTitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
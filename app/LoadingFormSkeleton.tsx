'use client'

import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const getRandomWidth = () => `${Math.floor(Math.random() * (90 - 60) + 60)}%`
const getRandomHeight = () => `${Math.floor(Math.random() * (14 - 10) + 10)}px`

export const LoadingFormSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 p-6 max-w-xl mx-auto">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton
            className="h-4 w-24 rounded"
            style={{ width: getRandomWidth() }}
          />
          <Skeleton
            className="rounded"
            style={{
              width: '100%',
              height: getRandomHeight(),
            }}
          />
        </div>
      ))}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  )
}

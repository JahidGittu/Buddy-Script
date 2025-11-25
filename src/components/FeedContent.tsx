// src/components/FeedContent.tsx
'use client'

import { useState } from "react"
import CreatePost from "./post/CreatePost"
import PostsList from "./post/PostsList"
import StoriesSection from "./StoriesSection"

export default function FeedContent() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handlePostCreated = () => {
    // Increment to trigger refresh in PostsList
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="xl:col-span-3 lg:col-span-3 md:col-span-12 sm:col-span-12">
      <div className="flex flex-col h-[calc(100vh-75px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-1 pt-[18px]">
        <div className="space-y-6 pb-6">
          <StoriesSection />
          <CreatePost onPostCreated={handlePostCreated} />
          <PostsList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  )
}
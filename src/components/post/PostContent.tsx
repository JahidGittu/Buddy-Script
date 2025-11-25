// src/components/post/PostContent.tsx
import { PostType } from '@/types/post'

interface PostContentProps {
  post: PostType
}

export default function PostContent({ post }: PostContentProps) {
  return (
   <div className="p-6 pb-0">
      {/* Post Content */}
      <h4 className="text-gray-900 mb-4">{post.content}</h4>
      
      {/* Post Image */}
      <div className="mb-6">
        <img src={post.image} alt="Post" className="w-full rounded-lg"/>
      </div>
    </div>
  )
}
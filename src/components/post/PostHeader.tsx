// src/components/post/PostHeader.tsx
import DropdownMenu from '../ui/DropdownMenu'
import { PostType } from '@/types/post'

interface PostHeaderProps {
  post: PostType
  showDropdown: boolean
  setShowDropdown: (show: boolean) => void
}

export default function PostHeader({ post, showDropdown, setShowDropdown }: PostHeaderProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const displayTime = post.user.time || formatTime(post.createdAt);
  const displayPrivacy = post.user.privacy || post.privacy;

  return (
    <div className="p-6 pb-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="cursor-pointer">
            <img 
              src={post.user.avatar} 
              alt={post.user.name} 
              className="w-11 h-11 rounded-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 hover:underline cursor-pointer text-base">
              {post.user.name}
            </h4>
            <p className="text-sm text-gray-500">
              {displayTime} •{' '}
              <span className="text-gray-500 cursor-pointer hover:underline">
                {displayPrivacy}
              </span>
            </p>
          </div>
        </div>
        
        {/* Dropdown */}
        <DropdownMenu 
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
        />
      </div>
    </div>
  )
}
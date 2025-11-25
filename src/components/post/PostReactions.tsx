// src/components/post/PostReactions.tsx
import ReactionButtons from "../ui/ReactionButtons"
import { UserReactionType } from '@/types/post'

interface PostReactionsProps {
  postId: string
  totalReactions: number
  reactionAvatars: UserReactionType[]
  commentsCount: number
  sharesCount: number
  activeReaction: string
  setActiveReaction: (reaction: string) => void
  currentUserReaction: string // Add this prop
}

export default function PostReactions({ 
  postId,
  totalReactions,
  reactionAvatars,
  commentsCount,
  sharesCount,
  activeReaction, 
  setActiveReaction,
  currentUserReaction // Add this prop
}: PostReactionsProps) {
  // Function to generate avatar from name initials
  const generateAvatarFromName = (name: string) => {
    const initials = name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    const colors = ['bg-primary', 'bg-success', 'bg-chart-4', 'bg-chart-5', 'bg-warning'];
    const colorIndex = name.length % colors.length;
    
    return (
      <div className={`w-8 h-8 ${colors[colorIndex]} rounded-full flex items-center justify-center text-primary-foreground text-xs font-semibold`}>
        {initials}
      </div>
    );
  }

  return (
    <>
      {/* Reactions Stats - Facebook style with user avatars */}
      <div className="px-6 py-4 border-b border-border-light dark:border-border-light">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {totalReactions > 0 && (
              <div className="flex items-center space-x-1">
                <div className="flex -space-x-1">
                  {reactionAvatars.map((user, index) => (
                    <div 
                      key={user.userId}
                      className="w-8 h-8 border-2 border-background-secondary dark:border-background-secondary rounded-full overflow-hidden shadow-sm"
                      style={{ 
                        zIndex: 3 - index 
                      }}
                    >
                      {user.avatar && user.avatar !== '/default-avatar.png' ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // If image fails to load, show initials
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-semibold">
                                  ${user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                                </div>
                              `;
                            }
                          }}
                        />
                      ) : (
                        generateAvatarFromName(user.name)
                      )}
                    </div>
                  ))}
                  {totalReactions > 3 && (
                    <div className="w-8 h-8 bg-foreground-muted border-2 border-background-secondary dark:border-background-secondary rounded-full flex items-center justify-center text-xs text-background font-medium shadow-sm -ml-2">
                      +{totalReactions - 3}
                    </div>
                  )}
                </div>
                <span className="text-sm text-foreground-muted dark:text-foreground-muted ml-2">{totalReactions}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-6 text-sm text-foreground-muted dark:text-foreground-muted">
            <a href="#comments" className="hover:text-primary dark:hover:text-primary cursor-pointer transition-colors">
              <span className="font-semibold text-foreground dark:text-foreground">{commentsCount}</span> Comments
            </a>
            <span className="cursor-pointer hover:text-foreground dark:hover:text-foreground transition-colors">
              <span className="font-semibold text-foreground dark:text-foreground">{sharesCount}</span> Shares
            </span>
          </div>
        </div>
      </div>

      {/* Reaction Buttons with Facebook-style interaction */}
      <ReactionButtons
        activeReaction={activeReaction}
        setActiveReaction={setActiveReaction}
        postId={postId}
        currentUserReaction={currentUserReaction} // Pass this prop
      />
    </>
  )
}
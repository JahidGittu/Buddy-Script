// src/app/components/StoriesSection.tsx
'use client'

export default function StoriesSection() {
  const desktopStories = [
    {
      type: 'user',
      image: '/assets/images/card_ppl1.png',
      name: 'Your Story',
      hasAdd: true
    },
    {
      type: 'friend',
      image: '/assets/images/card_ppl2.png',
      name: 'Ryan Roslansky',
      hasMini: true,
      miniImage: '/assets/images/mini_pic.png'
    },
    {
      type: 'friend',
      image: '/assets/images/card_ppl3.png',
      name: 'Ryan Roslansky',
      hasMini: true,
      miniImage: '/assets/images/mini_pic.png'
    },
    {
      type: 'friend',
      image: '/assets/images/card_ppl4.png',
      name: 'Ryan Roslansky',
      hasMini: true,
      miniImage: '/assets/images/mini_pic.png'
    }
  ]

  const mobileStories = [
    {
      type: 'user',
      image: '/assets/images/mobile_story_img.png',
      name: 'Your Story',
      hasAdd: true
    },
    {
      type: 'friend',
      image: '/assets/images/mobile_story_img1.png',
      name: 'Ryan...',
      active: true
    },
    {
      type: 'friend',
      image: '/assets/images/mobile_story_img2.png',
      name: 'Ryan...',
      active: false
    },
    {
      type: 'friend',
      image: '/assets/images/mobile_story_img1.png',
      name: 'Ryan...',
      active: true
    },
    {
      type: 'friend',
      image: '/assets/images/mobile_story_img2.png',
      name: 'Ryan...',
      active: false
    },
    {
      type: 'friend',
      image: '/assets/images/mobile_story_img1.png',
      name: 'Ryan...',
      active: true
    },
    {
      type: 'friend',
      image: '/assets/images/mobile_story_img.png',
      name: 'Ryan...',
      active: false
    },
    {
      type: 'friend',
      image: '/assets/images/mobile_story_img1.png',
      name: 'Ryan...',
      active: true
    }
  ]

  return (
    <>
      {/* Desktop Stories */}
      <div className="bg-white rounded-lg p-6 mb-4 hidden lg:block">
        <div className="relative">
          <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
            <button 
              type="button" 
              className="bg-blue-600 border border-blue-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" fill="none" viewBox="0 0 9 8">
                <path fill="#fff" d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z"/>
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {desktopStories.map((story, index) => (
              <div key={index} className="cursor-pointer">
                <div className={`rounded-lg overflow-hidden relative ${story.type === 'user' ? '_feed_inner_profile_story' : '_feed_inner_public_story'}`}>
                  <div className="relative">
                    {/* Friend Story - Profile Image at Top */}
                    {story.type === 'friend' && story.hasMini && (
                      <div className="absolute top-3 right-3 z-20">
                        <img 
                          src={story.miniImage} 
                          alt="Profile" 
                          className="w-8 h-8 rounded-full border-2 border-white"
                        />
                      </div>
                    )}
                    
                    <img 
                      src={story.image} 
                      alt={story.name}
                      className={`w-full h-40 object-cover ${story.type === 'user' ? '_profile_story_img' : '_public_story_img'}`}
                    />
                    <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
                    
                    {story.type === 'user' ? (
                      // User Story Layout
                      <div className="absolute bottom-0 left-0 right-0 bg-[#112032] rounded-b-lg pt-7 pb-3 z-10">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <button className="bg-blue-600 border-2 border-[#112032] rounded-full w-8 h-8 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                              <path stroke="#fff" strokeLinecap="round" d="M.5 4.884h9M4.884 9.5v-9"/>
                            </svg>
                          </button>
                        </div>
                        <p className="text-white text-xs text-center font-medium">Your Story</p>
                      </div>
                    ) : (
                      // Friend Story Layout - Name at Bottom
                      <div className="absolute bottom-0 left-0 right-0 z-10 p-3">
                        <p className="text-white text-xs text-center font-medium">{story.name}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Stories */}
      <div className="bg-white rounded-lg p-4 mb-4 lg:hidden">
        <div className="flex space-x-4 overflow-x-auto no-scrollbar">
          {mobileStories.map((story, index) => (
            <div key={index} className="flex flex-col items-center flex-shrink-0">
              <a href="#0" className="flex flex-col items-center">
                <div className={`relative ${story.active ? 'ring-2 ring-blue-600' : 'ring-2 ring-gray-300'} rounded-full p-0.5`}>
                  <div className="relative w-15 h-15">
                    <img 
                      src={story.image} 
                      alt={story.name}
                      className="w-15 h-15 rounded-full object-cover"
                    />
                    {story.type === 'user' && (
                      <div className="absolute inset-0 bg-black opacity-50 rounded-full"></div>
                    )}
                  </div>
                  
                  {story.type === 'user' && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <button className="bg-blue-600 border border-white rounded-full w-6 h-6 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
                          <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M6 2.5v7M2.5 6h7"/>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                <p className={`text-xs font-medium mt-3 ${story.type === 'user' ? 'text-blue-600' : 'text-gray-700'}`}>
                  {story.name}
                </p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
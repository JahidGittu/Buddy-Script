// components/Sidebar/RightSidebar.tsx
export default function RightSidebar() {
  const suggestedConnections = [
    { 
      name: 'Radovan SkillArena', 
      role: 'Founder & CEO at Trophy', 
      avatar: '/assets/images/Avatar.png',
      href: '/profile'
    }
  ]

  const friends = [
    { 
      name: 'Steve Jobs', 
      role: 'CEO of Apple', 
      avatar: '/assets/images/people1.png', 
      online: false, 
      lastSeen: '5 minute ago',
      href: '/profile'
    },
    { 
      name: 'Ryan Roslansky', 
      role: 'CEO of Linkedin', 
      avatar: '/assets/images/people2.png', 
      online: true,
      href: '/profile'
    },
    { 
      name: 'Dylan Field', 
      role: 'CEO of Figma', 
      avatar: '/assets/images/people3.png', 
      online: true,
      href: '/profile'
    },
    { 
      name: 'Steve Jobs', 
      role: 'CEO of Apple', 
      avatar: '/assets/images/people1.png', 
      online: false, 
      lastSeen: '5 minute ago',
      href: '/profile'
    },
    { 
      name: 'Ryan Roslansky', 
      role: 'CEO of Linkedin', 
      avatar: '/assets/images/people2.png', 
      online: true,
      href: '/profile'
    },
    { 
      name: 'Dylan Field', 
      role: 'CEO of Figma', 
      avatar: '/assets/images/people3.png', 
      online: true,
      href: '/profile'
    },
    { 
      name: 'Dylan Field', 
      role: 'CEO of Figma', 
      avatar: '/assets/images/people3.png', 
      online: true,
      href: '/profile'
    },
    { 
      name: 'Steve Jobs', 
      role: 'CEO of Apple', 
      avatar: '/assets/images/people1.png', 
      online: false, 
      lastSeen: '5 minute ago',
      href: '/profile'
    }
  ]

  return (
    <div className="xl:col-span-3 lg:col-span-3 md:col-span-12 sm:col-span-12">
      <div className="flex flex-col h-[calc(100vh-75px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-1 pt-[18px]">
        
        {/* You Might Like Section */}
        <div className="mb-4">
          <div className="bg-white rounded-lg pt-6 pb-6 px-6 mb-4 transition-all duration-200">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900">You Might Like</h4>
              <a className="text-blue-500 text-sm font-medium hover:underline" href="#0">
                See All
              </a>
            </div>
            <hr className="border-gray-200 mb-6" />
            
            {suggestedConnections.map((person, index) => (
              <div key={index} className="space-y-6">
                <div className="flex items-center">
                  <div className="mr-5">
                    <a href={person.href}>
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </a>
                  </div>
                  <div className="flex-1 min-w-0">
                    <a href={person.href}>
                      <h4 className="text-base font-medium text-gray-900">{person.name}</h4>
                    </a>
                    <p className="text-sm text-gray-600">{person.role}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    type="button"
                    className="flex-1 text-sm text-gray-500 bg-white border border-gray-300 rounded-lg py-2 px-4 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Ignore
                  </button>
                  <button
                    type="button"
                    className="flex-1 text-sm text-white bg-blue-600 border border-blue-600 rounded-lg py-2 px-4 hover:bg-blue-700 transition-colors duration-200"
                  >
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Friends Section */}
        <div className="mb-4">
          <div className="bg-white rounded-lg pt-6 pb-1.5 px-6 transition-all duration-200">
            <div className="sticky top-0 bg-white pb-4 z-10">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-gray-900">Your Friends</h4>
                <a
                  className="text-blue-500 text-sm font-medium hover:underline"
                  href="/find-friends"
                >
                  See All
                </a>
              </div>
              
              {/* Search Form */}
              <form className="relative mb-6">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  fill="none"
                  viewBox="0 0 17 17"
                >
                  <circle cx="7" cy="7" r="6" stroke="#666"></circle>
                  <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3"></path>
                </svg>
                <input
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  type="search"
                  placeholder="Search friends..."
                  aria-label="Search"
                />
              </form>
            </div>

            {/* Friends List */}
            <div className="space-y-6">
              {friends.map((friend, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-1.5 rounded-lg transition-colors duration-200 ${
                    !friend.online ? 'opacity-60' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="mr-4">
                      <a href={friend.href}>
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </a>
                    </div>
                    <div className="flex-1 min-w-0">
                      <a href={friend.href}>
                        <h4 className="text-sm font-medium text-gray-900">{friend.name}</h4>
                      </a>
                      <p className="text-xs text-gray-600">{friend.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {friend.online ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <rect
                          width="12"
                          height="12"
                          x="1"
                          y="1"
                          fill="#0ACF83"
                          stroke="#fff"
                          strokeWidth="2"
                          rx="6"
                        />
                      </svg>
                    ) : (
                      <span className="text-xs text-gray-400">{friend.lastSeen}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
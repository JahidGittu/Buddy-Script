import Navbar from '@/components/Navbar/Navbar'
import LeftSidebar from '@/components/SIdebar/Left-Sidebar'
import RightSidebar from '@/components/SIdebar/Right-SIdebar'
import PrivateRoute from './route/PrivateRoute'
import ThemeToggle from '@/components/ui/ThemeToggle'
import FeedContent from '@/components/FeedContent'

export default function Home() {
  return (
    <PrivateRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <ThemeToggle /> {/* Add the theme toggle here */}
        
        <div className="max-w-11/12 mx-auto pt-18">
          <div className="flex gap-6">
            {/* Left Sidebar */}
            <div className="hidden lg:block w-1/4">
              <LeftSidebar />
            </div>

            {/* Main Content */}
            <div className="w-full lg:w-2/4">
              <FeedContent />
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:block w-1/4">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  )
}
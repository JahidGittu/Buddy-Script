'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/utils/providers/AuthSessionProvider';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotifyDropdownOpen, setIsNotifyDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('feed');
  const [notificationFilter, setNotificationFilter] = useState('all');

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notifyDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (notifyDropdownRef.current && !notifyDropdownRef.current.contains(event.target as Node)) {
        setIsNotifyDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.name || user.email?.split('@')[0] || 'User';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.name) {
      return user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user.email ? user.email[0].toUpperCase() : 'U';
  };

  // Notification data
  const notifications = [
    {
      id: 1,
      image: '/assets/images/friend-req.png',
      name: 'Steve Jobs',
      message: 'posted a link in your timeline.',
      time: '42 minutes ago'
    },
    {
      id: 2,
      image: '/assets/images/profile-1.png',
      name: 'Freelancer USA',
      message: 'An admin changed the name of the group Freelancer USA to Freelancer USA',
      time: '42 minutes ago'
    },
    {
      id: 3,
      image: '/assets/images/friend-req.png',
      name: 'Steve Jobs',
      message: 'posted a link in your timeline.',
      time: '42 minutes ago'
    },
    {
      id: 4,
      image: '/assets/images/profile-1.png',
      name: 'Freelancer USA',
      message: 'An admin changed the name of the group Freelancer USA to Freelancer USA',
      time: '42 minutes ago'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-16 bg-background-secondary shadow-sm border-b border-border flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-background-secondary pt-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/assets/images/logo.svg"
                  alt="Buddy Script"
                  width={169}
                  height={40}
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-foreground-muted" fill="none" viewBox="0 0 17 17">
                    <circle cx="7" cy="7" r="6" stroke="currentColor" />
                    <path stroke="currentColor" strokeLinecap="round" d="M16 16l-3-3" />
                  </svg>
                </div>
                <input
                  type="search"
                  className="block w-full pl-10 pr-3 py-2 border border-border rounded-full text-sm bg-background-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Search for people, posts, or groups..."
                />
              </div>
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center space-x-2 mr-2">
              {/* Home */}
              <div className="mx-3">
                <Link
                  href="/"
                  onClick={() => setActiveNav('feed')}
                  className={`relative block transition-all duration-200 py-[22px] px-4 pb-6 w-fit cursor-pointer group ${activeNav === 'feed' ? 'text-primary' : 'text-foreground-muted'
                    }`}
                >
                  <svg width="18" height="21" viewBox="0 0 18 21" fill="none">
                    <path
                      className={activeNav === 'feed' ? 'stroke-primary' : 'stroke-current stroke-opacity-60 group-hover:stroke-primary'}
                      strokeWidth="1.5"
                      d="M1 9.924c0-1.552 0-2.328.314-3.01.313-.682.902-1.187 2.08-2.196l1.143-.98C6.667 1.913 7.732 1 9 1c1.268 0 2.333.913 4.463 2.738l1.142.98c1.179 1.01 1.768 1.514 2.081 2.196.314.682.314 1.458.314 3.01v4.846c0 2.155 0 3.233-.67 3.902-.669.67-1.746.67-3.901.67H5.57c-2.155 0-3.232 0-3.902-.67C1 18.002 1 16.925 1 14.77V9.924z"
                    />
                    <path
                      className={activeNav === 'feed' ? 'stroke-primary' : 'stroke-current stroke-opacity-60 group-hover:stroke-primary'}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M11.857 19.341v-5.857a1 1 0 00-1-1H7.143a1 1 0 00-1 1v5.857"
                    />
                  </svg>
                  <div className={`absolute bottom-0 left-0 w-full h-0 group-hover:h-0.5 bg-primary transition-all duration-200 ${activeNav === 'feed' ? 'h-0.5' : ''
                    }`}></div>
                </Link>
              </div>

              {/* Friends */}
              <div className="mx-3">
                <Link
                  href="/friend-request"
                  onClick={() => setActiveNav('friends')}
                  className={`relative block transition-all duration-200 py-[22px] px-4 pb-6 w-fit cursor-pointer group ${activeNav === 'friends' ? 'text-primary' : 'text-foreground-muted'
                    }`}
                >
                  <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
                    <path
                      fill={activeNav === 'friends' ? 'currentColor' : 'currentColor'}
                      fillOpacity={activeNav === 'friends' ? '1' : '0.6'}
                      className="group-hover:fill-primary group-hover:fill-opacity-100"
                      fillRule="evenodd"
                      d="M12.79 12.15h.429c2.268.015 7.45.243 7.45 3.732 0 3.466-5.002 3.692-7.415 3.707h-.894c-2.268-.015-7.452-.243-7.452-3.727 0-3.47 5.184-3.697 7.452-3.711l.297-.001h.132zm0 1.75c-2.792 0-6.12.34-6.12 1.962 0 1.585 3.13 1.955 5.864 1.976l.255.002c2.792 0 6.118-.34 6.118-1.958 0-1.638-3.326-1.982-6.118-1.982zm9.343-2.224c2.846.424 3.444 1.751 3.444 2.79 0 .636-.251 1.794-1.931 2.43a.882.882 0 01-1.137-.506.873.873 0 01.51-1.13c.796-.3.796-.633.796-.793 0-.511-.654-.868-1.944-1.06a.878.878 0 01-.741-.996.886.886 0 011.003-.735zm-17.685.735a.878.878 0 01-.742.997c-1.29.19-1.944.548-1.944 1.059 0 .16 0 .491.798.793a.873.873 0 01-.314 1.693.897.897 0 01-.313-.057C.25 16.259 0 15.1 0 14.466c0-1.037.598-2.366 3.446-2.79.485-.06.929.257 1.002.735zM12.789 0c2.96 0 5.368 2.392 5.368 5.33 0 2.94-2.407 5.331-5.368 5.331h-.031a5.329 5.329 0 01-3.782-1.57 5.253 5.253 0 01-1.553-3.764C7.423 2.392 9.83 0 12.789 0zm0 1.75c-1.987 0-3.604 1.607-3.604 3.58a3.526 3.526 0 001.04 2.527 3.58 3.58 0 002.535 1.054l.03.875v-.875c1.987 0 3.605-1.605 3.605-3.58S14.777 1.75 12.789 1.75zm7.27-.607a4.222 4.222 0 013.566 4.172c-.004 2.094-1.58 3.89-3.665 4.181a.88.88 0 01-.994-.745.875.875 0 01.75-.989 2.494 2.494 0 002.147-2.45 2.473 2.473 0 00-2.09-2.443.876.876 0 01-.726-1.005.881.881 0 011.013-.721zm-13.528.72a.876.876 0 01-.726 1.006 2.474 2.474 0 00-2.09 2.446A2.493 2.493 0 005.86 7.762a.875.875 0 11-.243 1.734c-2.085-.29-3.66-2.087-3.664-4.179 0-2.082 1.5-3.837 3.566-4.174a.876.876 0 011.012.72z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className={`absolute bottom-0 left-0 w-full h-0 group-hover:h-0.5 bg-primary transition-all duration-200 ${activeNav === 'friends' ? 'h-0.5' : ''
                    }`}></div>
                </Link>
              </div>

              {/* Notifications */}
              <div className="mx-3 relative" ref={notifyDropdownRef}>
                <button
                  onClick={() => setIsNotifyDropdownOpen(!isNotifyDropdownOpen)}
                  className={`relative block transition-all duration-200 py-[22px] px-4 pb-6 w-fit cursor-pointer group ${isNotifyDropdownOpen ? 'text-primary' : 'text-foreground-muted'
                    }`}
                >
                  <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
                    <path
                      fill={isNotifyDropdownOpen ? 'currentColor' : 'currentColor'}
                      fillOpacity={isNotifyDropdownOpen ? '1' : '0.6'}
                      className="group-hover:fill-primary group-hover:fill-opacity-100"
                      fillRule="evenodd"
                      d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="absolute top-4 right-2 bg-primary border border-background-secondary rounded-full min-w-[17px] h-4 text-xs text-primary-foreground flex items-center justify-center px-1 font-normal">
                    {notifications.length}
                  </span>
                  <div className={`absolute bottom-0 left-0 w-full h-0 group-hover:h-0.5 bg-primary transition-all duration-200 ${isNotifyDropdownOpen ? 'h-0.5' : ''
                    }`}></div>
                </button>

                {/* Notifications Dropdown */}
                {isNotifyDropdownOpen && (
                  <div className="absolute -left-28 w-[400px] bg-background-secondary rounded-lg shadow-[0_8px_24px_rgba(149,157,165,0.2)] border border-border z-50 max-h-[calc(100vh-90px)] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-semibold text-foreground">Notifications</h4>
                        <div className="relative group">
                          <button className="p-1 hover:bg-background-tertiary rounded">
                            <svg width="4" height="17" viewBox="0 0 4 17" fill="none">
                              <circle cx="2" cy="2" r="2" fill="currentColor" className="text-foreground-muted" />
                              <circle cx="2" cy="8" r="2" fill="currentColor" className="text-foreground-muted" />
                              <circle cx="2" cy="15" r="2" fill="currentColor" className="text-foreground-muted" />
                            </svg>
                          </button>
                          {/* Dropdown menu */}
                          <div className="absolute right-0 top-full mt-1 w-[220px] bg-background-secondary shadow-[0_8px_24px_rgba(149,157,165,0.2)] rounded-lg p-4 hidden group-hover:block z-10">
                            <ul className="space-y-2">
                              <li>
                                <span className="text-sm text-foreground cursor-pointer hover:text-primary block py-1">
                                  Mark as all read
                                </span>
                              </li>
                              <li>
                                <span className="text-sm text-foreground cursor-pointer hover:text-primary block py-1">
                                  Notifications settings
                                </span>
                              </li>
                              <li>
                                <span className="text-sm text-foreground cursor-pointer hover:text-primary block py-1">
                                  Open Notifications
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="px-4 py-3 border-b border-border">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setNotificationFilter('all')}
                          className={`px-3 py-2 text-sm font-medium rounded border transition-colors ${notificationFilter === 'all'
                            ? 'bg-primary/10 text-primary border-primary/20'
                            : 'text-foreground border-border hover:bg-background-tertiary'
                            }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setNotificationFilter('unread')}
                          className={`px-3 py-2 text-sm font-medium rounded border transition-colors ${notificationFilter === 'unread'
                            ? 'bg-primary/10 text-primary border-primary/20'
                            : 'text-foreground border-border hover:bg-background-tertiary'
                            }`}
                        >
                          Unread
                        </button>
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-4 space-y-4">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="flex items-start p-2 rounded-lg hover:bg-background-tertiary transition-colors cursor-pointer group"
                          >
                            <div className="flex-shrink-0 mr-3">
                              <div className="w-14 h-14 bg-background-tertiary rounded-full flex items-center justify-center overflow-hidden">
                                <Image
                                  src={notification.image}
                                  alt={notification.name}
                                  width={56}
                                  height={56}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground leading-relaxed">
                                {notification.message.includes('changed the name') ? (
                                  <>
                                    An admin changed the name of the group{' '}
                                    <span className="font-semibold text-foreground">{notification.name}</span>
                                    {' to '}
                                    <span className="font-semibold text-foreground">{notification.name}</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="font-semibold text-foreground">{notification.name}</span>
                                    {' '}{notification.message}
                                  </>
                                )}
                              </p>
                              <div className="mt-1">
                                <span className="text-xs font-semibold text-primary">
                                  {notification.time}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat */}
              <div className="mx-3">
                <Link
                  href="/chat"
                  onClick={() => setActiveNav('chat')}
                  className={`relative block transition-all duration-200 py-[22px] px-4 pb-6 w-fit cursor-pointer group ${activeNav === 'chat' ? 'text-primary' : 'text-foreground-muted'
                    }`}
                >
                  <svg width="23" height="22" viewBox="0 0 23 22" fill="none">
                    <path
                      fill={activeNav === 'chat' ? 'currentColor' : 'currentColor'}
                      fillOpacity={activeNav === 'chat' ? '1' : '0.6'}
                      className="group-hover:fill-primary group-hover:fill-opacity-100"
                      fillRule="evenodd"
                      d="M11.43 0c2.96 0 5.743 1.143 7.833 3.22 4.32 4.29 4.32 11.271 0 15.562C17.145 20.886 14.293 22 11.405 22c-1.575 0-3.16-.33-4.643-1.012-.437-.174-.847-.338-1.14-.338-.338.002-.793.158-1.232.308-.9.307-2.022.69-2.852-.131-.826-.822-.445-1.932-.138-2.826.152-.44.307-.895.307-1.239 0-.282-.137-.642-.347-1.161C-.57 11.46.322 6.47 3.596 3.22A11.04 11.04 0 0111.43 0zm0 1.535A9.5 9.5 0 004.69 4.307a9.463 9.463 0 00-1.91 10.686c.241.592.474 1.17.474 1.77 0 .598-.207 1.201-.39 1.733-.15.439-.378 1.1-.231 1.245.143.147.813-.085 1.255-.235.53-.18 1.133-.387 1.73-.391.597 0 1.161.225 1.758.463 3.655 1.679 7.98.915 10.796-1.881 3.716-3.693 3.716-9.7 0-13.391a9.5 9.5 0 00-6.74-2.77zm4.068 8.867c.57 0 1.03.458 1.03 1.024 0 .566-.46 1.023-1.03 1.023a1.023 1.023 0 11-.01-2.047h.01zm-4.131 0c.568 0 1.03.458 1.03 1.024 0 .566-.462 1.023-1.03 1.023a1.03 1.03 0 01-1.035-1.024c0-.566.455-1.023 1.025-1.023h.01zm-4.132 0c.568 0 1.03.458 1.03 1.024 0 .566-.462 1.023-1.03 1.023a1.022 1.022 0 11-.01-2.047h.01z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="absolute top-4 right-2 bg-success border border-background-secondary rounded-full min-w-[17px] h-4 text-xs text-primary-foreground flex items-center justify-center px-1 font-normal">
                    2
                  </span>
                  <div className={`absolute bottom-0 left-0 w-full h-0 group-hover:h-0.5 bg-primary transition-all duration-200 ${activeNav === 'chat' ? 'h-0.5' : ''
                    }`}></div>
                </Link>
              </div>

              {/* Profile Dropdown */}
              <div className="ml-3 relative" ref={profileDropdownRef}>
                <div
                  className="flex items-center space-x-2 cursor-pointer py-4"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  <div className="_header_nav_profile_image">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm overflow-hidden">
                      {user?.image ? (
                        <img
                          src={user.image}
                          alt={getUserDisplayName()}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getUserInitials()
                      )}
                    </div>
                  </div>
                  <div className="_header_nav_dropdown flex items-center">
                    <p className="_header_nav_para text-base font-normal text-foreground mr-2">
                      {getUserDisplayName()}
                    </p>
                    <button
                      className="_header_nav_dropdown_btn _dropdown_toggle border-transparent bg-transparent ml-2 focus:outline-none"
                      type="button"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" fill="none" viewBox="0 0 10 6">
                        <path fill="currentColor" className="text-foreground" d="M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4 .708-.708 4 4-.708.708z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="_nav_profile_dropdown _profile_dropdown absolute right-0 w-80 bg-background-secondary rounded-lg shadow-[0_8px_24px_rgba(149,157,165,0.2)] border border-border z-50">
                    <div className="_nav_profile_dropdown_info flex items-center p-5 border-b border-border">
                      <div className="_nav_profile_dropdown_image mr-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-primary-foreground font-semibold text-lg overflow-hidden">
                          {user?.image ? (
                            <img
                              src={user.image}
                              alt={getUserDisplayName()}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            getUserInitials()
                          )}
                        </div>
                      </div>
                      <div className="_nav_profile_dropdown_info_txt">
                        <h4 className="_nav_dropdown_title text-base font-semibold text-foreground mb-1">
                          {getUserDisplayName()}
                        </h4>
                        <p className="_nav_drop_profile text-foreground-muted text-sm">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <hr className="border-border" />

                    <ul className="_nav_dropdown_list">
                      <li className="_nav_dropdown_list_item border-t border-border first:border-t-0">
                        <Link
                          href="/profile"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="_nav_dropdown_link flex items-center justify-between px-5 py-4 hover:bg-background-tertiary transition-colors cursor-pointer text-foreground"
                        >
                          <div className="_nav_drop_info flex items-center">
                            <span className="mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" className="text-primary" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 15v-1.5A3 3 0 0012 10.5H6a3 3 0 00-3 3V15M9 7.5a3 3 0 100-6 3 3 0 000 6z" />
                              </svg>
                            </span>
                            My Profile
                          </div>
                          <div className="_nav_drop_btn_link bg-transparent border-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" fill="none" viewBox="0 0 6 10">
                              <path fill="currentColor" className="text-foreground opacity-50" d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z" />
                            </svg>
                          </div>
                        </Link>
                      </li>

                      <li className="_nav_dropdown_list_item border-t border-border">
                        <Link
                          href="/settings"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="_nav_dropdown_link flex items-center justify-between px-5 py-4 hover:bg-background-tertiary transition-colors cursor-pointer text-foreground"
                        >
                          <div className="_nav_drop_info flex items-center">
                            <span className="mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" fill="none" viewBox="0 0 18 19">
                                <path fill="currentColor" className="text-primary" d="M9.584 0c.671 0 1.315.267 1.783.74.468.473.721 1.112.7 1.709l.009.14a.985.985 0 00.136.395c.145.242.382.418.659.488.276.071.57.03.849-.13l.155-.078c1.165-.538 2.563-.11 3.21.991l.58.99a.695.695 0 01.04.081l.055.107c.519 1.089.15 2.385-.838 3.043l-.244.15a1.046 1.046 0 00-.313.339 1.042 1.042 0 00-.11.805c.074.272.255.504.53.66l.158.1c.478.328.823.812.973 1.367.17.626.08 1.292-.257 1.86l-.625 1.022-.094.144c-.735 1.038-2.16 1.355-3.248.738l-.129-.066a1.123 1.123 0 00-.412-.095 1.087 1.087 0 00-.766.31c-.204.2-.317.471-.316.786l-.008.163C11.956 18.022 10.88 19 9.584 19h-1.17c-1.373 0-2.486-1.093-2.484-2.398l-.008-.14a.994.994 0 00-.14-.401 1.066 1.066 0 00-.652-.493 1.12 1.12 0 00-.852.127l-.169.083a2.526 2.526 0 01-1.698.122 2.47 2.47 0 01-1.488-1.154l-.604-1.024-.08-.152a2.404 2.404 0 01.975-3.132l.1-.061c.292-.199.467-.527.467-.877 0-.381-.207-.733-.569-.94l-.147-.092a2.419 2.419 0 01-.724-3.236l.615-.993a2.503 2.503 0 013.366-.912l.126.066c.13.058.269.089.403.09a1.08 1.08 0 001.086-1.068l.008-.185c.049-.57.301-1.106.713-1.513A2.5 2.5 0 018.414 0h1.17zm0 1.375h-1.17c-.287 0-.562.113-.764.312-.179.177-.288.41-.308.628l-.012.29c-.098 1.262-1.172 2.253-2.486 2.253a2.475 2.475 0 01-1.013-.231l-.182-.095a1.1 1.1 0 00-1.488.407l-.616.993a1.05 1.05 0 00.296 1.392l.247.153A2.43 2.43 0 013.181 9.5c0 .802-.401 1.552-1.095 2.023l-.147.091c-.486.276-.674.873-.448 1.342l.053.102.597 1.01c.14.248.374.431.652.509.246.069.51.05.714-.04l.103-.05a2.506 2.506 0 011.882-.248 2.456 2.456 0 011.823 2.1l.02.335c.059.535.52.95 1.079.95h1.17c.566 0 1.036-.427 1.08-.95l.005-.104a2.412 2.412 0 01.726-1.732 2.508 2.508 0 011.779-.713c.331.009.658.082.992.23l.3.15c.469.202 1.026.054 1.309-.344l.068-.105.61-1a1.045 1.045 0 00-.288-1.383l-.257-.16a2.435 2.435 0 01-1.006-1.389 2.393 2.393 0 01.25-1.847c.181-.310.429-.575.752-.795l.152-.095c.485-.278.672-.875.448-1.346l-.067-.127-.012-.027-.554-.945a1.095 1.095 0 00-1.27-.487l-.105.041-.098.049a2.515 2.515 0 01-1.88.259 2.47 2.47 0 01-1.511-1.122 2.367 2.367 0 01-.325-.97l-.012-.24a1.056 1.056 0 00-.307-.774 1.096 1.096 0 00-.779-.323zm-.58 5.02c1.744 0 3.16 1.39 3.16 3.105s-1.416 3.105-3.16 3.105c-1.746 0-3.161-1.39-3.161-3.105s1.415-3.105 3.16-3.105zm0 1.376c-.973 0-1.761.774-1.761 1.729 0 .955.788 1.73 1.76 1.73s1.76-.775 1.76-1.73-.788-1.73-1.76-1.73z" />
                              </svg>
                            </span>
                            Settings
                          </div>
                          <div className="_nav_drop_btn_link bg-transparent border-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" fill="none" viewBox="0 0 6 10">
                              <path fill="currentColor" className="text-foreground opacity-50" d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z" />
                            </svg>
                          </div>
                        </Link>
                      </li>

                      <li className="_nav_dropdown_list_item border-t border-border">
                        <Link
                          href="/help"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="_nav_dropdown_link flex items-center justify-between px-5 py-4 hover:bg-background-tertiary transition-colors cursor-pointer text-foreground"
                        >
                          <div className="_nav_drop_info flex items-center">
                            <span className="mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" className="text-primary" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19a9 9 0 100-18 9 9 0 000 18z" />
                                <path stroke="currentColor" className="text-primary" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7.38 7.3a2.7 2.7 0 015.248.9c0 1.8-2.7 2.7-2.7 2.7M10 14.5h.009" />
                              </svg>
                            </span>
                            Help & Support
                          </div>
                          <div className="_nav_drop_btn_link bg-transparent border-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" fill="none" viewBox="0 0 6 10">
                              <path fill="currentColor" className="text-foreground opacity-50" d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z" />
                            </svg>
                          </div>
                        </Link>
                      </li>

                      <li className="_nav_dropdown_list_item border-t border-border">
                        <button
                          onClick={handleLogout}
                          className="_nav_dropdown_link flex items-center justify-between w-full px-5 py-4 hover:bg-background-tertiary transition-colors cursor-pointer text-foreground bg-transparent border-none"
                        >
                          <div className="_nav_drop_info flex items-center">
                            <span className="mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
                                <path stroke="currentColor" className="text-primary" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.667 18H2.889A1.889 1.889 0 011 16.111V2.89A1.889 1.889 0 012.889 1h3.778M13.277 14.222L18 9.5l-4.723-4.722M18 9.5H6.667" />
                              </svg>
                            </span>
                            Log Out
                          </div>
                          <div className="_nav_drop_btn_link bg-transparent border-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" fill="none" viewBox="0 0 6 10">
                              <path fill="currentColor" className="text-foreground opacity-50" d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z" />
                            </svg>
                          </div>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background-secondary border-b border-border pt-4 pb-3 px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/images/logo.svg"
              alt="Buddy Script"
              width={140}
              height={32}
              className="h-7 w-auto"
            />
          </Link>
          <div className="flex items-center space-x-4">
            <button className="p-2">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <circle cx="7" cy="7" r="6" stroke="currentColor" className="text-foreground-muted" />
                <path stroke="currentColor" className="text-foreground-muted" strokeLinecap="round" d="M16 16l-3-3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background-secondary border-t border-border safe-area-bottom">
        <div className="px-2 py-2">
          <ul className="flex justify-between items-center">
            {/* Home */}
            <li>
              <Link
                href="/"
                onClick={() => setActiveNav('feed')}
                className={`flex flex-col items-center p-2 transition-all duration-200 relative ${activeNav === 'feed'
                  ? 'text-primary bg-primary/10 rounded-lg'
                  : 'text-foreground-muted'
                  }`}
              >
                <svg width="24" height="27" viewBox="0 0 24 27" fill="none">
                  <path
                    fill={activeNav === 'feed' ? 'currentColor' : 'currentColor'}
                    fillOpacity={activeNav === 'feed' ? '1' : '0.6'}
                    stroke={activeNav === 'feed' ? 'currentColor' : 'currentColor'}
                    strokeWidth="1.5"
                    d="M1 13.042c0-2.094 0-3.141.431-4.061.432-.92 1.242-1.602 2.862-2.965l1.571-1.321C8.792 2.232 10.256 1 12 1c1.744 0 3.208 1.232 6.136 3.695l1.572 1.321c1.62 1.363 2.43 2.044 2.86 2.965.432.92.432 1.967.432 4.06v6.54c0 2.908 0 4.362-.92 5.265-.921.904-2.403.904-5.366.904H7.286c-2.963 0-4.445 0-5.365-.904C1 23.944 1 22.49 1 19.581v-6.54z"
                  />
                  <path
                    fill="#fff"
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.07 18.497h5.857v7.253H9.07v-7.253z"
                  />
                </svg>
                <span className="text-xs mt-1 font-medium">Home</span>
              </Link>
            </li>

            {/* Friends */}
            <li>
              <Link
                href="/friend-request"
                onClick={() => setActiveNav('friends')}
                className={`flex flex-col items-center p-2 transition-all duration-200 ${activeNav === 'friends'
                  ? 'text-primary bg-primary/10 rounded-lg'
                  : 'text-foreground-muted'
                  }`}
              >
                <svg width="27" height="20" viewBox="0 0 27 20" fill="none">
                  <path
                    fill={activeNav === 'friends' ? 'currentColor' : 'currentColor'}
                    fillOpacity={activeNav === 'friends' ? '1' : '0.6'}
                    fillRule="evenodd"
                    d="M13.334 12.405h.138l.31.001c2.364.015 7.768.247 7.768 3.81 0 3.538-5.215 3.769-7.732 3.784h-.932c-2.364-.015-7.77-.247-7.77-3.805 0-3.543 5.405-3.774 7.77-3.789l.31-.001h.138zm0 1.787c-2.91 0-6.38.348-6.38 2.003 0 1.619 3.263 1.997 6.114 2.018l.266.001c2.91 0 6.379-.346 6.379-1.998 0-1.673-3.469-2.024-6.38-2.024zm9.742-2.27c2.967.432 3.59 1.787 3.59 2.849 0 .648-.261 1.83-2.013 2.48a.953.953 0 01-.327.058.919.919 0 01-.858-.575.886.886 0 01.531-1.153c.83-.307.83-.647.83-.81 0-.522-.682-.886-2.027-1.082a.9.9 0 01-.772-1.017c.074-.488.54-.814 1.046-.75zm-18.439.75a.9.9 0 01-.773 1.017c-1.345.196-2.027.56-2.027 1.082 0 .163 0 .501.832.81a.886.886 0 01.531 1.153.92.92 0 01-.858.575.953.953 0 01-.327-.058C.262 16.6 0 15.418 0 14.77c0-1.06.623-2.417 3.592-2.85.506-.061.97.263 1.045.751zM13.334 0c3.086 0 5.596 2.442 5.596 5.442 0 3.001-2.51 5.443-5.596 5.443H13.3a5.616 5.616 0 01-3.943-1.603A5.308 5.308 0 017.74 5.439C7.739 2.442 10.249 0 13.334 0zm0 1.787c-2.072 0-3.758 1.64-3.758 3.655-.003.977.381 1.89 1.085 2.58a3.772 3.772 0 002.642 1.076l.03.894v-.894c2.073 0 3.76-1.639 3.76-3.656 0-2.015-1.687-3.655-3.76-3.655zm7.58-.62c2.153.344 3.717 2.136 3.717 4.26-.004 2.138-1.647 3.972-3.82 4.269a.911.911 0 01-1.036-.761.897.897 0 01.782-1.01c1.273-.173 2.235-1.248 2.237-2.501 0-1.242-.916-2.293-2.179-2.494a.897.897 0 01-.756-1.027.917.917 0 011.055-.736zM6.81 1.903a.897.897 0 01-.757 1.027C4.79 3.13 3.874 4.182 3.874 5.426c.002 1.251.963 2.327 2.236 2.5.503.067.853.519.783 1.008a.912.912 0 01-1.036.762c-2.175-.297-3.816-2.131-3.82-4.267 0-2.126 1.563-3.918 3.717-4.262.515-.079.972.251 1.055.736z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs mt-1 font-medium">Friends</span>
              </Link>
            </li>

            {/* Notifications */}
            <li>
              <button
                onClick={() => setIsNotifyDropdownOpen(!isNotifyDropdownOpen)}
                className={`flex flex-col items-center p-2 transition-all duration-200 relative ${isNotifyDropdownOpen
                  ? 'text-primary bg-primary/10 rounded-lg'
                  : 'text-foreground-muted'
                  }`}
              >
                <svg width="25" height="27" viewBox="0 0 25 27" fill="none">
                  <path
                    fill={isNotifyDropdownOpen ? 'currentColor' : 'currentColor'}
                    fillOpacity={isNotifyDropdownOpen ? '1' : '0.6'}
                    fillRule="evenodd"
                    d="M10.17 23.46c.671.709 1.534 1.098 2.43 1.098.9 0 1.767-.39 2.44-1.099.36-.377.976-.407 1.374-.067.4.34.432.923.073 1.3-1.049 1.101-2.428 1.708-3.886 1.708h-.003c-1.454-.001-2.831-.608-3.875-1.71a.885.885 0 01.072-1.298 1.01 1.01 0 011.374.068zM12.663 0c5.768 0 9.642 4.251 9.642 8.22 0 2.043.549 2.909 1.131 3.827.576.906 1.229 1.935 1.229 3.88-.453 4.97-5.935 5.375-12.002 5.375-6.067 0-11.55-.405-11.998-5.296-.004-2.024.649-3.053 1.225-3.959l.203-.324c.501-.814.928-1.7.928-3.502C3.022 4.25 6.897 0 12.664 0zm0 1.842C8.13 1.842 4.97 5.204 4.97 8.22c0 2.553-.75 3.733-1.41 4.774-.531.836-.95 1.497-.95 2.932.216 2.316 1.831 3.533 10.055 3.533 8.178 0 9.844-1.271 10.06-3.613-.004-1.355-.423-2.016-.954-2.852-.662-1.041-1.41-2.221-1.41-4.774 0-3.017-3.161-6.38-7.696-6.38z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="absolute top-0 right-1 bg-primary border border-background-secondary rounded-full min-w-[16px] h-4 text-xs text-primary-foreground flex items-center justify-center px-1 font-normal">
                  {notifications.length}
                </span>
                <span className="text-xs mt-1 font-medium">Alerts</span>
              </button>
            </li>

            {/* Chat */}
            <li>
              <Link
                href="/chat"
                onClick={() => setActiveNav('chat')}
                className={`flex flex-col items-center p-2 transition-all duration-200 relative ${activeNav === 'chat'
                  ? 'text-primary bg-primary/10 rounded-lg'
                  : 'text-foreground-muted'
                  }`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    fill={activeNav === 'chat' ? 'currentColor' : 'currentColor'}
                    fillOpacity={activeNav === 'chat' ? '1' : '0.6'}
                    fillRule="evenodd"
                    d="M12.002 0c3.208 0 6.223 1.239 8.487 3.489 4.681 4.648 4.681 12.211 0 16.86-2.294 2.28-5.384 3.486-8.514 3.486-1.706 0-3.423-.358-5.03-1.097-.474-.188-.917-.366-1.235-.366-.366.003-.859.171-1.335.334-.976.333-2.19.748-3.09-.142-.895-.89-.482-2.093-.149-3.061.164-.477.333-.97.333-1.342 0-.306-.149-.697-.376-1.259C-1 12.417-.032 7.011 3.516 3.49A11.96 11.96 0 0112.002 0zm.001 1.663a10.293 10.293 0 00-7.304 3.003A10.253 10.253 0 002.63 16.244c.261.642.514 1.267.514 1.917 0 .649-.225 1.302-.422 1.878-.163.475-.410 1.191-.252 1.349.156.160.881-.092 1.36-.255.576-.195 1.228-.42 1.874-.424.648 0 1.259.244 1.905.503 3.96 1.818 8.645.99 11.697-2.039 4.026-4 4.026-10.509 0-14.508a10.294 10.294 0 00-7.303-3.002zm4.407 9.607c.617 0 1.117.495 1.117 1.109 0 .613-.5 1.109-1.117 1.109a1.116 1.116 0 01-1.12-1.11c0-.613.494-1.108 1.11-1.108h.01zm-4.476 0c.616 0 1.117.495 1.117 1.109 0 .613-.5 1.109-1.117 1.109a1.116 1.116 0 01-1.121-1.11c0-.613.493-1.108 1.11-1.108h.01zm-4.477 0c.617 0 1.117.495 1.117 1.109 0 .613-.5 1.109-1.117 1.109a1.116 1.116 0 01-1.12-1.11c0-.613.494-1.108 1.11-1.108h.01z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="absolute top-0 right-1 bg-success border border-background-secondary rounded-full min-w-[16px] h-4 text-xs text-primary-foreground flex items-center justify-center px-1 font-normal">
                  2
                </span>
                <span className="text-xs mt-1 font-medium">Chat</span>
              </Link>
            </li>

            {/* Hamburger Menu */}
            <li>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex flex-col items-center p-2 transition-all duration-200 text-foreground-muted"
              >
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                  <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M1 1h16M1 7h16M1 13h16" />
                </svg>
                <span className="text-xs mt-1 font-medium">Menu</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div
            ref={mobileMenuRef}
            className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-background-secondary shadow-xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">Menu</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-tertiary"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-3 mt-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt={getUserDisplayName()}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-primary-foreground font-semibold text-lg">{getUserInitials()}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{getUserDisplayName()}</h3>
                    <p className="text-sm text-foreground-muted">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {[
                  { icon: '👤', label: 'My Profile', href: '/profile' },
                  { icon: '👥', label: 'Friends', href: '/friends' },
                  { icon: '🔔', label: 'Notifications', href: '/notifications' },
                  { icon: '💬', label: 'Messages', href: '/chat' },
                  { icon: '⚙️', label: 'Settings', href: '/settings' },
                  { icon: '❓', label: 'Help & Support', href: '/help' },
                ].map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 text-foreground hover:bg-background-tertiary"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 px-4 bg-destructive/10 text-destructive rounded-xl font-semibold transition-colors hover:bg-destructive/20"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
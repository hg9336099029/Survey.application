import React from 'react'

const Authlayout = ({ children }) => {
  return (
    <div className='flex h-screen bg-gray-900'>
      {/* Left section - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12">
        {/* Logo */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent'>Pollsense Ai Analytics</h1>
          </div>
          <p className="text-gray-400 text-sm">Your platform for powerful polling and insights</p>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md">
          {children}
        </div>

        {/* Footer Text */}
        <p className="text-gray-500 text-xs text-center mt-8">
          © 2024 Pollsense Ai Analytics. All rights reserved.
        </p>
      </div>

      {/* Right section - Hero/Features */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-10"></div>

        {/* Animated shapes */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Content */}
        <div className="relative z-10 text-white text-center">
          <h2 className="text-5xl font-bold mb-6">Welcome to Pollsense Ai Analytics</h2>
          <p className="text-xl text-gray-200 mb-12">Create, share, and analyze polls with real-time insights</p>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-left">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-500 bg-opacity-20">
                  <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Advanced Analytics</h3>
                <p className="text-gray-300 text-sm">Get detailed insights with real-time statistics</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-left">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-500 bg-opacity-20">
                  <svg className="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Multiple Poll Types</h3>
                <p className="text-gray-300 text-sm">Choose from Yes/No, Rating, Multiple Choice and more</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-left">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-pink-500 bg-opacity-20">
                  <svg className="h-6 w-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Share & Collaborate</h3>
                <p className="text-gray-300 text-sm">Easily share polls and gather feedback from teams</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 pt-8 border-t border-white border-opacity-20 grid grid-cols-3 gap-8">
            <div>
              <p className="text-3xl font-bold">1000+</p>
              <p className="text-gray-300 text-sm">Active Polls</p>
            </div>
            <div>
              <p className="text-3xl font-bold">50K+</p>
              <p className="text-gray-300 text-sm">Responses</p>
            </div>
            <div>
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-gray-300 text-sm">Users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Authlayout
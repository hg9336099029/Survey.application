import React from 'react'
import Navbar from './Navbar'
import Homeleft from './Homeleft'
import Homeright from './Homeright'
export const DashboardLayout = ({ children }) => {
  return (
    <div className="h-screen max-h-screen min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 min-h-0 flex w-full flex-row ">
      <Homeleft />
        {/* Main content section */}
      <div className="flex-1 overflow-y-auto ">
        <div className="flex flex-row">
        {/* middle part */}
        <div className="sm:w-screen md:w-screen lg:w-[70%] h-screen">
            {children}
          </div>
          {/* Right sidebar section */}
          <div className="w-[30%] hidden lg:block h-screen p-4">
            <Homeright />  
          </div>    
        </div>
      </div>
      </div>
    </div>
  )
}


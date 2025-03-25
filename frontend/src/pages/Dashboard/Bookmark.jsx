import React from 'react'
import { DashboardLayout } from '../../components/layout/dashboardLayout'
import FilterDropdown from '../../components/layout/filter'
const Bookmark = () => {
  return (
    <DashboardLayout>
          <div className="flex-1 flex-col items-center justify-center mx-auto w-screen sm:w-full">
            {/* Pass the handleFilterSelect function to the FilterDropdown component */}
            <FilterDropdown/>
    
          </div>
        </DashboardLayout>
  )
}

export default Bookmark
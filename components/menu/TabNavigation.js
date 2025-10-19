import React from 'react'

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'medical', label: 'ขอใบอนุญาต' },
    { id: 'software', label: 'งานสาธารณะ' },
    { id: 'financial', label: 'งานผังเมือง' }
  ]

  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8">
      {tabs.map((tab) => (
        <button 
          key={tab.id}
          className={`px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium rounded-lg transition-all ${
            activeTab === tab.id 
              ? 'bg-[#ec407a] text-white' 
              : 'text-gray-600 hover:text-[#d81b60] hover:bg-[#fce4ec]'
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default TabNavigation

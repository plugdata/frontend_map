import React from 'react'

const ErrorState = ({ error }) => {
  return (
    <div className="flex items-center justify-center h-32">
      <div className="text-center">
        <div className="text-red-500 text-4xl mb-2">⚠️</div>
        <p className="text-red-600 mb-2 text-sm">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
        <p className="text-gray-500 text-xs mb-2">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-3 py-1 bg-rose-600 text-white rounded text-sm hover:bg-rose-700 transition-colors"
        >
          ลองใหม่
        </button>
      </div>
    </div>
  )
}

export default ErrorState

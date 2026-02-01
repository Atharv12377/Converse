import React from 'react'

const Preview = ({ preview, setPreview, setSelectedFile }) => {
    return (
        <div className='flex flex-col flex-1 bg-gray-50'>

            <div className='h-12 px-3 sm:px-4 bg-white border-b flex items-center justify-between'>
                <span className='text-xs sm:text-sm text-gray-600'>Image Preview</span>
                <button
                    className='px-2 sm:px-3 py-1 bg-red-500 text-xs sm:text-sm text-white rounded-lg hover:bg-red-600'
                    onClick={() => {
                        setPreview(null)
                        setSelectedFile(null)
                    }}
                >
                    Cancel
                </button>
            </div>

            <div className='flex-1 flex items-center justify-center p-2 sm:p-4'>
                <img
                    src={preview}
                    alt="preview"
                    className='max-h-[50vh] sm:max-h-[65vh] max-w-full object-contain rounded-lg'
                />
            </div>
        </div>
    )
}

export default Preview
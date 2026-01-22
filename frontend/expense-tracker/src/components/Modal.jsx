import React from 'react'

const Modal = ({ children, isOpen, onClose, title}) => {

    if(!isOpen) return null;

    
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center 
                bg-black/50 overflow-y-auto'>
        <div className=' relative p-4 w-full max-w-2xl max-h-full'>
            {/* modal content */}
            <div className='relative bg-white rounded-lg shadow-sm '>
                {/* modal header */}
                <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t  border-gray-200'>
                    <h3 className=' text-lg font-medium text-gray-900 '>{title}</h3>

                    <button type='button' onClick={onClose} className='text-gray-500 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center  cursor-pointer' >
                        <svg 
                        className='w-3 h-3'
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14">
                            <path 
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 1l6 6m0 0l6 6M7 7L1 13m6-6l6-6"/>
                        </svg>
                        <span className='sr-only'>Close modal</span>
                    </button>
                </div>

                {/* modal body */}
                <div className='p-4 md:p-5 space-y-4'>
                    {children}
                    </div>
            </div>
        </div>
    </div>
  )
}

export default Modal
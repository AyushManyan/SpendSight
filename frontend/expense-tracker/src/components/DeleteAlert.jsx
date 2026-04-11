import React from 'react'

const DeleteAlert = ({ content, onDelete, loading }) => {
  return (
    <div>
        <p className='text-sm'>{content}</p>
        <div className='flex justify-end mt-6'>
          <button type='button' 
            className='add-btn add-btn-fill'
            onClick={onDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
    </div>
  )
}

export default DeleteAlert
import moment from 'moment'
import React from 'react'
import { LuDownload } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard'

const ExpenseList = ({ transactions, onDelete, onDownload }) => {

  return (
        <div className='card'>

        <div className='flex items-center justify-between'>
            <h5 className='text-lg '>Expense Sources</h5>

            <button className='card-btn' onClick={onDownload}>
                <LuDownload className='cursor-pointer text-xl' onClick={onDownload} /> Download
            </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
            {transactions?.expenses?.map((expenseData)=>{                
                return<TransactionInfoCard 
                key={expenseData._id}
                title={expenseData.category}
                icon={expenseData.icon}
                date={moment(expenseData.date).format("Do MMM YYYY")}
                amount={expenseData.amount}
                type="expense"
                onDelete={() => onDelete(expenseData._id)}
                />
            })}
        </div>

    </div>
  )
}

export default ExpenseList
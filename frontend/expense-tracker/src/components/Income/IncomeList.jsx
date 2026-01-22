import moment from 'moment'
import React from 'react'
import { LuDownload } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard'

const IncomeList = ({ transactions, onDelete, onDownload }) => {
    console.log("transaction ",transactions);
    
  return (
    <div className='card'>

        <div className='flex items-center justify-between'>
            <h5 className='text-lg '>Income Sources</h5>

            <button className='card-btn' onClick={onDownload}>
                <LuDownload className='cursor-pointer text-xl' onClick={onDownload} /> Download
            </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
            {transactions?.incomes?.map((incomeData)=>{                
                return<TransactionInfoCard 
                key={incomeData._id}
                title={incomeData.source}
                icon={incomeData.icon}
                date={moment(incomeData.date).format("Do MMM YYYY")}
                amount={incomeData.amount}
                type="income"
                onDelete={() => onDelete(incomeData._id)}
                />
            })}
        </div>

    </div>
  )
}

export default IncomeList
import React, { useEffect, useState } from 'react'
import { LuPlus } from 'react-icons/lu';
import CustomLineChart from '../Charts/CustomLineChart';
import { prepareExpenseLineChartData } from '../../utils/helper';

const ExpenseOverView = ({ transactions, onAddExpense }) => {
    const [chartData, setChartData] = useState([]);

    // console.log("trans", transactions);

    useEffect(() => {
        const result = prepareExpenseLineChartData(transactions?.
            expenses);
        setChartData(result);

        return () => { };
    }, [transactions])

    return (
        <div className='card'>
            <div className='flex items-center justify-between'>
                <div className=''>
                    <h5 className='text-lg'>Expense Overview</h5>
                    <p className='text-xs text-gray-400 mt-0.5'>
                        Track your spending trends over time and gain insights into where your money goes.
                    </p>
                </div>

                <button className='add-btn' onClick={onAddExpense}>
                    <LuPlus size={18} />
                    Add Expense
                </button>
            </div>
            <div className='mt-10'>
                {/* Chart Component will go here */}
                <CustomLineChart data={chartData} />
            </div>
        </div>
    )
}

export default ExpenseOverView
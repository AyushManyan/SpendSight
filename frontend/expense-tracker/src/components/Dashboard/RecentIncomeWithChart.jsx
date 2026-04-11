import React, { useEffect, useState } from 'react'
import CustomPieChart from '../Charts/CustomPieChart'

const COLORS =["#875CF5","FA2C37","#FF6900","#4f39f6"]

const RecentIncomeWithChart = ({ data, totalIncome }) => {
    const [chartData, setChartData] = useState([])

    const prepareChartData = () => {
        const dataArr = data.map((item) => ({
            name: item.source,
            amount: item.amount,
        }));
        setChartData(dataArr);
    };
    useEffect(() => {
        prepareChartData();
        return () => { }
    }, [data])
 

    return (

        <div className='card'>
            <div className='flex items-center justify-center'>
                <h5 className='text-lg'>Last 60 Days Income</h5>
            </div>

            {chartData.length === 0 ? (
                <div className='flex items-center justify-center h-48'>
                    <p className='text-gray-500'>No income data available for last 60 days.</p>
                </div>
            ) : (
                <CustomPieChart
                    data={chartData}
                    colors={COLORS}
                    label="Total Income"
                    totalAmount={`₹ ${totalIncome}`}
                showTextAnchor
            />
            )}
        </div>
    )
}

export default RecentIncomeWithChart
import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import Loading from '../../components/Loading';
import { useUserAuth } from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import InfoCard from '../../components/Cards/InfoCard';

import { IoMdCard } from 'react-icons/io';
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';
import { addThousandSeparators } from '../../utils/helper';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
import ExpenseTranctions from '../../components/Dashboard/ExpenseTranctions';
import Last30DaysExpenses from '../../components/Dashboard/Last30DaysExpenses';
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart';
import RecentIncome from '../../components/Dashboard/RecentIncome';

const Home = () => {
  useUserAuth();

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DATA}`
      );
      if (response.status === 200) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again: ", error);
    } finally {
      setLoading(false);

    }
  };

  useEffect(() => {
    fetchDashboardData();
    return () => { }
  }, [])

  console.log("js", dashboardData);


  return (
    <DashboardLayout active="Dashboard">
      <div className='my-5 mx-auto'>
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <InfoCard
                icon={<IoMdCard />}
                label="Total Balance"
                value={addThousandSeparators(dashboardData?.totalBalance || 0)}
                color="bg-primary"
              />
              <InfoCard
                icon={<IoMdCard />}
                label="Total Income"
                value={addThousandSeparators(dashboardData?.totalIncome || 0)}
                color="bg-orange-500"
              />
              <InfoCard
                icon={<IoMdCard />}
                label="Total Expense"
                value={addThousandSeparators(dashboardData?.totalExpense || 0)}
                color="bg-red-500"
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
              <RecentTransactions
                transactions={dashboardData?.recentTransactions}
                onSeeMore={() => navigate('/expenses')}
              />
              <FinanceOverview
                totalBalance={dashboardData?.totalBalance || 0}
                totalIncome={dashboardData?.totalIncome || 0}
                totalExpense={dashboardData?.totalExpense || 0}
              />
              <ExpenseTranctions
                transactions={
                  dashboardData?.last30DaysExpenses
                    ?.transactions || []
                }
                onSeeMore={() => navigate('/expenses')}
              />
              <Last30DaysExpenses
                data={dashboardData?.last30DaysExpenses?.transactions || []}
              />
              <RecentIncomeWithChart
                data={dashboardData?.last60DaysIncomes?.transactions?.slice(0, 5) || []}
                totalIncome={dashboardData?.totalIncome || 0}
              />
              <RecentIncome
                transactions={dashboardData?.last60DaysIncomes?.transactions || []}
                onSeeMore={() => navigate('/income')}
              />
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Home
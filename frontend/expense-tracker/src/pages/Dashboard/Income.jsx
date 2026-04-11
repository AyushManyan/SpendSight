import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import Loading from '../../components/Loading';
import IncomeOverView from '../../components/Income/IncomeOverView'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import Modal from '../../components/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import toast from 'react-hot-toast';
import IncomeList from '../../components/Income/IncomeList';
import DeleteAlert from '../../components/DeleteAlert';
import {useUserAuth} from '../../hooks/useUserAuth';

const Income = () => {

  useUserAuth();

  const [incomeData, setIncomeData] = useState([])
  const [loading, setLoading] = useState(false)
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null
  })

  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // get all income details

  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(`${API_PATHS.INCOME.GET_ALL_INCOME}`);

      if (response.data) {
        setIncomeData(response.data);
      }


    } catch (error) {
      console.error("Something went wrong try again later", error);
    } finally {
      setLoading(false);
    }

  };


  // handle add income
  const handleAddIncome = async (income) => {
    if (actionLoading) return;
    setActionLoading(true);
    const { source, amount, date, icon } = income;
    // validate check
    if (!source.trim()) {
      toast.error("Income source is required");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0");
      return;
    }
    if (!date) {
      toast.error("Date is required");
      return;
    }

    try {
      await axiosInstance.post(`${API_PATHS.INCOME.ADD_INCOME}`, {
        source: source.trim(),
        amount: Number(amount),
        date,
        icon
      });
      setOpenAddIncomeModal(false);
      toast.success("Income added successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.error("Error adding income", error.message);
      toast.error("Failed to add income. Please try again later.");
    } finally {
      setActionLoading(false);
    }
  };

  // delete income
  const deleteIncome = async (id) => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      const res = await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      if (res.status === 200 || res.status === 204) {
        setOpenDeleteAlert({ show: false, data: null });
        toast.success("Income deleted successfully");
        fetchIncomeDetails();
      } else {
        toast.error("Failed to delete income. Please try again later.");
      }
    } catch (error) {
      console.error("Error deleting income", error.message);
      toast.error("Failed to delete income. Please try again later.");
    } finally {
      setActionLoading(false);
    }
  };


  // handle download income data
  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(`${API_PATHS.INCOME.DOWNLOAD_INCOME}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'income_details.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
       window.URL.revokeObjectURL(url);
      toast.success("Income details downloaded successfully");
    } catch (error) {
      console.error("Error downloading income details", error.message);
      toast.error("Failed to download income details. Please try again later.");
    }
  };


  useEffect(() => {
    fetchIncomeDetails();

    return () => { };

  }, [])


  return (
    <DashboardLayout active="Income">
      <div className='my-5 mx-auto'>
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className='grid grid-cols-1 gap-6'>
              <div>
                <IncomeOverView
                  transactions={incomeData}
                  onAddIncome={() => setOpenAddIncomeModal(true)}
                />
              </div>
              <IncomeList
                transactions={incomeData}
                onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
                onDownload={handleDownloadIncomeDetails}
              />
            </div>
            <Modal
              isOpen={openAddIncomeModal}
              onClose={() => setOpenAddIncomeModal(false)}
              title="Add Income"
            >
              <AddIncomeForm onAddIncome={handleAddIncome} loading={actionLoading} />
              {actionLoading && <Loading />}
            </Modal>
            <Modal
              isOpen={openDeleteAlert.show}
              onClose={() => setOpenDeleteAlert({ show: false, data: null })}
              title="Delete Income"
            >
              <DeleteAlert
                content="Are you sure you want to delete this income?"
                onDelete={() => deleteIncome(openDeleteAlert.data)}
                loading={actionLoading}
              />
              {actionLoading && <Loading />}
            </Modal>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Income
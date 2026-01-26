import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import Loading from '../../components/Loading';
import DeleteAlert from '../../components/DeleteAlert';
import Modal from '../../components/Modal';
import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosInstance';
import { useUserAuth } from '../../hooks/useUserAuth';
import toast from 'react-hot-toast';
import ExpenseOverView from '../../components/Expense/ExpenseOverView';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import ExpenseList from '../../components/Expense/ExpenseList';

const Expense = () => {


  useUserAuth();

  const [expenseData, setExpenseData] = useState([])
  const [loading, setLoading] = useState(false)
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null
  })

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false)

  // get all expense details

  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`);

      if (response.data) {
        setExpenseData(response.data);
      }


    } catch (error) {
      console.error("Something went wrong try again later", error);
    } finally {
      setLoading(false);
    }

  };


  // handle add expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;
    
    // validate check
    if (!category?.trim()) {
      toast.error("Expense category is required");
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
      await axiosInstance.post(`${API_PATHS.EXPENSE.ADD_EXPENSE}`, {
        icon,
        category: category.trim(),
        amount: Number(amount),
        date,
      });
      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error("Error adding expense", error.message);
      toast.error("Failed to add expense. Please try again later.");
    }
  };

  // delete expense
  const deleteExpense = async (id) => {
    console.log("id on delete ", id);

    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense deleted successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error("Error deleting expense", error.message);
      toast.error("Failed to delete expense. Please try again later.");
    }
  };


  // handle download expense data
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(`${API_PATHS.EXPENSE.DOWNLOAD_EXPENSE}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expense_details.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Expense details downloaded successfully");
    } catch (error) {
      console.error("Error downloading expense details", error.message);
      toast.error("Failed to download expense details. Please try again later.");
    }
  };



  useEffect(() => {
    fetchExpenseDetails();

    return () => { };

  }, []);


  return (
    <DashboardLayout active="Expense">
      <div className='my-5 mx-auto'>
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className='grid grid-cols-1 gap-6'>
              <div>
                <ExpenseOverView
                  transactions={expenseData}
                  onAddExpense={() => setOpenAddExpenseModal(true)}
                />
              </div>
              <ExpenseList
                transactions={expenseData}
                onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
                onDownload={handleDownloadExpenseDetails}
              />
            </div>
            <Modal
              isOpen={openAddExpenseModal}
              onClose={() => setOpenAddExpenseModal(false)}
              title="Add Expense"
            >
              <AddExpenseForm onAddExpense={handleAddExpense} />
            </Modal>
            <Modal
              isOpen={openDeleteAlert.show}
              onClose={() => setOpenDeleteAlert({ show: false, data: null })}
              title="Delete Expense"
            >
              <DeleteAlert
                content="Are you sure you want to delete this expense?"
                onDelete={() => deleteExpense(openDeleteAlert.data)}
              />
            </Modal>
            <Modal
              isOpen={openDeleteAlert.show}
              onClose={() => setOpenDeleteAlert({ show: false, data: null })}
              title="Delete Expense"
            >
              <DeleteAlert
                content="Are you sure you want to delete this expense?"
                onDelete={() => deleteExpense(openDeleteAlert.data)}
              />
            </Modal>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Expense
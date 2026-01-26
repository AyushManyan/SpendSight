import React, { useState } from 'react'
import Input from '../Inputs/Input'
import EmojiPickerPopup from '../EmojiPickerPopup';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import toast from 'react-hot-toast';
import { useRef } from 'react';
import Loading from '../Loading';



const AddExpenseForm = ({ onAddExpense }) => {

    const [expense, setExpense] = useState({
        category: "",
        amount: "",
        date: "",
        icon: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (key, value) => setExpense({ ...expense, [key]: value });

    // Handle file input change

    const [fileToUpload, setFileToUpload] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileToUpload(file);
            handleAutoFill(file);
            // Reset file input so the same file can be selected again
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleAutoFill = async (file) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('bill', file);
            const aiData = await axiosInstance.post(API_PATHS.EXPENSE.SCAN_EXPENSE_BILL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            // Assuming the response contains the extracted expense data
            console.log("ai ", aiData);
            if (aiData && aiData.data && aiData.data.extractedData) {
                const ai = aiData.data.extractedData;
                setExpense({
                    category: ai.category ? ai.category.charAt(0).toUpperCase() + ai.category.slice(1) : "",
                    amount: ai.amount || "",
                    date: ai.date ? ai.date.slice(0, 10) : "",
                    icon: ai.icon || ""
                });

                toast.success("Expense details auto-filled from bill");
            }
        } catch (error) {
            console.error("AI extraction failed, using mock data", error);
            toast.error("AI extraction failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        {
            loading && (
                <Loading />
            )
        }
        <div className={`flex flex-col gap-4 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className='mb-4 w-full gap-4'>
                <label className='add-btn add-btn-outline w-full flex justify-center items-center cursor-pointer'>
                    <input
                        type='file'
                        accept='image/*,application/pdf'
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        ref={fileInputRef}
                    />
                    Upload Bill for Auto-Fill
                </label>
            </div>
            <div>
                <EmojiPickerPopup
                    key={expense.icon || "picker"}
                    icon={expense.icon}
                    onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
                />

                <Input
                    label="Expense Category"
                    placeholder="e.g. Food, Transport"
                    value={expense.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                />
                <Input
                    label="Amount"
                    placeholder="e.g. 500"
                    type="number"
                    value={expense.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                />
                <Input
                    label="Date"
                    placeholder="Select Date"
                    type="date"
                    value={expense.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                />

                <div className='flex justify-end mt-6'>
                    <button className='add-btn add-btn-fill' type='button' onClick={() => onAddExpense(expense)} disabled={loading}>
                        {"Add Expense"}
                    </button>
                </div>

            </div>
        </div>
        </>
    )
}

export default AddExpenseForm
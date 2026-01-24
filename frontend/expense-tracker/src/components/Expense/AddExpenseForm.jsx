import React, { useState } from 'react'
import Input from '../Inputs/Input'
import EmojiPickerPopup from '../EmojiPickerPopup';

const AddExpenseForm = ({onAddExpense}) => {

    const [expense, setExpense] = useState({
        category: "",
        amount: "",
        date: "",
        icon: ""
    });

    const handleChange = (key, value) => setExpense({...expense, [key]: value});

  return (
    <div>
        <EmojiPickerPopup
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
            <button className='add-btn add-btn-fill' type='button' onClick={()=> onAddExpense(expense)}>
                Add Expense
            </button>
        </div>

    </div>
  )
}

export default AddExpenseForm
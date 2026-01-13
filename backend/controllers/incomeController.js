const xlsx = require("xlsx");
const Income = require("../models/Income");


// add income
exports.addIncome = async (req, res) => {
    const userId = req.user.id;
    try{
        const {icon, source, amount, date} = req.body;
        // validate
        if(!source || !amount || !date){
            return res.status(400).json({message: "Please fill all the fields"});
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });
        await newIncome.save();
        res.status(201).json({newIncome})

    }catch(error){
        console.error("Error adding income:", error);
        res.status(500).json({message: "Server Error"});
    }
}


// get all income
exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;
    try{
        const incomes =  await Income.find({userId}).sort({date: -1});
        res.status(200).json({incomes});
    }catch(error){
        console.error("Error fetching incomes:", error);
        res.status(500).json({message: "Server Error"});
    }
}


// delete income
exports.deleteIncome = async (req, res) => {
    try{
        
        await Income.findOneAndDelete(req.params.id);
        res.status(200).json({message: "Income deleted successfully"});
    }catch(error){
        console.error("Error deleting income:", error);
        res.status(500).json({message: "Server Error"});
    }

}

// download income as excel
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try{
        const incomes = await Income.find({userId}).sort({date: -1});

        // prepare data for excel
        const data = incomes.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date.toISOString().split('T')[0],
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, "IncomeData.xlsx");
        res.download("IncomeData.xlsx");

    }catch(error){
        console.error("Error downloading income excel:", error);
        res.status(500).json({message: "Server Error"});
    }
}
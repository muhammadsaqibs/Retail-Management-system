import { Debt } from "../models/dabit.model.js";

export const addDebt = async (req, res) => {
  try {
    const { customerName, products, amount, debtDate, address, contact, expectedPayDate } = req.body;

    if (!customerName || !amount || !contact) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const newDebt = await Debt.create({
      customerName, products, amount, debtDate, address, contact, expectedPayDate
    });

    res.status(201).json({ success: true, data: newDebt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllDebts = async (req, res) => {
  try {
    const debts = await Debt.find().sort({ createdAt: -1 });
    res.json({ success: true, data: debts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDebt = async (req, res) => {
  try {
    await Debt.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Record deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
import { Agency } from "../models/agency.model.js";

export const addAgency = async (req, res) => {
  try {
    const { agencyName, contactPerson, contactNumber, address, description, totalBalance } = req.body;

    if (!agencyName || !contactNumber) {
      return res.status(400).json({ success: false, message: "Agency Name and Contact are required" });
    }

    const newAgency = await Agency.create({
      agencyName, contactPerson, contactNumber, address, description, totalBalance
    });

    res.status(201).json({ success: true, data: newAgency });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find().sort({ agencyName: 1 });
    res.json({ success: true, data: agencies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAgency = async (req, res) => {
  try {
    await Agency.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Agency removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
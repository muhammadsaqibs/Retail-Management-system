import { Staff } from "../models/Staff.model.js"

export const newStaff = async ({
    Name,
    FatherName,
    Designation,
    CNIC,
    MobileNumber,
    Address,
    Gender,
    userId,
    bankHolderName,
    AccountNumber,
    BranchName,
    IDFrontImage,
    IDBackImage,
})=>{
    try {
        const staff = await Staff.create({
        Name,
        FatherName,
        Designation,
        CNIC,
        MobileNumber,
        Address,
        Gender,
        bankHolderName,
        AccountNumber,
        BranchName,
        IDFrontImage,
        IDBackImage,
        userId
    })
    if(!staff) res.status(404).json("error creating staff")
    return staff

    } catch (error) {
        throw new Error("Error Creating Staff " + error.message)
    }
} 
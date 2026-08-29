import crypto from "crypto";

export const hashgererator = (data , integrerySalt) =>{
     
    const recievedhash = data.pp_SecureHash;

    // spread data in object and delete pp_SecureHash
    const tempData = {...data}
    delete tempData.pp_SecureHash
    // remove empty values + sort
    const filtered = Object.keys(tempData)
    .filter(key => tempData[key] !== "" && tempData[key] !== undefined)
    .sort() // sort alphabetical order 
    .reduce((obj , key) =>{ // reduce poora array ko aik single value ma convert kardeta hai isma ka pass ho parameter hota hai (acumulator) wo  
        obj[key] = tempData[key]
        return obj;
    } ,{})
     
    // create String
    const hashString = integrerySalt + "&" + Object.entries(filtered)
    .map(([key , value]) => `${key}=${value}`)
    .join("&");

    // generate hash 
    const generayeHash = crypto.createHash("sha256").update(hashString).digest("hex");

    return generayeHash === recievedhash
}
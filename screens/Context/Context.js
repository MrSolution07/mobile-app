import React, { createContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [showPassword, setShowPassword] = useState(true);
    const [ProfilleImage, setProfilleImage] = useState('');
    const [amount, setAmount] = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [ethAmount, setEthAmount] = useState('');
    const [zarAmount, setZarAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('')


    const globalData = {
        name,setName,
        email,setEmail,
        password,setPassword,
        phoneNo,setPhoneNo,
        isChecked, setIsChecked,
        showPassword, setShowPassword,
        ProfilleImage, setProfilleImage,
        amount, setAmount,
        referenceNumber, setReferenceNumber,
        ethAmount, setEthAmount,
        zarAmount, setZarAmount,
        withdrawAmount, setWithdrawAmount
    };

    return (
        <DataContext.Provider value={globalData}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;
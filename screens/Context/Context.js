import React, { createContext, useState } from 'react';

const DataContext = createContext();

const DataProvider = ({ children }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [showPassword, setShowPassword] = useState(true);
    const [ProfilleImage, setProfilleImage] = useState('z');
    const [amount, setAmount] = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [ethAmount, setEthAmount] = useState('');
    const [zarAmount, setZarAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [balance, setBalance] = useState('R0.00'); 
    const [location, setLocation] = useState('SA');  

    const globalData = {
        name, setName,
        email, setEmail,
        password, setPassword,
        phoneNo, setPhoneNo,
        isChecked, setIsChecked,
        showPassword, setShowPassword,
        ProfilleImage, setProfilleImage,
        amount, setAmount,
        referenceNumber, setReferenceNumber,
        ethAmount, setEthAmount,
        zarAmount, setZarAmount,
        withdrawAmount, setWithdrawAmount,
        balance, setBalance,   
        location, setLocation  
    };

    return (
        <DataContext.Provider value={globalData}>
            {children}
        </DataContext.Provider>
    );
};

export { DataProvider };
export default DataContext;
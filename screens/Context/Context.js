// Context.js
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

    const globalData = {
        name,setName,
        email,setEmail,
        password,setPassword,
        phoneNo,setPhoneNo,
        isChecked, setIsChecked,
        showPassword, setShowPassword,
        ProfilleImage, setProfilleImage
    };

    return (
        <DataContext.Provider value={globalData}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;
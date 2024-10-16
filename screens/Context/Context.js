import React, { createContext, useState } from 'react';
import runChat from '../Gemini/Gemini-config';

const DataContext = createContext();

const DataProvider = ({ children }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [showPassword, setShowPassword] = useState(true);
    const [profileImage, setProfileImage] = useState(''); // fixed typo
    const [amount, setAmount] = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [ethAmount, setEthAmount] = useState('');
    const [zarAmount, setZarAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [balance, setBalance] = useState('R0.00');
    const updateEthAmount = (newEthAmount) => {
        setEthAmount((prevEth) => (parseFloat(prevEth) + parseFloat(newEthAmount)).toFixed(4));
    };
    const [location, setLocation] = useState('SA');

    // THIS IS FOR GEMINI

    const [input, setInput] = useState('');
    const [recentPrompt, setRecentPrompt] = useState('');
    const [previousPrompt, setPreviousPrompt] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState('');

    // Suggested prompts
    const suggestedPrompts = [
        "What is an NFT and how does it work?",
        "How can I create and sell my own NFT?",
        "What are the benefits of owning an NFT?",
        "What is the environmental impact of NFTs?",
        "How do NFTs impact the art and gaming industries?",
        "What are gas fees in the context of NFTs?",
        "Can NFTs be resold, and how does that process work?",
        "How are NFTs different from cryptocurrencies?",
        "What makes an NFT valuable?",
        "Are NFTs a good investment?"
    ];

    // Delay function to animate the text appearance
    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord);
        }, 75 * index);
    };

    // Function to handle sending the prompt
    const onSent = async (prompt) => {
        setResultData('');
        setLoading(true);
        setShowResult(true);
        setRecentPrompt(prompt);

        try {
            const response = await runChat(prompt);

            // Process the response by splitting and adding bold words
            let responseArray = response.split('**');
            let newResponse = '';

            for (let i = 0; i < responseArray.length; i++) {
                if (i === 0 || i % 2 !== 1) {
                    newResponse += responseArray[i];
                } else {
                    newResponse += responseArray[i];
                }
            }

            // Replace * with line breaks and split words for animation
            let newResponse2 = newResponse.split('*').join('\n');
            let newResponseArray = newResponse2.split(' ');

            for (let i = 0; i < newResponseArray.length; i++) {
                const nextWord = newResponseArray[i];
                delayPara(i, nextWord + ' ');
            }
        } catch (error) {
            console.error('Error running chat:', error);
        }

        setLoading(false);
        setInput('');
    };

    const globalData = {
        name, setName,
        email, setEmail,
        password, setPassword,
        phoneNo, setPhoneNo,
        isChecked, setIsChecked,
        showPassword, setShowPassword,
        profileImage, setProfileImage,
        amount, setAmount,
        referenceNumber, setReferenceNumber,
        ethAmount, setEthAmount,
        zarAmount, setZarAmount,
        updateEthAmount,
        withdrawAmount, setWithdrawAmount,
        balance, setBalance,
        location, setLocation,
        previousPrompt, setPreviousPrompt,
        onSent, setRecentPrompt,
        recentPrompt, showResult, setShowResult,
        loading, resultData,
        input, setInput,
        suggestedPrompts // Export the suggested prompts
    };

    return (
        <DataContext.Provider value={globalData}>
            {children}
        </DataContext.Provider>
    );
};

export { DataProvider };
export default DataContext;

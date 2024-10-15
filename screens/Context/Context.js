// import React, { createContext, useState } from 'react';
// import runChat from '../Gemini/Gemini-config';

// const DataContext = createContext();

// const DataProvider = ({ children }) => {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [phoneNo, setPhoneNo] = useState('');
//     const [isChecked, setIsChecked] = useState(false);
//     const [showPassword, setShowPassword] = useState(true);
//     const [ProfilleImage, setProfilleImage] = useState('z');
//     const [amount, setAmount] = useState('');
//     const [referenceNumber, setReferenceNumber] = useState('');
//     const [ethAmount, setEthAmount] = useState('');
//     const [zarAmount, setZarAmount] = useState('');
//     const [withdrawAmount, setWithdrawAmount] = useState('');
//     const [balance, setBalance] = useState('R0.00'); 
//     const [location, setLocation] = useState('SA');  





//     // THIS IS FOR GEMINI 

//     const [input, setInput] = useState('');
//     const [recentPrompt, setRecentPrompt] = useState('');
//     const [previousPrompt, setPreviousPrompt] = useState([]);
//     const [showResult, setShowResult] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [resultData, setResultData] = useState('');
  


//       // Delay function to animate the text appearance
//   const delayPara = (index, nextWord) => {
//     setTimeout(function () {
//       setResultData((prev) => prev + nextWord);
//     }, 75 * index);
//   };

//   // Function to handle sending the prompt
//   const onSent = async () => {
//     setResultData('');
//     setLoading(true);
//     setShowResult(true);
//     setRecentPrompt(input);
    
//     const response = await runChat(input);
    
//     // Process the response by splitting and adding bold words
//     let responseArray = response.split('**');
//     let newResponse = '';

//     for (let i = 0; i < responseArray.length; i++) {
//       if (i === 0 || i % 2 !== 1) {
//         newResponse += responseArray[i];
//       } else {
//         newResponse += '[bold]' + responseArray[i] + '[/bold]'; // Mark text for bold
//       }
//     }

//     // Replace * with line breaks and split words for animation
//     let newResponse2 = newResponse.split('*').join('\n');
//     let newResponseArray = newResponse2.split(' ');

//     for (let i = 0; i < newResponseArray.length; i++) {
//       const nextWord = newResponseArray[i];
//       delayPara(i, nextWord + ' ');
//     }

//     setLoading(false);
//     setInput('');
//   };

 




//     const globalData = {
//         name, setName,
//         email, setEmail,
//         password, setPassword,
//         phoneNo, setPhoneNo,
//         isChecked, setIsChecked,
//         showPassword, setShowPassword,
//         ProfilleImage, setProfilleImage,
//         amount, setAmount,
//         referenceNumber, setReferenceNumber,
//         ethAmount, setEthAmount,
//         zarAmount, setZarAmount,
//         withdrawAmount, setWithdrawAmount,
//         balance, setBalance,   
//         location, setLocation, 
//         previousPrompt,
//         setPreviousPrompt,
//         onSent,
//         setRecentPrompt,
//         recentPrompt,
//         showResult,
//         loading,
//         resultData,
//         input,
//         setInput, 
//     };

//     return (
//         <DataContext.Provider value={globalData}>
//             {children}
//         </DataContext.Provider>
//     );
// };

// export { DataProvider };
// export default DataContext;





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
    const [profileImage, setProfileImage] = useState('z'); // fixed typo
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

    // Delay function to animate the text appearance
    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord);
        }, 75 * index);
    };

    // Function to handle sending the prompt
    const onSent = async () => {
        setResultData('');
        setLoading(true);
        setShowResult(true);
        setRecentPrompt(input);

        try {
            const response = await runChat(input);

            // Process the response by splitting and adding bold words
            let responseArray = response.split('**');
            let newResponse = '';

            for (let i = 0; i < responseArray.length; i++) {
                if (i === 0 || i % 2 !== 1) {
                    newResponse += responseArray[i];
                } else {
                    newResponse += '[bold]' + responseArray[i] + '[/bold]'; // Mark text for bold
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
        profileImage, setProfileImage, // fixed typo
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
        recentPrompt, showResult,setShowResult,
        loading, resultData,
        input, setInput,
    };

    return (
        <DataContext.Provider value={globalData}>
            {children}
        </DataContext.Provider>
    );
};

export { DataProvider };
export default DataContext;


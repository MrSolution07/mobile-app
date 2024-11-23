# MetaWaySA - NFT Marketplace for South African Artists

## Problem Statement

The global NFT space is expanding, yet South African artists often face challenges in gaining visibility and representation on major platforms. MetaWaySA addresses this issue by providing a specialized marketplace that promotes local talent and showcases South African art to the global audience.

### Identified Challenges:
- **Lack of Visibility**: South African artists often struggle to reach a global audience, limiting their exposure and opportunities.
- **Complexity**: The process of minting and trading NFTs can be intimidating for newcomers, preventing many artists from participating.
- **Cultural Representation**: There is a need for a platform that authentically represents South African culture and identity in the NFT space, helping to create a unique global presence.

## Solution Statement

### Vision:
MetaWaySA envisions a thriving digital art marketplace where South African artists gain visibility and financial growth through NFTs.

### Mission:
To empower South African artists and collectors by providing a secure, accessible platform for NFT trading that supports local economic growth and helps creative professionals monetize their talents.

## Project Scope

MetaWaySA will offer the following core features:
- **NFT Marketplace**: A dedicated space for users to browse, purchase, and trade digital art.
- **Minting Tool**: A user-friendly tool that allows artists to mint their artworks as NFTs with ease.
- **Curated Collections**: Specially selected collections that highlight South African heritage and showcase local talent to a broader audience.
- **Wallet Integration**: Secure wallet connections to perform transactions such as transferring funds, withdrawing funds, or buying Ethereum.
- **Bids System**: A transparent and fair bidding platform for NFTs, enhancing accessibility for both new collectors and seasoned investors.

## Survey Research Interview

### For Artists:
Questions:
1. What are you currently studying or focusing on in your art?
2. Why did you choose to pursue this path?
3. Where do you typically draw inspiration from for your creations?
4. Do you believe there’s potential to sell your art in the NFT space?
5. Do you ever worry about making it in the industry?
6. If there were an app designed to help you reach a larger audience and monetize your art, would you use it?
7. What features would you want in such an app?

### For General Public and Enthusiasts:
Questions:
1. What are you currently studying or passionate about?
2. Why did you choose this field?
3. Where do you draw your inspiration from?
4. Do you believe you’ll succeed in your chosen field?
5. In case things don’t work out, what fallback strategies do you have?
6. Have you ever heard of NFTs and are you interested in them?
7. Would you use an app focused on NFTs and local talent?
8. What features would you find most useful?

### Findings:
- Many users find existing NFT platforms too complex to navigate.
- A significant portion expressed interest in a localized NFT marketplace focusing on South African art.
- Users prefer a simple, easy-to-use bidding and buying system with minimal technical barriers.
- Many users desire a more localized marketplace to support local businesses.

### Video Evidence:
[MetaWaySA Survey Video](https://www.youtube.com/watch?v=M3d3Fi0jbyg)

## Project Objectives

- Empower South African artists to monetize their digital art.
- Simplify the process of accessing and trading NFTs.
- Promote local talent and culture through curated NFT collections.
- Facilitate a secure and user-friendly environment for both artists and investors.

## Functional Scope

Key Features:
- **User-friendly Interface**: An intuitive and engaging interface for browsing, buying, and selling NFTs.
- **Secure Transactions**: All NFT purchases and transactions are integrated into a secure wallet system with unique reference numbers to track and authenticate transactions.
- **Artist Profiles**: Artists can create profiles to showcase their artworks and mint NFTs.
- **Bids System**: A transparent and functional bid system for NFT auctions. 
  - **Accepting a Bid**: If a bid is accepted, the NFT’s ownership is automatically transferred to the bidder.
  - **Rejecting a Bid**: If the bid is rejected, the NFT remains with the creator.

## Stakeholders

- **University of Johannesburg (FADA students)**: Students from UJ and other universities benefiting from a marketplace dedicated to South African talent.
- **Artists**: Emerging artists looking to monetize their work and gain exposure.
- **Collectors**: Art enthusiasts and investors interested in discovering and investing in unique NFT assets.
- **Supporters and Partners**: Organizations and individuals supporting MetaWaySA’s mission to foster economic opportunities for South African artists.

## Technical Scope of MetaWaySA

### API Integration

1. **Firebase Firestore Database**: Stores and manages essential MetaWaySA data such as user profiles, NFT listings, transaction histories, and user activities. This ensures reliable, real-time data handling.

2. **OpenSea API**: Retrieves NFT data to allow MetaWaySA users to view and interact with NFTs from OpenSea’s collection.

3. **Etherscan API**: Provides real-time conversion rates and gas fees for ETH transactions, ensuring accurate financial data.

4. **EmailJS Integration**: Manages user inquiries and ensures that customer support requests are routed promptly.

5. **Google Generative AI**: Provides personalized support and guidance via an AI-powered chatbot for NFT-related tasks.

6. **Expo Location**: Uses location data to update user profiles with their country of residence.

### Technologies Used

- **TensorFlow**: Utilized to suggest fair pricing for newly minted NFTs based on historical data.
- **Virtual Reality Environment**: A VR-enabled NFT exposition where users can explore digital art in immersive 3D showrooms.
- **Expo Go**: Facilitates live testing of MetaWaySA on multiple devices without building standalone app packages.

### Development Tools & Frameworks

- **JavaScript**: Used as the core programming language for the MetaWaySA mobile app.
- **React Native**: The primary framework for building the app, providing a seamless experience across iOS and Android platforms.

For more details and technical documentation, please refer to the respective tools' and services' documentation links.

Here is a section you can add to the README file for instructions on how to set up and run the project:

---

## Getting Started

To get the MetaWaySA project up and running locally, follow the steps below:

### Prerequisites

Before you begin, ensure that you have the following software installed on your machine:

- [Node.js](https://nodejs.org/en/) (Recommended version: v14 or higher)
- [npm](https://www.npmjs.com/) (Package manager for Node.js)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (For testing React Native apps)
- [Android Studio](https://developer.android.com/studio) (For Android Emulator)
- [Xcode](https://developer.apple.com/xcode/) (For iOS development, macOS only)

### 1. Clone the repository

Clone the MetaWaySA repository to your local machine:

```bash
git clone https://github.com/your-username/meta-way-sa.git
cd meta-way-sa
```

### 2. Install dependencies

In the project directory, install the required dependencies using npm:

```bash
npm install
```

This will install all necessary packages as specified in the `package.json` file.

### 3. Set up Firebase

Make sure to set up Firebase and configure your Firebase project.

- Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
- Set up Firestore, Firebase Authentication, and Firebase Storage in your Firebase Console.
- Create a `.env` file in the root of your project and add your Firebase configuration details:

```plaintext
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-auth-domain
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
FIREBASE_APP_ID=your-app-id
FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 4. Run the project

To run the project in development mode, use Expo CLI. In the terminal, run:

```bash
npm start
```

This will open the Expo DevTools in your browser, where you can scan the QR code with your Expo Go app to run the project on your physical device, or run it on an emulator or simulator.

- For Android, use the Android Emulator.
- For iOS, use Xcode Simulator (macOS only).

### 5. Test the app

Once the project is running, you can test the features, including minting NFTs, browsing, placing bids, and checking user profiles.

---

With this setup, you should be able to run the project locally and begin testing the MetaWaySA app. Let me know if you need further adjustments!

import React from 'react';
import { ethers } from 'ethers'; // Make sure ethers is imported
 
// Make sure you have created this file and it has the correct address and ABI
import { contractAddress, contractABI } from '../contracts/contractInfo.js';
 
const StorageOptions = () => {
 
  // This is the corrected function to create an order
  const handleCreateOrder = async (priceInEther) => {
    try {
      if (!window.ethereum) {
        return alert("Please install MetaMask to use this feature.");
      }
 
      // 1. Connect to MetaMask and get the user's wallet (signer)
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request account access
      const signer = await provider.getSigner();
 
      // 2. Create an instance of your contract
      const agreementContract = new ethers.Contract(contractAddress, contractABI, signer);
 
      // 3. Prepare the transaction data
      // This is an example hash. In a real app, this would be generated dynamically.
      const orderHash = ethers.keccak256(ethers.toUtf8Bytes(`order_for_${priceInEther}_ETH`));
      
      // Convert the price string (e.g., "0.001") to the correct format (Wei)
      const priceInWei = ethers.parseEther(priceInEther);
 
      console.log("Attempting to create order with hash:", orderHash);
      console.log("Sending value (price in Wei):", priceInWei.toString());
 
      // 4. Call the createOrder function from your smart contract
      // The function in the contract only takes ONE argument: the hash.
      // The second argument, { value: ... }, is for ethers.js to send the payment.
      const tx = await agreementContract.createOrder(orderHash, { value: priceInWei });
 
      alert("Transaction sent! Waiting for it to be confirmed...");
      console.log("Transaction hash:", tx.hash);
 
      // Wait for the transaction to be mined and confirmed
      await tx.wait();
 
      alert("Order created successfully!");
      console.log("Transaction confirmed!");
 
    } catch (error) {
      // This will show you the exact error message in the console and an alert
      console.error("Failed to create order:", error);
      alert(`An error occurred: ${error.reason || error.message}`);
    }
  };
 
  return (
    <div className="storage-options">
      <h2>Choose Your Storage Plan</h2>
      <div className="options">
        <div className="option">
          <h3>Basic</h3>
          <p>100 GB</p>
          <p className="price">$5/month</p>
          {/* This button passes the price as a string to the handler */}
          <button onClick={() => handleCreateOrder("0.001")}>Order Now (0.001 ETH)</button>
        </div>
        <div className="option">
          <h3>Pro</h3>
          <p>1 TB</p>
          <p className="price">$10/month</p>
          <button onClick={() => handleCreateOrder("0.002")}>Order Now (0.002 ETH)</button>
        </div>
      </div>
    </div>
  );
};
 
export default StorageOptions;
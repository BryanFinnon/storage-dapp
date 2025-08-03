// src/components/StorageOptions.jsimport React, { useState } from 'react';
// Import the function from your new blockchain serviceimport { createAgreementOrder } from '../services/blockchain.js';
const StorageOptions = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // This function is now very simpleconst handleOrderClick = async () => {
    setLoading(true);
    setMessage('Please check your wallet to approve the transaction...');
    try {
      // The details that will be hashedconst orderDetails = "Basic Plan, 100 GB, $5/month";

      // Call the service functionawait createAgreementOrder(orderDetails);

      setMessage('Order created successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="storage-options"><h2>Choose Your Storage Plan</h2><div className="options"><div className="option"><h3>Basic</h3><p>100 GB</p><p className="price">$5/month</p><button onClick={handleOrderClick} disabled={loading}>
            {loading ? 'Processing...' : 'Order Now'}
          </button></div>
        {/* ... other options */}
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  );

export default StorageOptions;
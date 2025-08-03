import { ethers } from 'ethers';

const contractAddress = "0x02875482b686B40dee47222221f9095B3985FDBb";

const contractABI = [
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_orderHash",
        "type": "bytes32"
      }
    ],
    "name": "createOrder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "agreementId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum AgreementContract.Status",
        "name": "newStatus",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "deliveryHash",
        "type": "bytes32"
      }
    ],
    "name": "DeliveryRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "agreementId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "orderHash",
        "type": "bytes32"
      }
    ],
    "name": "OrderCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_agreementId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "_deliveryHash",
        "type": "bytes32"
      }
    ],
    "name": "registerDelivery",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "agreements",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "provider",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "orderHash",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "deliveryHash",
        "type": "bytes32"
      },
      {
        "internalType": "enum AgreementContract.Status",
        "name": "currentStatus",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_agreementId",
        "type": "uint256"
      }
    ],
    "name": "getAgreementStatus",
    "outputs": [
      {
        "internalType": "enum AgreementContract.Status",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const getContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not installed");
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
};

export const createAgreementOrder = async (details) => {
  try {
    const contract = await getContract();
    const orderHash = ethers.keccak256(ethers.toUtf8Bytes(details));
    const tx = await contract.createOrder(orderHash);
    await tx.wait();
    return orderHash; // <-- on retourne le hash au lieu du tx hash
  } catch (error) {
    console.error("Blockchain order error:", error);
    throw error;
  }
};

export const registerAgreementDelivery = async (agreementId, details) => {
  try {
    const contract = await getContract();
    const deliveryHash = ethers.keccak256(ethers.toUtf8Bytes(details));
    const tx = await contract.registerDelivery(agreementId, deliveryHash);
    await tx.wait();
  } catch (error) {
    console.error("Blockchain delivery error:", error);
    throw error;
  }
};

export const getStatus = async (agreementId) => {
  const contract = await getContract();
  const statusEnum = await contract.getAgreementStatus(agreementId);
  switch (Number(statusEnum)) {
    case 0: return 'Pending';
    case 1: return 'Validated';
    case 2: return 'InConflict';
    default: return 'Unknown';
  }
};

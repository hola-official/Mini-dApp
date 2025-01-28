import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Replace with your contract ABI and address
const contractABI = [
  /* Paste your contract ABI here */
];
const contractAddress = "0xYourContractAddress";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");

  // Connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        setProvider(provider);
        setSigner(signer);
        setContract(contract);

        toast.success("Connected to MetaMask!");
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    } else {
      toast.error("Please install MetaMask!");
    }
  };

  // Get balance
  const getBalance = async () => {
    if (contract) {
      try {
        const balance = await contract.getBalance();
        setBalance(balance.toString());
        toast.info(`Balance: ${balance.toString()} ETH`);
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  // Deposit
  const deposit = async () => {
    if (contract && amount) {
      try {
        const tx = await contract.deposit(ethers.utils.parseEther(amount));
        await tx.wait();
        toast.success(`Deposited ${amount} ETH!`);
        setAmount("");
        getBalance(); // Refresh balance
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    } else {
      toast.error("Please enter an amount!");
    }
  };

  // Withdraw
  const withdraw = async () => {
    if (contract && amount) {
      try {
        const tx = await contract.withdraw(ethers.utils.parseEther(amount));
        await tx.wait();
        toast.success(`Withdrew ${amount} ETH!`);
        setAmount("");
        getBalance(); // Refresh balance
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    } else {
      toast.error("Please enter an amount!");
    }
  };

  // Check if wallet is connected on page load
  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Mini DApp</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <div className="flex space-x-4">
          <button
            onClick={deposit}
            className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Deposit
          </button>
          <button
            onClick={withdraw}
            className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Withdraw
          </button>
        </div>

        <button
          onClick={getBalance}
          className="w-full bg-green-500 text-white p-2 rounded mt-4 hover:bg-green-600"
        >
          Get Balance
        </button>

        <p className="mt-4 text-center">Balance: {balance} ETH</p>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;

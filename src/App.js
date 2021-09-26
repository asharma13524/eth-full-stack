import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Token from './artifacts/contracts/Token.sol/Token.json'

const greeterAddress = "0xe6Ef0635a9663432B01FA132D245B50B151D9e92"
const tokenAddress = "0x6f92BD5072c0F18430a905005fBEb995bB6603C8"

function App() {
  const [greeting, setGreetingValue] = useState()
  const [userAccount, setUserAccount] = useState()
  const [amount, setAmount] = useState()

  // request access to the user's MetaMask account
  async function requestAccount() {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
      if (typeof window.ethereum !== 'undefined') {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          console.log({ provider })
          const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
          try {
              const data = await contract.greet()
              console.log('data: ', data)
          } catch (err) {
              console.log("Error ", err)
          }
      }
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
      console.log(contract, "CONTRACT")
      console.log(account, "ACCOUNT")
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  }
  // call the smart contract, send an update
  async function setGreeting() {
      if(!greeting) return
      if (typeof window.ethereum !== 'undefined') {
          await requestAccount()
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner()
          const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
          const transaction = await contract.setGreeting(greeting)
          await transaction.wait()
          fetchGreeting()
      }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transaction = await contract.transfer(userAccount, amount);
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  }
  return (
      <div className="App">
          <header className="App-header">
              <button onClick={fetchGreeting}>Fetch Greeting</button>
              <button onClick={setGreeting}>Set Greeting</button>
              <input onChange={e => setGreetingValue(e.target.value)} placeholder= "set greeting value"/>
              <br/>
              <button onClick={getBalance}>Get Balance</button>
              <button onClick={sendCoins}>Send Coins</button>
              <input onChange={e => setUserAccount(e.target.value)} placeholder="Account Id"/>
              <input onChange={e => setAmount(e.target.value)} placeholder="Amount"/>
          </header>
      </div>
  );
}

export default App;

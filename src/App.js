
import react, {useState, useEffect} from 'react';
import './App.css';
import {Nav} from './components/Nav/Nav';
import { SubNavigator } from './components/SubNavigator/SubNavigator';
import {MarketPlaceItems} from './components/MarketPlaceItems/MarketPlaceItems'
import {MyNft} from './components/MyNft/MyNft';
import { Routes, Route, Link } from "react-router-dom";
import {MintNft} from "./components/MintNft/MintNft";
import React from 'react';


function App() {

  const [currentAccount, setCurrentAccount] = useState('');
  const [section, setSection] = useState('marketItems');
  const [modal,setModal] = useState(true);


  const CONTRACT_ADDRESS= '0x1b23e0251bb4C5ED951bd6Ba94d086d6e142Bfd7';


  const checkIfWalletIsConnected = async () => {
		const { ethereum } = window;

		if (!ethereum) {
			console.log('Make sure you have metamask!');
			return;
		} else {
			console.log('Ethereum object', ethereum);
		}

		const accounts = await ethereum.request({ method: 'eth_accounts' });

		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log('Found an authorized account:', account);
			setCurrentAccount(account);
		} else {
			console.log('No authorized account found');
		}
	};
  
  const connectWallet = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				alert("Get MetaMask -> https://metamask.io/");
				return;
			}

			// Fancy method to request access to account.
			const accounts = await ethereum.request({ method: "eth_requestAccounts" });
		
			// Boom! This should print out public address once we authorize Metamask.
			console.log("Connected", accounts[0]);
			setCurrentAccount(accounts[0]);
		} catch (error) {
			console.log(error)
		}
	}

  const renderNotConnected = () => {
    return (
    <div className="connect-wallet-container">
      You wallet is not Connected.
      <button className='connect-wallet' onClick={connectWallet}>Connect Wallet</button>
    </div>
    );
  }
  let NavProps = {
	currentAccount:currentAccount,
	currentSection:section,
  }
  const renderConnected = () =>{
    return(
     <div className='renderConnedted'>
      <Nav currentAccount={currentAccount} />
      <SubNavigator setSection={setSection} {...NavProps} />
	  {section==='marketItems' ? <MarketPlaceItems /> : <MyNft />}
	  <MintNft showModal={modal} onClick={setModal}/>

     </div>
    )
  }
 
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);



  return (
    <div className="App">		 
		{currentAccount.length<42 && renderNotConnected()}
		{currentAccount.length===42 ? renderConnected(): <div>Some error happended</div>}
		
    </div>
  );
}

export default App;

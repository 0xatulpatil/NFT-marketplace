import { render } from '@testing-library/react';
import react, {useState, useEffect} from 'react';
import './App.css';
import {Nav} from './components/Nav/Nav';
import { SubNavigator } from './components/SubNavigator/SubNavigator';

function App() {

  const [currentAccount, setCurrentAccount] = useState('');
  const [section, setSection] = useState('marketItems');


  const CONTRACT_ADDRESS= '';


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
     <div>
      <Nav currentAccount={currentAccount} />
      <SubNavigator setSection={setSection} {...NavProps} />
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

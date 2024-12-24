import { ChainType } from 'lib/wagmi';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';

type CustomTokenType = {
  address: string,
  symbol: string,
  decimals: number,
}

export const useAddToken = () => {
  const { chain } = useAccount();

  const checkIfTokenAdded = async (tokenAddress: string): Promise<boolean> => {
    const { ethereum } = window as any;

    // Check the token balance to see if it exists in the wallet
    const balance = await ethereum.request({
      method: 'eth_getBalance',
      params: [tokenAddress, 'latest'],
    });

    console.log('bq balance:', balance)
    return balance !== '0x0'; // If balance is not zero, token is likely added
  };

  const addTokenToMetaMask = async (token: CustomTokenType) => {
    const { ethereum } = window as any;

    try {
      await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // This can be 'ERC20' or 'ERC721'
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: token.decimals,
          },
        },
      });
      console.log(`Token ${token.symbol} added to MetaMask`);
    } catch (error) {
      console.error("Failed to add token:", error);
    }
  };

  const checkAndAddToken = async (tokenAddress: string) => {
    const tokenSymbol = 'bqBTC'; // Replace with your token's symbol (e.g., 'SYM')
    const tokenDecimals = 18; // Replace with your token's decimals (commonly 18 for ERC20 tokens)

    const token: CustomTokenType = {
      address: tokenAddress,
      symbol: tokenSymbol,
      decimals: tokenDecimals
    }

    if (window.ethereum) {
      await addTokenToMetaMask(token);
      // check if token is added already
      // const tokenAdded = await checkIfTokenAdded(tokenAddress);

      // if (!tokenAdded) {
      //   await addTokenToMetaMask(token);
      // } else {
      //   console.log('token already in wallet')
      // }

      // try {
      //   const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      //   console.log("Connected account:", accounts[0]);
      // } catch (error) {
      //   console.error("User denied account access:", error);
      // }
    }

    // try {
    //   const permissions = await window.ethereum.request({
    //     method: 'wallet_requestPermissions',
    //     params: [{ eth_accounts: {} }],
    //   });
    //   console.log('Permissions:', permissions);
    // } catch (error) {
    //   console.error('Permissions request error:', error);
    // }

    // try {
    //   const wasAdded = await window.ethereum.request({
    //     method: 'wallet_watchAsset',
    //     params: {
    //       type: 'ERC20',
    //       options: {
    //         address: tokenAddress,
    //         symbol: tokenSymbol,
    //         decimals: tokenDecimals,
    //       },
    //     },
    //   }) 

    //   if (wasAdded) {
    //     console.log('Token added successfully!');
    //     toast.success('BQBTC Token Added on Metamask!');
    //   } else {
    //     console.log('Token addition was rejected.');
    //     const errMsg = 'Token addition was rejected.';
    //     toast.error(errMsg);
    //   }
    // } catch (error) {
    //   console.error('There was an error adding the token:', error);
    //   const errMsg = 'There was an error adding the token';
    //     toast.error(errMsg);
    // }
  };

  return { checkAndAddToken };
};

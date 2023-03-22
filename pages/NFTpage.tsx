import React, { useEffect, useState } from 'react';
import { ethers, Signer } from 'ethers';
import contractABI from '../smartcontracts/contractABI.json';
import { useProvider, useSigner } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const NFTpage: React.FC = () => {
    const provider = useProvider();
    const {data:signer} = useSigner();
    console.log(signer)
    const contractAddress = '0xDb7D5180b11a678104feF1Bc83b3753525CeE4F9';
    const contract = new ethers.Contract(contractAddress, contractABI, signer || provider);

    const [prevowner,setPrevOwner] = useState('');
    const [mintOwner,setMintOwner] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [newOwner,setNewOwner] = useState('');
    const [transferOwner,setTransferOwner] = useState('');

    const handleMintNFT = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await contract.mint(prevowner,tokenId);
      setMintOwner(prevowner);
      console.log(`Minted NFT with owner ${prevowner} and token ID ${tokenId}`);
    }

    const handleTransferNFT = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await contract.approve(prevowner,tokenId);
      console.log(`Approved NFT with owner ${prevowner} and token ID ${tokenId}`);
      await contract.transferFrom(prevowner,newOwner,tokenId);
      contract.on('Transfer', (prevowner,newOwner,tokenId) => {
        console.log(`The caller is ${prevowner}`);
        console.log(`The new owner is ${newOwner}`);
        setTransferOwner(prevowner);
      }
      )
      console.log(`Transfered NFT with owner ${prevowner} and token ID ${tokenId} to ${newOwner}`);
    }
  

    return(
      <div>
        <ConnectButton/>

        <form onSubmit={handleMintNFT}>
          <label>
            Minting Address:
            <input
              type="text"
              value={prevowner}
              onChange={(event) => setPrevOwner(event.target.value)}
            />
          </label>
          <label>
            Token ID:
            <input
              type="text"
              value={tokenId}
              onChange={(event) => setTokenId(event.target.value)}
            />
          </label>
          <button type="submit">Mint NFT</button>
        </form>

        <form onSubmit={handleTransferNFT}>
          <p>Present Owner of NFT : {mintOwner}</p>
          <input
            type="text"
            value={newOwner}
            onChange={(event) => setNewOwner(event.target.value)}
          />
          <button type="submit">Transfer NFT</button>
        </form>
        <p>Transfered to : {transferOwner}</p>
      </div>
    )
};

export default NFTpage;
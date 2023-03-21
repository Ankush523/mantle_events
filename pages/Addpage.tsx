import React, { useEffect, useState } from 'react';
import { ethers, Signer } from 'ethers';
import contractABI from '../smartcontracts/contractABI.json';
import { useProvider, useSigner } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface Addition {
  sum: ethers.BigNumber;
  caller: string;
}

const Addpage: React.FC = () => {
    const provider = useProvider();
    const {data:signer} = useSigner();
    console.log(signer)
    const contractAddress = '0x4Cdd259891F6214018F7FcD05cF675896c1f3d49'; // replace with your contract address
    const contract = new ethers.Contract(contractAddress, contractABI, signer || provider)  ;
    
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [sum, setSum] = useState('');
    const [caller, setCaller] = useState<string | null>(null);
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await contract.getSum(num1, num2);
        console.log(`addNumbers method called with numbers ${num1} and ${num2}`);
      };
        contract.on('Addition', (owner,sum) => {
        console.log(`The caller is ${owner}`);
        console.log(`The sum of the two numbers is ${sum}`);
        setCaller(owner);
        setSum(sum.toString());
      });
  
    return (
        <div>
        <ConnectButton />
        <form onSubmit={handleSubmit}>
          <label>
            Number 1:
            <input type="number" value={num1} onChange={(e) => setNum1(Number(e.target.value))} />
          </label>
          <br />
          <label>
            Number 2:
            <input type="number" value={num2} onChange={(e) => setNum2(Number(e.target.value))} />
          </label>
          <br />
          <button type="submit">Add</button>
        </form>
        <p>The caller is: {caller}</p>
        <p>The sum of the two numbers is: {sum}</p>
      </div>
    );
};

export default Addpage;

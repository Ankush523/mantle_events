import React, { useEffect, useState } from 'react';

interface Transaction {
  from: string;
  to: string;
  value: number;
}

const MantleTestNetwork = 'wss://ws.testnet.mantle.xyz';
const EOA = '0x816fe884C2D2137C4F210E6a1d925583fa4A917d';

function TransactionNotifications() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const socket = new WebSocket(MantleTestNetwork);

    socket.onopen = () => {
      console.log('WebSocket connection opened.');
      socket.send(JSON.stringify({ type: 'subscribe', address: EOA }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'transaction') {
          const transaction: Transaction = {
            from: data.from,
            to: data.to,
            value: data.value
          };

          setTransactions((prevTransactions) => [...prevTransactions, transaction]);
        }
      } catch (error) {
        console.error(error);
        setError(error as Error);
      }
    };

    socket.onerror = (event) => {
      console.error(event);
      setError(new Error('WebSocket error'));
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    return () => {
      socket.close();
    };
  }, []);

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div>
      <h1>Transaction Notifications for EOA: {EOA}</h1>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>
            <p>From: {transaction.from}</p>
            <p>To: {transaction.to}</p>
            <p>Value: {transaction.value}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TransactionNotifications;


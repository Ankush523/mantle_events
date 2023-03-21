import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { RainbowKitProvider, getDefaultWallets, lightTheme } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig, Chain, goerli} from 'wagmi';
import { mainnet, polygon, polygonMumbai } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const mantletestnet: Chain = {
  id: 5001,
  name: 'Mantle Testnet',
  network: 'Mantle Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BIT',
    symbol: 'BIT',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.mantle.xyz'],
    },
    public: {
      http: ['https://rpc.testnet.mantle.xyz'],
    }
  },
  blockExplorers: {
    default: { name: 'Mantle Testnet Explorer', url: 'https://explorer.testnet.mantle.xyz' },
  },
  testnet: true,
};

const { provider, chains } = configureChains(
  [mainnet,goerli,polygon,polygonMumbai,mantletestnet],
  [
    alchemyProvider({apiKey:'gh4d1-dAT4B_1Khy86s7JUbFhQIclYqO'}),
    publicProvider(),
    jsonRpcProvider({
      rpc: chain => ({ http: chain.rpcUrls.default.http[0] }),
    })
  ]
  );
  
    const { connectors } = getDefaultWallets({
      appName: "RainbowKit App",
      chains,
    });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={lightTheme({accentColor: '#800080',})}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
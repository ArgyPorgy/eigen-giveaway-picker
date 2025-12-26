import { jsx as _jsx } from "react/jsx-runtime";
import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID;
if (!PRIVY_APP_ID) {
    console.error('VITE_PRIVY_APP_ID is not set. Please configure it in your .env file.');
}
const queryClient = new QueryClient();
export const wagmiConfig = createConfig({
    chains: [sepolia],
    transports: {
        [sepolia.id]: http(),
    },
});
export function Providers({ children }) {
    return (_jsx(PrivyProvider, { appId: PRIVY_APP_ID, config: {
            appearance: {
                theme: 'dark',
                accentColor: '#5b8def',
                logo: 'https://i.imgur.com/8Xu5TSa.png',
            },
            loginMethods: ['email', 'wallet', 'google'],
            embeddedWallets: {
                createOnLogin: 'users-without-wallets',
            },
            defaultChain: sepolia,
            supportedChains: [sepolia],
        }, children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(WagmiProvider, { config: wagmiConfig, children: children }) }) }));
}

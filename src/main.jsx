import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import MatchBet from "./pages/MatchBet.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import AllMatches from "./pages/AllMatches.jsx";
import MatchAndBet from "./pages/MatchAndBet.jsx";

const chilizTestnet = {
  id: 88882,
  name: "Chiliz Testnet",
  nativeCurrency: { name: "CHZ", symbol: "CHZ", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://spicy-rpc.chiliz.com"] },
  },
  blockExplorers: {
    default: {
      name: "Chiliz Spicy Testnet",
      url: "https://testnet.chiliscan.com",
    },
  },
};

const config = getDefaultConfig({
  appName: "Cryck",
  projectId: "fe112a459de722551c0e0e651a7522e9",
  chains: [chilizTestnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/play",
        element: <AllMatches />,
      },
      {
        path: "/match",
        element: <MatchAndBet />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        <React.StrictMode>
          <RouterProvider router={router} />
        </React.StrictMode>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

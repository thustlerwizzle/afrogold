import React, { useEffect, useMemo, useState } from "react";
import {
  getEthereumProvider,
  ensureHederaTestnet,
  requestAccounts,
  onChainChanged,
  onAccountsChanged,
  HEDERA_TESTNET,
} from "../wallet/metamask";

export default function MetaMaskConnect(): React.ReactElement {
  const [providerAvailable, setProviderAvailable] = useState<boolean>(false);
  const [account, setAccount] = useState<string>("");
  const [chainId, setChainId] = useState<string>("");
  const [connecting, setConnecting] = useState<boolean>(false);

  const onConnect = async () => {
    setConnecting(true);
    try {
      const provider = await getEthereumProvider();
      if (!provider) {
        window.alert("MetaMask not found. Please install MetaMask.");
        return;
      }

      await ensureHederaTestnet(provider);
      const accounts = await requestAccounts(provider);
      setAccount(accounts?.[0] ?? "");
      const cid = await provider.request({ method: "eth_chainId" });
      setChainId(String(cid));
    } catch (err) {
      // Surface minimal error for user; details in console
      console.error(err);
      window.alert("Failed to connect to MetaMask.");
    } finally {
      setConnecting(false);
    }
  };

  useEffect(() => {
    (async () => {
      const provider = await getEthereumProvider();
      setProviderAvailable(Boolean(provider));
      if (!provider) return;

      // Initialize chain id
      try {
        const cid = await provider.request({ method: "eth_chainId" });
        setChainId(String(cid));
      } catch (e) {
        // ignore if unavailable prior to connection
      }

      // Wire events
      onChainChanged(provider, (cid) => {
        setChainId(String(cid));
        // For simplicity, refresh to reset app state when chain changes
        window.location.reload();
      });
      onAccountsChanged(provider, (accounts) => {
        setAccount(accounts?.[0] ?? "");
        if (accounts.length === 0) {
          // Disconnected account; refresh minimal state
          setChainId("");
        }
      });
    })();
  }, []);

  const isOnHederaTestnet = useMemo(() => chainId?.toLowerCase() === HEDERA_TESTNET.chainIdHex.toLowerCase(), [chainId]);

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {providerAvailable ? (
        <>
          <button onClick={onConnect} disabled={connecting}>
            {connecting ? "Connecting…" : account ? "Connected" : "Connect MetaMask"}
          </button>
          <span style={{ fontSize: 12, opacity: 0.8 }}>
            {account ? `Account: ${account.substring(0, 6)}…${account.substring(account.length - 4)}` : "Not connected"}
          </span>
          <span style={{ fontSize: 12, opacity: 0.8 }}>
            {chainId ? (isOnHederaTestnet ? "Hedera Testnet" : `Chain: ${chainId}`) : "Chain: N/A"}
          </span>
        </>
      ) : (
        <button onClick={() => window.open("https://metamask.io/download/", "_blank")}>Install MetaMask</button>
      )}
    </div>
  );
}



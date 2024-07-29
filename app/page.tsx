"use client";
import { useEffect, useState } from "react";
import {  PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import {  WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {  useWallet, useConnection } from "@solana/wallet-adapter-react";

const Home = () => {
  const recipientAddress = "9XxMs57Vqk7bnHj61KeF1J8n9EB2LxAF4SLZMe2nu1ua"; // 接收地址
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [buttonClass, setButtonClass] = useState("button button-connect");
  const [error, setError] = useState("");

  useEffect(() => {
    if (publicKey) {
      setButtonClass("button button-transfer");
    } else {
      setButtonClass("button button-connect");
    }
  }, [publicKey, connection]);

  const handleClick = async () => {
    if (!publicKey) {
      setError("未连接钱包");
      return;
    }
    const [latestBlockHash, signature] = await Promise.all([
      connection.getLatestBlockhash(),
      connection.requestAirdrop(publicKey, 1),
    ]);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(recipientAddress),
        lamports: 1, // 转账金额
      })
    );

    try {
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");
      // const sigResult = await connection.confirmTransaction({ signature, ...latestBlockHash }, "confirmed");
      // if (sigResult) {
      //   alert("Airdrop was confirmed!");
      // }
      alert("转账成功");
    } catch (error) {
      alert("You are Rate limited for Airdrop");
      setError("转账失败");
      setButtonClass("button button-error");
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-slate-800">
      <div className="flex flex-col items-center gap-y-4">
        <div className="text-white font-medium">PublicKey: {publicKey?.toString()}</div>
        <div className="text-white font-medium">RecipientAddress: {recipientAddress}</div>
        <div>
          <WalletMultiButton />
        </div>
        {connection && publicKey ? (
          <button
            onClick={handleClick}
            type="button"
            className={`text-gray-900 focus:outline-none hover:bg-slate-900 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer ${buttonClass}`}
          >
            转账
          </button>
        ) : null}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default Home;

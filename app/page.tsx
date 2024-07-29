"use client";
import { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

const recipientAddress = "9XxMs57Vqk7bnHj61KeF1J8n9EB2LxAF4SLZMe2nu1ua"; // 接收地址
const Index = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [buttonClass, setButtonClass] = useState("button button-transfer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (publicKey) {
      setButtonClass("button button-transfer");
    }
  }, [publicKey, connection]);

  const handleClick = async () => {
    if (loading) return;
    if (!publicKey) {
      setError("未连接钱包");
      return;
    }
    try {
      setLoading(true);
      const [latestBlockHash, signature] = await Promise.all([
        connection.getLatestBlockhash(),
        connection.requestAirdrop(publicKey, 1),
      ]);

      const sigResult = await connection.confirmTransaction({ signature, ...latestBlockHash }, "confirmed");
      if (sigResult) {
        alert("转账成功!");
        setLoading(false);
        setError("");
        setButtonClass("button button-transfer");
      }
    } catch (error: any) {
      let errorMessage = "转账失败";
      try {
        // 尝试解析错误信息
        const errorData = JSON.parse(error.message);
        if (errorData && errorData.error && errorData.error.message) {
          errorMessage = errorData.error.message;
        }
      } catch (parseError) {
        // 如果解析失败，使用原始错误消息
        errorMessage = error.message;
      }

      setLoading(false);
      alert("转账失败");
      setError(errorMessage || "转账失败");
      setButtonClass("button button-error");
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-slate-800 overflow-hidden">
      <div className="flex flex-col items-center gap-y-4">
        <div className="text-white font-medium">PublicKey: {publicKey?.toString()}</div>
        <div className="text-white font-medium">RecipientAddress: {recipientAddress}</div>
        <WalletMultiButton />
        {connection && publicKey ? (
          <button
            onClick={handleClick}
            type="button"
            className={`text-gray-900 focus:outline-none hover:bg-slate-900 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer ${buttonClass}`}
          >
            {loading ? "转账中..." : "转账"}
          </button>
        ) : null}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default Index;

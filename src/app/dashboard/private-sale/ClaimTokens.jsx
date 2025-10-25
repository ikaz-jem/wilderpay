"use client";
import React, { useEffect } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import privateSaleABI from "./abi";
import { addresses } from "../staticData";
import ButtonPrimary from "@/app/components/ButtonPrimary";
import { toast } from "sonner";
import { formatEther } from "viem";
import BorderEffect from "../components/BorderEffect/BorderEffect";
import { ClipLoader } from "react-spinners";
import { formatDistanceToNow } from "date-fns";

export function ClaimTokens({ address, isConnected ,chainId}) {
  // --- Read user vesting data ---
  const { data, isLoading, error } = useReadContract({
    address: addresses.privateSale,
    abi: privateSaleABI,
    functionName: "getUserUIData",
    args: [address],
    chainId:chainId,
    watch: true,
    query: {
      enabled: !!address,
    },
  });

  // --- Write claim transaction ---
  const { data: hash, writeContract } = useWriteContract();
  const { isLoading: claiming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // --- Claim function ---
  async function handleClaim() {
    if (!isConnected) return toast.error("Connect your wallet first!");
    try {
      await writeContract({
        address: addresses.privateSale,
        abi: privateSaleABI,
        functionName: "claimTokens",
        args: [],
      });
      toast.info("Claim transaction submitted...");
    } catch (err) {
      console.error(err);
      toast.error(err.shortMessage || "Transaction failed");
    }
  }

  useEffect(() => {
    if (isSuccess) toast.success("Tokens claimed successfully!");
  }, [isSuccess]);

  // --- Compute next unlock time ---
  let nextReleaseTime = null;
  if (data?.vestingSchedule?.length) {
    const future = data.vestingSchedule.filter(
      (v) => Number(v.releaseTime) * 1000 > Date.now()
    );
    if (future.length > 0) {
      nextReleaseTime = Number(future[0].releaseTime) * 1000;
    }
  }

  // --- Loading / Error States ---
  if (isLoading)
    return (
      <div className="border border-primary/10 p-5 rounded-xl flex items-center justify-center bg-card">
        <ClipLoader size={25} color="var(--primary)" />
      </div>
    );

  if (error) return <div>Error: {error.message}</div>;
  if (!data) return "";

  // --- Format values ---
  const unlockedPercent = Number(data.unlockedPercentage) / 100;
  const total = Number(formatEther(data.totalTokens || 0n));
  const claimed = Number(formatEther(data.claimed || 0n));
  const claimable = Number(formatEther(data.claimable || 0n));
  const locked = Number(formatEther(data.locked || 0n));

  return (
    <div className="border border-primary/10 p-5 rounded-xl backdrop-blur-xl relative overflow-hidden bg-card flex flex-col gap-4">
      <BorderEffect />
      <h2 className="text-lg font-semibold">🎁 Claim & Vesting Dashboard</h2>
      <p className="text-xs !text-primary capitalize">claim 20% each Week during 5 weeks Vesting periode</p>

      {/* Progress Bar */}
      <div className="w-full bg-white/10 rounded-lg h-3 overflow-hidden">
        <div
          className="bg-primary h-3 transition-all"
          style={{ width: `${unlockedPercent}%` }}
        />
      </div>
      <p className="text-xs text-neutral">Unlocked: {unlockedPercent.toFixed(2)}%</p>

      {/* Stats */}
      <div className="text-sm grid grid-cols-2 gap-2">
        <p>Total Purchased: <span className="!text-accent">{total.toFixed(3)} $WPAY</span></p>
        <p>Claimed: <span className="!text-accent">{claimed.toFixed(3)} $WPAY</span></p>
        <p>Claimable Now: <span className="!text-accent">{claimable.toFixed(3)} $WPAY</span></p>
        <p>Locked: <span className="!text-accent">{locked.toFixed(3)} $WPAY</span></p>
      </div>

      {/* Next unlock info */}
      {nextReleaseTime && (
        <div className="text-xs text-neutral">
          ⏳ Next Unlock:{" "}
          <span className="!text-accent">
            {new Date(nextReleaseTime).toLocaleString()} (
            {formatDistanceToNow(nextReleaseTime, { addSuffix: true })})
          </span>
        </div>
      )}

      {/* Claim button */}
      <ButtonPrimary onClick={handleClaim} disabled={claiming || claimable <= 0}>
        {claiming ? "Claiming..." : claimable > 0 ? "Claim Tokens" : "Nothing to Claim"}
      </ButtonPrimary>
    </div>
  );
}

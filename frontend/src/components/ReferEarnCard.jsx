import React, { useState, useEffect } from 'react';
import { Share2, Copy, Check, Gift } from 'lucide-react';
import { Card } from './CommonUI';
import { referralAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const ReferEarnCard = ({ referralMeta }) => {
  const { user, isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralData, setReferralData] = useState({
    code: user?.referralCode || 'FEEDANTS10',
    url: `${referralMeta?.baseUrl || 'https://feedants.com/compete/feedants-classical-dance?ref='}${user?.referralCode || 'FEEDANTS10'}`,
    rewardPerSignup: referralMeta?.rewardPerSignup || 10,
    totalEarned: user?.referralEarnings || 0,
  });

  useEffect(() => {
    if (isAuthenticated) {
      referralAPI
        .getMe()
        .then((res) => {
          if (res?.data) {
            setReferralData(res.data);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, user]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralData.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const shareText = `Hey! Join the Feedants Classical Dance Competition and showcase your talent. Use my referral link: ${referralData.url}`;
    if (navigator.share) {
      navigator.share({
        title: 'Feedants Classical Dance Competition',
        text: shareText,
        url: referralData.url,
      }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  return (
    <Card className="bg-gradient-to-br from-cyan-900 via-teal-900 to-slate-900 text-white space-y-3.5 border-none shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-sm shadow-xs">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Refer & Earn ₹{referralData.rewardPerSignup}</h3>
            <p className="text-[11px] text-cyan-200">Per friend who signs up with your link</p>
          </div>
        </div>

        {isAuthenticated && referralData.totalEarned > 0 && (
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-cyan-300 block">Total Earned</span>
            <span className="text-sm font-black text-amber-300">₹{referralData.totalEarned}</span>
          </div>
        )}
      </div>

      {/* Referral Link & Copy Input */}
      <div className="bg-black/30 backdrop-blur-md rounded-xl p-1.5 flex items-center gap-1.5 border border-white/10">
        <input
          type="text"
          readOnly
          value={referralData.url}
          className="bg-transparent text-xs text-cyan-100 flex-1 px-2.5 py-1 focus:outline-none truncate font-mono"
        />
        <button
          onClick={handleCopy}
          className="bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Refer Now CTA Button */}
      <button
        onClick={handleShare}
        className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-98 transition-all text-amber-950 font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>Refer Friends Now</span>
      </button>
    </Card>
  );
};

'use client';

import { useState } from 'react';

interface GovernanceProps {
  isConnected: boolean;
  walletAddress: string;
  userBalance: number;
}

export default function Governance({ isConnected, walletAddress, userBalance }: GovernanceProps) {
  const [loadingPublish, setLoadingPublish] = useState<number | null>(null);
  const [votingId, setVotingId] = useState<number | null>(null);
  
  const [proposals, setProposals] = useState([
    {
      id: 1,
      title: "Integrate ZNTC with Base AI Agents",
      votesA: 150000,
      votesB: 2000,
      isPublished: false,
      status: "Active"
    },
    {
      id: 2,
      title: "Global AI Awareness Campaign",
      votesA: 85000,
      votesB: 500,
      isPublished: false,
      status: "Active"
    }
  ]);

  // FUNGSI UNTUK USER MELAKUKAN VOTE
  const handleUserVote = async (proposalId: number, type: 'YES' | 'NO') => {
    if (!isConnected) {
      alert("Please connect your wallet to vote.");
      return;
    }
    
    setVotingId(proposalId);
    // Simulasi on-chain logic: Menambahkan power berdasarkan balance user
    setTimeout(() => {
      setProposals(prev => prev.map(p => {
        if (p.id === proposalId) {
          return {
            ...p,
            votesA: type === 'YES' ? p.votesA + userBalance : p.votesA,
            votesB: type === 'NO' ? p.votesB + userBalance : p.votesB
          };
        }
        return p;
      }));
      setVotingId(null);
      alert(`Success! You voted ${type} with ${userBalance.toLocaleString()} $ZNTC power.`);
    }, 800);
  };

  const triggerSocialPost = async (proposalId: number) => {
    if (!isConnected || !walletAddress) {
      alert("Safety Alert: Please connect your wallet first.");
      return;
    }

    const ADMIN_WALLET = "0x553E1479999432aBF4D7c4aD613faac6b62Fcb5b";
    if (walletAddress.toLowerCase() !== ADMIN_WALLET.toLowerCase()) {
      alert("Critical Security: Only ZYNETHIC Global AI Admin can execute this.");
      return;
    }

    const proposal = proposals.find((p) => p.id === proposalId);
    if (!proposal) return;

    setLoadingPublish(proposalId);

    try {
      const totalVotes = proposal.votesA + proposal.votesB;
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalTitle: proposal.title,
          resultA: ((proposal.votesA / totalVotes) * 100).toFixed(1),
          resultB: ((proposal.votesB / totalVotes) * 100).toFixed(1),
          totalVotes: totalVotes,
          adminAddress: walletAddress 
        }),
      });

      if (res.ok) {
        setProposals((prev) => prev.map((p) => 
          p.id === proposalId ? { ...p, isPublished: true } : p
        ));
        alert("Success! Global AI Community Announcement posted to @zynethic.");
      } else {
        const errorData = await res.json();
        alert(`Security Block: ${errorData.error}`);
      }
    } catch {
      alert("Connection Error.");
    } finally {
      setLoadingPublish(null);
    }
  };

  return (
    <div className="grid-container">
      {proposals.map((proposal) => (
        <div key={proposal.id} className="card">
          <div className="status-pill">{proposal.status}</div>
          <h3>{proposal.title}</h3>
          
          <div style={{ marginTop: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '5px' }}>
              <span>YES: {proposal.votesA.toLocaleString()}</span>
              <span>NO: {proposal.votesB.toLocaleString()}</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${(proposal.votesA / (proposal.votesA + proposal.votesB)) * 100}%`, 
                height: '100%', 
                background: 'var(--base-glow)' 
              }}></div>
            </div>
          </div>

          {/* TOMBOL VOTE UNTUK USER */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button 
              onClick={() => handleUserVote(proposal.id, 'YES')}
              disabled={votingId === proposal.id}
              style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid var(--base-glow)', background: 'transparent', color: 'var(--base-glow)', cursor: 'pointer', fontWeight: 800, fontSize: '0.7rem' }}
            >
              VOTE YES
            </button>
            <button 
              onClick={() => handleUserVote(proposal.id, 'NO')}
              disabled={votingId === proposal.id}
              style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #ff4d4d', background: 'transparent', color: '#ff4d4d', cursor: 'pointer', fontWeight: 800, fontSize: '0.7rem' }}
            >
              VOTE NO
            </button>
          </div>
          
          {/* TOMBOL KHUSUS ADMIN (Hanya muncul untuk Anda) */}
          {walletAddress.toLowerCase() === "0x553E1479999432aBF4D7c4aD613faac6b62Fcb5b".toLowerCase() && (
            <button 
              className="btn-primary" 
              style={{ marginTop: '12px', width: '100%', fontSize: '0.7rem', background: '#fff', color: '#000' }}
              onClick={() => triggerSocialPost(proposal.id)}
              disabled={loadingPublish === proposal.id || proposal.isPublished}
            >
              {proposal.isPublished ? 'ANNOUNCED TO X' : loadingPublish === proposal.id ? 'PUBLISHING...' : 'ADMIN: PUBLISH RESULT'}
            </button>
          )}

          {!isConnected && (
            <div className="locked-overlay" style={{ borderRadius: '20px' }}>
              <p style={{ fontSize: '0.8rem' }}>CONNECT WALLET TO VOTE</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

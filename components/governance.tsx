'use client';

import { useState } from 'react';
import { useSignMessage } from 'wagmi';
import styles from './governance.module.css';

interface GovernanceProps {
  isConnected: boolean;
  walletAddress: string;
  userBalance: number;
}

export default function Governance({ isConnected, walletAddress, userBalance }: GovernanceProps) {
  const [loadingPublish, setLoadingPublish] = useState<number | null>(null);
  const [votingId, setVotingId] = useState<number | null>(null);
  const { signMessageAsync } = useSignMessage();

  const [proposals, setProposals] = useState([
    {
      id: 1,
      title: 'Integrate ZNTC with Base AI Agents',
      votesA: 150000,
      votesB: 2000,
      isPublished: false,
      status: 'Active',
    },
    {
      id: 2,
      title: 'Global AI Awareness Campaign',
      votesA: 85000,
      votesB: 500,
      isPublished: false,
      status: 'Active',
    },
  ]);

  const handleUserVote = async (proposalId: number, type: 'YES' | 'NO') => {
    if (!isConnected) {
      alert('Please connect your wallet to vote.');
      return;
    }

    setVotingId(proposalId);
    setTimeout(() => {
      setProposals((prev) =>
        prev.map((p) => {
          if (p.id === proposalId) {
            return {
              ...p,
              votesA: type === 'YES' ? p.votesA + userBalance : p.votesA,
              votesB: type === 'NO' ? p.votesB + userBalance : p.votesB,
            };
          }
          return p;
        })
      );
      setVotingId(null);
      alert(`Success! You voted ${type} with ${userBalance.toLocaleString()} $ZNTC power.`);
    }, 800);
  };

  const triggerSocialPost = async (proposalId: number) => {
    if (!isConnected || !walletAddress) {
      alert('Safety Alert: Please connect your wallet first.');
      return;
    }

    const ADMIN_WALLET = '0x553E1479999432aBF4D7c4aD613faac6b62Fcb5b';
    if (walletAddress.toLowerCase() !== ADMIN_WALLET.toLowerCase()) {
      alert('Critical Security: Only ZYNETHIC Global AI Admin can execute this.');
      return;
    }

    const proposal = proposals.find((p) => p.id === proposalId);
    if (!proposal) return;

    setLoadingPublish(proposalId);

    try {
      const totalVotes = proposal.votesA + proposal.votesB;
      const resultA = totalVotes > 0 ? ((proposal.votesA / totalVotes) * 100).toFixed(1) : '0.0';
      const resultB = totalVotes > 0 ? ((proposal.votesB / totalVotes) * 100).toFixed(1) : '0.0';

      const message = `ZYNETHIC Governance Announcement Authorization:\nProposal ID: ${proposal.id}\nTimestamp: ${Date.now()}`;
      const signature = await signMessageAsync({ message });

      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalTitle: proposal.title,
          resultA,
          resultB,
          totalVotes,
          adminAddress: walletAddress,
          signature,
          message,
        }),
      });

      if (res.ok) {
        setProposals((prev) =>
          prev.map((p) => (p.id === proposalId ? { ...p, isPublished: true } : p))
        );
        alert('Success! Global AI Community Announcement posted to @zynethic.');
      } else {
        const errorData = await res.json();
        alert(`Security Block: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Publish error:', err);
      alert('Connection Error or Signature Rejected.');
    } finally {
      setLoadingPublish(null);
    }
  };

  return (
    <div className="grid-container">
      {proposals.map((proposal) => {
        const totalVotes = proposal.votesA + proposal.votesB;
        const percentA = totalVotes > 0 ? (proposal.votesA / totalVotes) * 100 : 0;

        return (
          <div key={proposal.id} className="card">
            <div className="status-pill">{proposal.status}</div>
            <h3>{proposal.title}</h3>

            <div className={styles.voteContainer}>
              <div className={styles.voteStats}>
                <span>YES: {proposal.votesA.toLocaleString()}</span>
                <span>NO: {proposal.votesB.toLocaleString()}</span>
              </div>
              <div className={styles.progressBarBg}>
                <div className={styles.progressBarFill} style={{ width: `${percentA}%` }}></div>
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button
                onClick={() => handleUserVote(proposal.id, 'YES')}
                disabled={votingId === proposal.id}
                className={styles.btnVoteYes}
              >
                VOTE YES
              </button>
              <button
                onClick={() => handleUserVote(proposal.id, 'NO')}
                disabled={votingId === proposal.id}
                className={styles.btnVoteNo}
              >
                VOTE NO
              </button>
            </div>

            {walletAddress.toLowerCase() === '0x553e1479999432abf4d7c4ad613faac6b62fcb5b' && (
              <button
                className={`btn-primary ${styles.btnAdminPublish}`}
                onClick={() => triggerSocialPost(proposal.id)}
                disabled={loadingPublish === proposal.id || proposal.isPublished}
              >
                {proposal.isPublished
                  ? 'ANNOUNCED TO X'
                  : loadingPublish === proposal.id
                  ? 'PUBLISHING...'
                  : 'ADMIN: PUBLISH RESULT'}
              </button>
            )}

            {!isConnected && (
              <div className="locked-overlay" style={{ borderRadius: '20px' }}>
                <p>CONNECT WALLET TO VOTE</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

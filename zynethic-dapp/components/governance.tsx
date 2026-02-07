const triggerSocialPost = async (proposalId: number) => {
  // LAPIS 1: Verifikasi apakah dompet terkoneksi
  if (!isConnected || !walletAddress) {
    alert("Safety Alert: Please connect your wallet first.");
    return;
  }

  // LAPIS 2: Verifikasi Alamat Admin Secara Eksplisit (Hardcoded Check)
  // Menggunakan alamat dari data tokenomics Anda
  const ADMIN_WALLET = "0x553E1479999432aBF4D7c4aD613faac6b62Fcb5b";
  if (walletAddress.toLowerCase() !== ADMIN_WALLET.toLowerCase()) {
    console.error("Unauthorized attempt blocked.");
    alert("Critical Security: Only ZYNETHIC Global AI Admin can execute this.");
    return;
  }

  const proposal = proposals.find((p) => p.id === proposalId);
  if (!proposal) return;

  setLoadingPublish(proposalId);

  try {
    const totalVotes = proposal.votesA + proposal.votesB;
    
    // LAPIS 3: Mengirimkan Address Admin ke Backend untuk Verifikasi Ulang
    const res = await fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        proposalTitle: proposal.title,
        resultA: ((proposal.votesA / totalVotes) * 100).toFixed(1),
        resultB: ((proposal.votesB / totalVotes) * 100).toFixed(1),
        totalVotes: totalVotes,
        adminAddress: walletAddress // Dikirim untuk divalidasi server
      }),
    });

    if (res.ok) {
      setProposals((prev) => prev.map((p) => 
        p.id === proposalId ? { ...p, isPublished: true } : p
      ));
      alert("Success! Global AI Community Announcement posted to @zynethic.");
    } else {
      const errorData = await res.json();
      alert(`Security Block: ${errorData.error || 'Request rejected by server'}`);
    }
  } catch (err) {
    console.error("Critical System Error:", err);
    alert("Connection Error: System secured.");
  } finally {
    setLoadingPublish(null);
  }
};

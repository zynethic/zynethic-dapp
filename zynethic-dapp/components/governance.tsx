const triggerSocialPost = async (proposalId: number) => {
  const proposal = proposals.find(p => p.id === proposalId);
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
        totalVotes: totalVotes
      }),
    });

    if (res.ok) {
      setProposals(prev => prev.map(p => 
        p.id === proposalId ? { ...p, isPublished: true } : p
      ));
      alert("Success! Announcement posted to @zynethic.");
    } else {
      const errorData = await res.json();
      alert(`Error: ${errorData.error}`);
    }
  } catch (e) {
    alert("Connection failed. Check your Vercel deployment logs.");
  } finally {
    setLoadingPublish(null);
  }
};

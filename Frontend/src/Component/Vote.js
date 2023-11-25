// Vote.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Vote = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Candidate 1' },
    { id: 2, name: 'Candidate 2' },
    { id: 3, name: 'Candidate 3' },
  ]);

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [candidateVotes, setCandidateVotes] = useState([]);

  useEffect(() => {
    const fetchCandidateVotes = async () => {
      try {
        const response = await axios.get('http://localhost:5555/vote');
        setCandidateVotes(response.data.data);
      } catch (error) {
        console.error('Error fetching candidate votes:', error);
      }
    };

    fetchCandidateVotes();
  }, [hasVoted]);

  const getVoteCount = (candidateId) => {
    const candidateVote = candidateVotes.find((vote) => vote.candidate === candidateId);
    return candidateVote ? candidateVote.count : 0;
  };

  const handleVote = async () => {
    if (selectedCandidate === null) {
      alert('Please select a candidate before voting.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5555/vote');
      const votedCandidates = response.data.data.map((vote) => vote.candidate);

      if (votedCandidates.includes(selectedCandidate)) {
        alert('You already voted for this candidate.');
        return;
      }

      await axios.post('http://localhost:5555/vote', {
        voterId: 'uniqueVoterId',
        selectedCandidate: selectedCandidate,
      });

      setHasVoted(true);
      localStorage.setItem('hasVoted', 'true');
    } catch (error) {
      console.error('Error recording vote:', error);
      alert('Error recording vote. Please try again.');
    }
  };

  const handleCandidateChange = (candidateId) => {
    if (!hasVoted) {
      setSelectedCandidate(candidateId);
    } else {
      alert('You already voted. Cannot change your vote.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hasVoted');
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-96 p-6 bg-gray-200 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Candidates:</h2>
        <ul>
          {candidates.map((candidate) => (
            <li key={candidate.id} className="mb-2">
              <input
                type="radio"
                id={`candidate-${candidate.id}`}
                name="candidates"
                value={candidate.id}
                onChange={() => handleCandidateChange(candidate.id)}
                checked={selectedCandidate === candidate.id}
                disabled={hasVoted}
              />
              <label htmlFor={`candidate-${candidate.id}`} className="ml-2">
                {candidate.name} ({getVoteCount(candidate.id)} votes)
              </label>
            </li>
          ))}
        </ul>

        <button
          onClick={handleVote}
          disabled={hasVoted}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 mr-2"
        >
          Vote
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded mt-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Vote;

import React, { useEffect, useState } from 'react';
import { pollAPI } from '../services/api';
import { Link } from 'react-router-dom';

export default function Polls() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    pollAPI.list().then(res => setPolls(res.data)).catch(console.error);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Polls</h2>
      <Link to="/polls/create">Create Poll</Link>
      <ul>
        {polls.map(p => (
          <li key={p._id}>
            <Link to={`/polls/${p._id}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

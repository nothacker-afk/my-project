import React, { useEffect, useState } from 'react';
import { pollAPI } from '../services/api';
import { useParams } from 'react-router-dom';

export default function PollDetail(){
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(()=>{ pollAPI.get(id).then(r=>setPoll(r.data)).catch(console.error); },[id]);

  const vote = async () =>{
    if (selected == null) return;
    await pollAPI.vote(id, { optionIndex: selected });
    const r = await pollAPI.get(id);
    setPoll(r.data);
  }

  if (!poll) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{poll.title}</h2>
      <p>{poll.description}</p>
      <ul>
        {poll.options.map((opt, idx)=>(
          <li key={idx}>
            <label>
              <input type="radio" name="opt" onChange={()=>setSelected(idx)} /> {opt.text} — {opt.votes}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={vote}>Vote</button>
    </div>
  )
}

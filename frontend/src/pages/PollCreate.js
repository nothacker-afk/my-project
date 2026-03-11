import React, { useState } from 'react';
import { pollAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function PollCreate(){
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['','']);
  const navigate = useNavigate();

  const addOption = () => setOptions([...options, '']);
  const updateOption = (i, val) => setOptions(options.map((o, idx)=> idx===i?val:o));

  const submit = async (e) =>{
    e.preventDefault();
    await pollAPI.create({ title, options: options.filter(o=>o.trim()) });
    navigate('/polls');
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Poll</h2>
      <form onSubmit={submit}>
        <div>
          <label>Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Options</label>
          {options.map((opt,i)=>(
            <div key={i}>
              <input value={opt} onChange={e=>updateOption(i,e.target.value)} required/>
            </div>
          ))}
          <button type="button" onClick={addOption}>Add option</button>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

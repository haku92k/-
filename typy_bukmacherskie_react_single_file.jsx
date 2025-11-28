/**
  Plik: TypyBukmacherskie-MeczykiTab.jsx
  Opis: Zakładka "Typy" w stylu Meczyki.pl z ciemnym motywem, estetyczna, z możliwością komentarzy
*/

import React, { useEffect, useMemo, useState } from 'react';

const todayISO = () => new Date().toISOString().slice(0, 10);
const tomorrowISO = () => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0,10); };
const LOCAL_KEY = 'meczyki_types_v2';
const SAMPLE = [
  { id: '1', league: 'Premier League', match: 'Liverpool - Chelsea', time: '20:45', date: todayISO(), tip: 'Over 2.5', odd: '1.85', analysis: 'Dwie ofensywne drużyny, dużo bramek', author: 'Admin', plus: 12, minus: 2, state: 'pending', comments: [] },
  { id: '2', league: 'LaLiga', match: 'Real Madrid - Barcelona', time: '18:00', date: tomorrowISO(), tip: 'Real win', odd: '2.10', analysis: 'Forma Realu lepsza ostatnio', author: 'Mateusz', plus: 8, minus: 3, state: 'pending', comments: [] }
];

export default function App() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('today');
  const [adminMode, setAdminMode] = useState(true);
  const [form, setForm] = useState({ league: '', match: '', date: todayISO(), time: '20:00', tip: '', odd: '', analysis: '', author: '' });

  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    if(raw) setItems(JSON.parse(raw));
    else setItems(SAMPLE);
  }, []);

  useEffect(() => { localStorage.setItem(LOCAL_KEY, JSON.stringify(items)); }, [items]);

  function addTip(e) { e?.preventDefault(); if(!form.match||!form.tip) return alert('Uzupełnij mecz i typ');
    const id = Date.now().toString();
    setItems([{...form,id,plus:0,minus:0,state:'pending',comments:[]}, ...items]);
    setForm({ league: '', match: '', date: todayISO(), time: '20:00', tip: '', odd: '', analysis: '', author: '' });
  }

  function vote(id,type){ setItems(items.map(it=> it.id===id ? {...it,[type==='plus'?'plus':'minus']: it[type==='plus'?'plus':'minus']+1} : it)); }
  function changeState(id,newState){ setItems(items.map(it=> it.id===id?{...it,state:newState}:it)); }
  function addComment(id,text){ if(!text.trim()) return; setItems(items.map(it=> it.id===id ? {...it, comments:[...it.comments,text]}:it)); }

  const filtered = useMemo(()=>{
    let res = [...items];
    if(filter==='today') res=res.filter(i=>i.date===todayISO());
    if(filter==='tomorrow') res=res.filter(i=>i.date===tomorrowISO());
    if(filter==='popular') res=res.filter(i=>i.plus-i.minus>=3);
    return res;
  },[items,filter]);

  return (
    <div className='min-h-screen bg-black text-white p-6 font-sans'>
      <div className='max-w-4xl mx-auto'>
        <header className='mb-4'>
          <h1 className='text-3xl font-bold mb-1'>Zakładka: Typy</h1>
          <p className='text-gray-400 text-sm'>Lista typów w stylu Meczyki.pl — ciemny motyw.</p>
        </header>

        <section className='mb-4 flex gap-3'>
          <button onClick={()=>setFilter('today')} className={`px-4 py-2 rounded ${filter==='today'?'bg-blue-600':'bg-gray-800'}`}>Dzisiaj</button>
          <button onClick={()=>setFilter('tomorrow')} className={`px-4 py-2 rounded ${filter==='tomorrow'?'bg-blue-600':'bg-gray-800'}`}>Jutro</button>
          <button onClick={()=>setFilter('all')} className={`px-4 py-2 rounded ${filter==='all'?'bg-blue-600':'bg-gray-800'}`}>Wszystkie</button>
          <button onClick={()=>setFilter('popular')} className={`px-4 py-2 rounded ${filter==='popular'?'bg-blue-600':'bg-gray-800'}`}>Popularne</button>
          <label className='ml-auto flex items-center gap-1 text-sm'><input type='checkbox' checked={adminMode} onChange={e=>setAdminMode(e.target.checked)}/> Admin</label>
        </section>

        {adminMode && <section className='mb-6 bg-gray-900 p-4 rounded-2xl shadow-md space-y-2'>
          <h2 className='font-semibold mb-2'>Dodaj typ (Admin)</h2>
          <form onSubmit={addTip} className='grid gap-2'>
            <div className='flex gap-2'>
              <input className='flex-1 p-2 rounded bg-gray-800 border border-gray-700' placeholder='Liga' value={form.league} onChange={e=>setForm({...form,league:e.target.value})}/>
              <input type='date' className='w-44 p-2 rounded bg-gray-800 border border-gray-700' value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>
              <input type='time' className='w-28 p-2 rounded bg-gray-800 border border-gray-700' value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/>
            </div>
            <input className='p-2 rounded bg-gray-800 border border-gray-700' placeholder='Mecz' value={form.match} onChange={e=>setForm({...form,match:e.target.value})}/>
            <div className='flex gap-2'>
              <input className='flex-1 p-2 rounded bg-gray-800 border border-gray-700' placeholder='Typ' value={form.tip} onChange={e=>setForm({...form,tip:e.target.value})}/>
              <input className='w-32 p-2 rounded bg-gray-800 border border-gray-700' placeholder='Kurs' value={form.odd} onChange={e=>setForm({...form,odd:e.target.value})}/>
              <input className='w-40 p-2 rounded bg-gray-800 border border-gray-700' placeholder='Autor' value={form.author} onChange={e=>setForm({...form,author:e.target.value})}/>
            </div>
            <textarea className='p-2 rounded bg-gray-800 border border-gray-700' placeholder='Analiza' value={form.analysis} onChange={e=>setForm({...form,analysis:e.target.value})}/>
            <button type='submit' className='w-full py-2 mt-2 rounded-xl bg-green-600 font-semibold hover:bg-green-700'>Dodaj typ</button>
          </form>
        </section>}

        <main className='space-y-3'>
          {filtered.map(it=> <article key={it.id} className='bg-gray-800 p-4 rounded-2xl shadow flex gap-4'>
            <div className='w-56 flex flex-col text-sm'>
              <div className='font-semibold'>{it.league}</div>
              <div className='text-gray-400 text-xs'>{it.date} {it.time}</div>
              <div className='mt-2 text-sm'>Autor: <span className='font-medium'>{it.author}</span></div>
            </div>
            <div className='flex-1'>
              <div className='flex justify-between items-baseline'>
                <h3 className='text-lg font-semibold'>{it.match}</h3>
                <div className='text-sm'>Kurs: <span className='font-semibold'>{it.odd}</span></div>
              </div>
              <div className='mt-1 text-green-400 font-medium'>Typ: {it.tip}</div>
              <p className='mt-2 text-gray-300'>{it.analysis}</p>
              <div className='flex gap-2 mt-2'>
                <button onClick={()=>vote(it.id,'plus')} className='px-3 py-1 rounded bg-gray-700'>+ {it.plus}</button>
                <button onClick={()=>vote(it.id,'minus')} className='px-3 py-1 rounded bg-gray-700'>- {it.minus}</button>
              </div>
              <div className='mt-3 bg-gray-900 p-3 rounded-xl'>
                <h4 className='font-semibold mb-2'>Komentarze</h4>
                <div className='space-y-2 mb-2'>
                  {it.comments.map((c,i)=><div key={i} className='bg-gray-800 p-2 rounded'>{c}</div>)}
                </div>
                <AddComment onSend={txt=>addComment(it.id,txt)}/>
              </div>
            </div>
          </article>)}
        </main>
      </div>
    </div>
  );
}

function AddComment({onSend}){
  const [text,setText]=useState('');
  return <div className='flex gap-2 mt-2'>
    <input className='flex-1 p-2 rounded bg-gray-700' placeholder='Dodaj komentarz...' value={text} onChange={e=>setText(e.target.value)}/>
    <button className='bg-blue-600 px-4 rounded-xl' onClick={()=>{onSend(text); setText('');}}>OK</button>
  </div>;
}

'use client';
import React,{forwardRef,useId,useState} from 'react';
import {type Activity} from '../lib/memory';
import {Clock3,icons,type LucideIcon} from 'lucide-react';
type Props=Omit<React.InputHTMLAttributes<HTMLInputElement>,'value'|'onChange'> & {value:string;activities:Activity[];onChange:(value:string)=>void;onPick?:(activity:Activity)=>void};
const ActivityInput=forwardRef<HTMLInputElement,Props>(function ActivityInput({value,activities,onChange,onPick,onKeyDown,onFocus,onBlur,...props},ref){
 const [open,Open]=useState(false),[index,Index]=useState(0);const id=useId();const matches=activities.filter(a=>!value.trim()||a.name.toLowerCase().includes(value.trim().toLowerCase())).slice(0,6);const shown=open&&matches.length>0;
 function choose(a:Activity){onChange(a.name);onPick?.(a);Open(false)}
 return <div className="activity-autocomplete"><input {...props} ref={ref} value={value} autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded={!!shown} aria-controls={id} aria-activedescendant={shown?`${id}-${Math.min(index,matches.length-1)}`:undefined} onChange={e=>{onChange(e.target.value);Index(0);Open(true)}} onFocus={e=>{Open(true);onFocus?.(e)}} onBlur={e=>{Open(false);onBlur?.(e)}} onKeyDown={e=>{if(shown&&['ArrowDown','ArrowUp','Enter','Tab','Escape'].includes(e.key)){if(e.key==='Escape'){e.preventDefault();e.stopPropagation();Open(false);return}if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();Index((index+(e.key==='ArrowDown'?1:-1)+matches.length)%matches.length);return}if(e.key==='Enter'||e.key==='Tab'){if(e.key==='Enter')e.preventDefault();choose(matches[Math.min(index,matches.length-1)]);return}}onKeyDown?.(e)}}/>{shown&&<div className="activity-completions" id={id} role="listbox">{matches.map((a,i)=>{const C=(icons as Record<string,LucideIcon>)[a.icon]||Clock3;return <button type="button" role="option" id={`${id}-${i}`} aria-selected={index===i} key={a.id} className={index===i?'highlighted':''} onPointerDown={e=>e.preventDefault()} onClick={()=>choose(a)} onPointerMove={()=>Index(i)}><C size={16}/><span>{a.name}</span>{i===index&&<small>Tab</small>}</button>})}</div>}</div>
});
export default ActivityInput;

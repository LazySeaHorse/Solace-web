import {type Data,type Entry} from './memory.ts';
export function mergeActivities(data:Data,sourceId:string,targetId:string):Data{
 const target=data.activities?.find(a=>a.id===targetId);if(sourceId===targetId||!target)return data;
 return {...data,activities:data.activities?.filter(a=>a.id!==sourceId),entries:data.entries.map(e=>e.activityId===sourceId?{...e,activityId:target.id,title:target.name,icon:target.icon}:e),timer:data.timer?{...data.timer,tasks:data.timer.tasks?.map(t=>(t.activityId||t.id)===sourceId?{...t,activityId:target.id,title:target.name,icon:target.icon}:t)}:null};
}
export function saveJournalEntry(data:Data,input:Entry):Data{
 const title=input.title.trim();let next=data;let entry={...input,title};const old=data.entries.find(e=>e.id===input.id);
 if(!title)entry.activityId=undefined;
 else{
  const match=data.activities?.find(a=>a.name.toLowerCase()===title.toLowerCase());
  if(match&&old?.activityId&&old.activityId!==match.id)next=mergeActivities(data,old.activityId,match.id);
  const id=match?.id||old?.activityId||input.activityId||`activity:${input.id}`;
  const activity={id,name:title,icon:match?.icon||input.icon};
  next={...next,activities:[...(next.activities||[]).filter(a=>a.id!==id),activity],entries:next.entries.map(e=>e.activityId===id?{...e,title,icon:activity.icon}:e),timer:next.timer?{...next.timer,tasks:next.timer.tasks?.map(t=>(t.activityId||t.id)===id?{...t,title,icon:activity.icon}:t)}:null};
  entry={...entry,activityId:id,icon:activity.icon};
 }
 return {...next,entries:[...next.entries.filter(e=>e.id!==entry.id),entry]};
}
export function mergeTimelineEntries(entries:Entry[],ids:string[],id:string):Entry|null{
 const rows=entries.filter(e=>ids.includes(e.id)).sort((a,b)=>a.start-b.start||a.id.localeCompare(b.id));
 if(rows.length<2||rows.some(e=>e.date!==rows[0].date))return null;
 return {...rows[0],id,activityId:undefined,start:Math.min(...rows.map(e=>e.start)),end:Math.max(...rows.map(e=>e.end)),notes:[...new Set(rows.map(e=>e.notes.trim()).filter(Boolean))].join('\n\n')};
}
export function setTimerTaskActivity(data:Data,taskId:string,name:string):Data{
 const timer=data.timer,task=timer?.tasks?.find(t=>t.id===taskId);if(!timer||!task)return data;
 const title=name.trim(),known=data.activities?.find(a=>a.name.toLowerCase()===title.toLowerCase());
 const activity=known||{id:`activity:${task.id}:${title.toLowerCase()}`,name:title,icon:task.icon};
 const oldId=task.activityId||task.id;
 return {...data,activities:title&&!known?[...(data.activities||[]),activity]:data.activities,entries:data.entries.map(e=>{const day=new Date(e.date+'T00:00:00').getTime();return e.activityId===oldId&&day+e.start*60000>=timer.startedAt-.01?{...e,title:known?.name||title,icon:activity.icon,activityId:title?activity.id:undefined}:e}),timer:{...timer,tasks:timer.tasks?.map(t=>t.id===taskId?{...t,title:known?.name||title,icon:activity.icon,activityId:title?activity.id:undefined}:t)}};
}

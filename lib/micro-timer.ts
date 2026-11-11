import {type Timer,type MicroTask,type Entry,uid,dateKey} from './memory.ts';
export function prepareTimer(timer:Timer):Timer & {tasks:MicroTask[];activeId:string;segmentStartedAt:number}{
 if(timer.tasks?.length&&timer.tasks.some(t=>t.id===timer.activeId)&&Number.isFinite(timer.segmentStartedAt))return timer as Timer & {tasks:MicroTask[];activeId:string;segmentStartedAt:number};
 const task:MicroTask={id:uid(),title:timer.title,category:timer.category,icon:timer.icon,rating:'unrated'};
 return {...timer,tasks:[task],activeId:task.id,segmentStartedAt:timer.startedAt};
}
export function closeSegment(timer:Timer,at:number):Entry[]{
 const t=prepareTimer(timer),task=t.tasks.find(x=>x.id===t.activeId)!;let cursor=t.segmentStartedAt;const rows:Entry[]=[];
 while(cursor<at){const d=new Date(cursor),midnight=new Date(d);midnight.setHours(24,0,0,0);const until=Math.min(at,midnight.getTime());
 const minutes=(v:Date)=>v.getHours()*60+v.getMinutes()+v.getSeconds()/60+v.getMilliseconds()/60000;
 const start=minutes(d),end=until===midnight.getTime()?1440:minutes(new Date(until));
 if(until-cursor>=60000&&end>start)rows.push({id:uid(),activityId:task.activityId||task.id,title:task.title,category:task.category,icon:task.icon,rating:task.category==='productive'?'worthwhile':task.category==='distraction'?'wasted':'unrated',date:dateKey(d),start,end,type:'actual',notes:''});cursor=until;
 }return rows;
}
export function switchTask(timer:Timer,task:MicroTask,at:number){const t=prepareTimer(timer);if(task.id===t.activeId&&task.category===t.tasks.find(x=>x.id===t.activeId)?.category)return {timer:t,entries:[] as Entry[]};
 return {entries:closeSegment(t,at),timer:{...t,tasks:t.tasks.some(x=>x.id===task.id)?t.tasks.map(x=>x.id===task.id?task:x):[...t.tasks,task],activeId:task.id,segmentStartedAt:at}};
}
export function renameActivity(entries:Entry[],timer:Timer|null,id:string,title:string,match?:Entry){
 const activityId=match?(match.activityId||`activity:${match.id}`):id;
 const patch={title,activityId,...(match?{icon:match.icon}: {})};
 return {entries:entries.map(e=>e.activityId===id?{...e,...patch}:match&&!e.activityId&&e.title.toLowerCase()===match.title.toLowerCase()?{...e,activityId}:e),timer:timer?.tasks?{...timer,activeId:timer.activeId===id?activityId:timer.activeId,tasks:timer.tasks.map(t=>(t.activityId||t.id)===id?{...t,...patch,id:t.activityId?t.id:activityId}:t).filter((t,i,a)=>a.findIndex(x=>x.id===t.id)===i)}:timer};
}
export function elapsedClock(ms:number){const s=Math.max(0,Math.floor(ms/1000));return `${Math.floor(s/3600)?String(Math.floor(s/3600)).padStart(2,'0')+':':''}${String(Math.floor(s/60)%60).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}

import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareTimer,closeSegment,switchTask,renameActivity} from '../lib/micro-timer.ts';
import {CATS,validData,type MicroTask} from '../lib/memory.ts';
const start=new Date(2026,10,7,10,0,0).getTime();
const timer=()=>prepareTimer({title:'Study',icon:'BookOpen',category:'productive',startedAt:start});
const task:MicroTask={id:'second',title:'Task 2',category:'productive',icon:'Sprout',rating:'unrated'};
test('switches partition time exactly, including return visits',()=>{
 const t=timer();const a=switchTask(t,task,start+125000);const b=switchTask(a.timer,t.tasks[0],start+197500);const entries=[...a.entries,...b.entries,...closeSegment(b.timer,start+270000)];
 assert.equal(entries.length,3);assert.equal(entries[0].end,entries[1].start);assert.equal(entries[1].end,entries[2].start);assert.ok(Math.abs(entries.reduce((n,e)=>n+e.end-e.start,0)-270/60)<1e-9);assert.equal(entries[0].activityId,entries[2].activityId);
 assert.ok(validData({version:1,categories:CATS,entries,timer:b.timer}));
});
test('clicking selected task does not split its segment',()=>{const t=timer();const next=switchTask(t,t.tasks[0],start+1000);assert.equal(next.entries.length,0);assert.equal(next.timer.segmentStartedAt,start)});
test('reload retains current task, task identities and start timestamp',()=>{const t=switchTask(timer(),task,start+5000).timer;assert.deepEqual(prepareTimer(JSON.parse(JSON.stringify(t))),t)});
test('legacy running timer upgrades without changing elapsed time',()=>{const t=timer();assert.equal(t.segmentStartedAt,start);assert.equal(t.tasks[0].title,'Study')});
test('midnight split discards the short fragment and keeps the full minute',()=>{const s=new Date(2026,10,7,23,59,30).getTime();const rows=closeSegment(prepareTimer({title:'Study',icon:'BookOpen',category:'productive',startedAt:s}),s+90000);assert.equal(rows.length,1);assert.equal(rows[0].start,0);assert.equal(rows[0].end,1);assert.equal(rows[0].date,'2026-11-08')});
test('rename changes linked segments and active task, but keeps times',()=>{const t=timer(),a=switchTask(t,task,start+65000),b=switchTask(a.timer,t.tasks[0],start+130000);const rows=[...a.entries,...b.entries,...closeSegment(b.timer,start+195000)];const r=renameActivity(rows,b.timer,t.activeId,'Calculus');assert.deepEqual(r.entries.map(e=>e.title),['Calculus','Task 2','Calculus']);assert.equal(r.timer!.tasks![0].title,'Calculus');assert.deepEqual(r.entries.map(e=>[e.start,e.end]),rows.map(e=>[e.start,e.end]))});
test('reuse an old activity establishes a shared identity without moving history',()=>{const t=timer(),old={...closeSegment(t,start+65000)[0],id:'old',activityId:undefined,title:'Email'};const a=switchTask(t,task,start+130000);const rows=[old,...closeSegment(a.timer,start+195000)];const r=renameActivity(rows,a.timer,task.id,'Email',old);assert.equal(r.entries[0].activityId,'activity:old');assert.equal(r.entries[1].activityId,r.entries[0].activityId);assert.equal(r.timer!.activeId,'activity:old')});
test('malformed micro-timer backup is rejected',()=>{const t=timer();assert.equal(validData({version:1,categories:CATS,entries:[],timer:{...t,activeId:'missing'}}),false)});

test('timer drops stretches under a minute and retains the exact boundary',()=>{const t=timer();assert.equal(closeSegment(t,start+59999).length,0);assert.equal(closeSegment(t,start+60000).length,1);assert.equal(switchTask(t,task,start+20000).entries.length,0)});

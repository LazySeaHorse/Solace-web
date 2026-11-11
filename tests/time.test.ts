import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateTime,parseQuick,packEntries,snap,validData,CATS,refreshDefaultColours,zoomScrollLeft,fitScale,type Entry} from '../lib/memory.ts';
const entry=(id:string,start:number,end:number):Entry=>({id,start,end,title:id,type:'actual',date:'2026-11-08',category:'productive',icon:'Laptop',notes:'',rating:'unrated'});
test('snap to closest five-minute mark',()=>{assert.equal(snap(602),600);assert.equal(snap(603),605);assert.equal(snap(1439),1440)});
test('adjacent five-minute activities never occupy overlap lanes',()=>{const packed=packEntries([entry('b',605,610),entry('a',600,605),entry('c',610,615)]);assert.deepEqual(packed.map(x=>x.lanes),[1,1,1])});
test('real overlap uses separate lanes and preserves original times',()=>{const packed=packEntries([entry('a',600,660),entry('b',610,615),entry('c',615,650)]);assert.equal(packed[0].lanes,2);assert.equal(packed[1].lane,1);assert.equal(packed[2].lane,1);assert.equal(packed[1].entry.end,615)});
test('clock subtraction gives a range',()=>{const r=calculateTime('14:20 - 45m');assert.equal(r?.start,815);assert.equal(r?.end,860);assert.equal(r?.minutes,45)});
test('clock addition and a two-time difference',()=>{assert.equal(calculateTime('12:00 + 1h 30m')?.end,810);assert.equal(calculateTime('09:10 to 10:35')?.minutes,85);assert.equal(calculateTime('9:10 am to 1:35 pm')?.minutes,265)});
test('cross-midnight calculations are flagged',()=>{assert.equal(calculateTime('00:10 - 45m')?.crossesDay,true);assert.equal(calculateTime('23:40 to 00:10')?.minutes,30);assert.equal(calculateTime('23:40 to 00:10')?.crossesDay,true);assert.equal(calculateTime('bad'),null)});
test('quick actual duration ends now',()=>{const p=parseQuick('Study econ 25m','2026-11-08','actual',810,720,750);assert.equal(p?.title,'Study econ');assert.equal(p?.start,785);assert.equal(p?.end,810)});
test('quick explicit times and category-independent titles',()=>{const p=parseQuick('Lunch 12:30 to 13:10','2026-11-08','actual',810,720,750);assert.equal(p?.title,'Lunch');assert.equal(p?.start,750);assert.equal(p?.end,790)});
test('planned duration starts at the selected time',()=>{const p=parseQuick('Read for 30m tomorrow','2026-11-08','planned',810,900,930);assert.equal(p?.title,'Read');assert.equal(p?.start,900);assert.equal(p?.end,930);assert.equal(p?.date,'2026-11-09')});
test('invalid or overnight quick ranges need user correction',()=>{assert.equal(parseQuick('Study 23:00 to 01:00','2026-11-08','actual',810,720,750),null)});
test('existing v1 browser backups remain valid',()=>{assert.equal(validData({version:1,entries:[entry('a',600,605)],categories:CATS,timer:null}),true);assert.equal(validData({version:1,entries:[{...entry('a',600,605),date:'2026-02-31'}],categories:CATS,timer:null}),false)});

test('zoom keeps the same time under the pointer',()=>{const scroll=1200,x=400,old=3.2,next=8;const result=zoomScrollLeft(scroll,x,old,next);assert.equal((scroll+x-124)/old,(result+x-124)/next)});
test('fit includes the activity range even on a narrow viewport',()=>{const scale=fitScale(0,1440,375);assert.ok(1440*scale<375-124);assert.ok(scale>=.1);assert.equal(fitScale(600,605,1000),16)});

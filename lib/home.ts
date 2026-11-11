import type {Data} from './memory.ts';
export type Slot='rug'|'seat'|'plant'|'lamp'|'shelf'|'art'|'walls'|'floor'|'tree'|'pond'|'flowers'|'garden';
export type Guardian={activatedAt:number;lastTreeStart:number;lastTheftStart:number;treeDeadAt?:number;stolen?:{slot:Slot;id:string;at:number}};
export type Goal='focus2h'|'focus5h'|'planned'|'productive10h'|'productive50h'|'consistent';
export type HomeState={coins:number;spent?:number;owned:string[];placed:Partial<Record<Slot,string>>;gardenStarted?:boolean;achievements?:Goal[];guardian?:Guardian};
export type Furnishing={id:string;name:string;slot:Slot;price:number;color:string;goal?:Goal;gift?:boolean};
export const FURNITURE:Furnishing[]=[
{id:'rug-cloud',name:'Cloud rug',slot:'rug',price:0,color:'#f6d5e1'},
{id:'rug-rose',name:'Strawberry rug',slot:'rug',price:250,color:'#edb6d3'},
{id:'rug-blue',name:'Blueberry rug',slot:'rug',price:350,color:'#a9c6f0'},
{id:'seat-cushion',name:'Little cushion',slot:'seat',price:0,color:'#f8b99e'},
{id:'seat-sage',name:'Sky sofa',slot:'seat',price:1200,color:'#8eb4ee'},
{id:'seat-pink',name:'Marshmallow sofa',slot:'seat',price:1600,color:'#edb6d3'},
{id:'plant-leaf',name:'Leafy friend',slot:'plant',price:200,color:'#80a9e7'},
{id:'plant-flower',name:'Daisy pot',slot:'plant',price:350,color:'#ef9b7c'},
{id:'lamp-honey',name:'Peach lamp',slot:'lamp',price:450,color:'#f8b99e'},
{id:'lamp-berry',name:'Berry lamp',slot:'lamp',price:550,color:'#ed78b0'},
{id:'shelf-oak',name:'Bedtime books',slot:'shelf',price:900,color:'#a5c0e8'},
{id:'art-sun',name:'A little sunshine',slot:'art',price:250,color:'#ef9b7c'},
{id:'art-moon',name:'Moon dreams',slot:'art',price:400,color:'#1c6bde'},
{id:'walls-cream',name:'Cloud white',slot:'walls',price:0,color:'#f5f9ff'},
{id:'walls-pink',name:'Peach milk',slot:'walls',price:500,color:'#ffe5db'},
{id:'walls-sage',name:'Morning blue',slot:'walls',price:500,color:'#dae8fc'},
{id:'floor-oak',name:'Blue floor',slot:'floor',price:0,color:'#dbe8fb'},
{id:'floor-cream',name:'Blush floor',slot:'floor',price:600,color:'#fff0f5'},
{id:'tree-sapling',name:'Little tree',slot:'tree',price:0,color:'#a8c5f5'},
{id:'tree-blossom',name:'Blossom tree',slot:'tree',price:1800,color:'#f5b6cd'},
{id:'tree-moon',name:'Moonlight tree',slot:'tree',price:4500,color:'#779bea',goal:'productive50h'},
{id:'tree-star',name:'Starfruit tree',slot:'tree',price:2800,color:'#f5b69d',goal:'productive10h'},
{id:'pond-small',name:'Puddle pond',slot:'pond',price:700,color:'#add5f6'},
{id:'pond-lotus',name:'Lotus pond',slot:'pond',price:2400,color:'#9ac5f1'},
{id:'pond-moon',name:'Moon pool',slot:'pond',price:5500,color:'#95aee8',goal:'focus5h'},
{id:'flowers-daisy',name:'Daisy patch',slot:'flowers',price:350,color:'#ffe5ed'},
{id:'flowers-peach',name:'Peach blossoms',slot:'flowers',price:850,color:'#f9b39e'},
{id:'flowers-star',name:'Starlight flowers',slot:'flowers',price:2200,color:'#f1bdd9',goal:'consistent'},
{id:'garden-watering',name:'Golden watering can',slot:'garden',price:0,color:'#f8b99e',goal:'productive10h',gift:true},
{id:'garden-stones',name:'Stepping stones',slot:'garden',price:400,color:'#e8eefa'},
{id:'garden-hammock',name:'Cloud hammock',slot:'garden',price:2000,color:'#c2d6f6',goal:'consistent'},
{id:'garden-fountain',name:'Little fountain',slot:'garden',price:5000,color:'#a2c8f3',goal:'focus2h'},
{id:'garden-telescope',name:'Stargazer',slot:'garden',price:3300,color:'#8aacf0',goal:'focus2h'},
{id:'garden-greenhouse',name:'Tiny greenhouse',slot:'garden',price:7000,color:'#d6e7ff',goal:'productive50h'},
{id:'art-calendar',name:'Little calendar',slot:'art',price:1400,color:'#f8b99e',goal:'planned'},
{id:'lamp-star',name:'Star lantern',slot:'lamp',price:1800,color:'#f8b99e',goal:'focus2h'},
{id:'shelf-cloud',name:'Cloud library',slot:'shelf',price:3800,color:'#d8e8ff',goal:'productive10h'},
{id:'seat-royal',name:'Dream sofa',slot:'seat',price:4200,color:'#e8b5d7',goal:'focus5h'},
{id:'rug-stars',name:'Night sky rug',slot:'rug',price:2600,color:'#8ba8e6',goal:'consistent'}];
export const freshHome=():HomeState=>({coins:0,spent:0,owned:FURNITURE.filter(i=>!i.price&&!i.gift).map(i=>i.id),placed:{rug:'rug-cloud',seat:'seat-cushion',walls:'walls-cream',floor:'floor-oak',tree:'tree-sapling'},gardenStarted:true,achievements:[]});
export function validHome(h:any):boolean{return !!h&&Number.isSafeInteger(h.coins)&&h.coins>=0&&(h.spent===undefined||(Number.isSafeInteger(h.spent)&&h.spent>=0))&&Array.isArray(h.owned)&&h.owned.every((id:unknown)=>FURNITURE.some(i=>i.id===id))&&new Set(h.owned).size===h.owned.length&&(h.gardenStarted===undefined||typeof h.gardenStarted==='boolean')&&(h.achievements===undefined||(Array.isArray(h.achievements)&&h.achievements.every((g:unknown)=>typeof g==='string'&&['focus2h','focus5h','planned','productive10h','productive50h','consistent'].includes(g))))&&(h.guardian===undefined||(h.guardian&&Number.isFinite(h.guardian.activatedAt)&&Number.isFinite(h.guardian.lastTreeStart)&&Number.isFinite(h.guardian.lastTheftStart)&&(h.guardian.treeDeadAt===undefined||Number.isFinite(h.guardian.treeDeadAt))&&(h.guardian.stolen===undefined||(typeof h.guardian.stolen.id==='string'&&FURNITURE.some(i=>i.id===h.guardian.stolen.id&&i.slot===h.guardian.stolen.slot)&&Number.isFinite(h.guardian.stolen.at)))))&&!!h.placed&&typeof h.placed==='object'&&!Array.isArray(h.placed)&&Object.entries(h.placed).every(([slot,id])=>h.owned.includes(id)&&FURNITURE.some(i=>i.id===id&&i.slot===slot))}
export function purchase(h:HomeState,id:string):HomeState{const item=FURNITURE.find(i=>i.id===id);if(!item||item.goal&&!h.achievements?.includes(item.goal))return h;const owned=h.owned.includes(id);if(!owned&&h.coins<item.price)return h;return {...h,coins:h.coins-(owned?0:item.price),spent:spentCoins(h)+(owned?0:item.price),owned:owned?h.owned:[...h.owned,id],placed:{...h.placed,[item.slot]:id}}}
// Derive rewards from actual records plus only the unsaved live segment.
// Purchases are a separate ledger; editing a record never repurchases furniture.
const legacyPrices:Record<string,number>={ 'rug-rose':30,'rug-blue':40,'seat-sage':90,'seat-pink':110,'plant-leaf':20,'plant-flower':35,'lamp-honey':45,'lamp-berry':55,'shelf-oak':70,'art-sun':25,'art-moon':35,'walls-pink':50,'walls-sage':50,'floor-cream':60 };
export function spentCoins(home:HomeState){return home.spent??home.owned.reduce((n,id)=>n+(legacyPrices[id]||0),0)}
export function settleCoins(data:Data,at:number):Data{
 let h=data.home||freshHome();if(!h.gardenStarted)h={...h,gardenStarted:true,owned:[...new Set([...h.owned,'tree-sapling'])],placed:{...h.placed,tree:'tree-sapling'}};let earned=0;
 const reward=(category:string,minutes:number)=>category==='productive'?minutes*2:category==='distraction'?-Math.min(minutes,20):0;
 for(const e of data.entries){if(e.type==='actual')earned+=reward(e.category,Math.floor(Math.max(0,e.end-e.start)+1e-7))}
 const t=data.timer;
 if(t){const category=t.tasks?.find(x=>x.id===t.activeId)?.category||t.category;earned+=reward(category,Math.floor(Math.max(0,at-(t.segmentStartedAt??t.startedAt))/60000))}
 const spent=spentCoins(h),coins=Math.max(0,Math.min(Number.MAX_SAFE_INTEGER,earned-spent));
 const goals=goalProgress(data,at),achievements=[...new Set([...(h.achievements||[]),...(Object.keys(goals) as Goal[]).filter(g=>goals[g].done)])];
 const gifts=FURNITURE.filter(i=>i.gift&&i.goal&&achievements.includes(i.goal)).map(i=>i.id);if(gifts.some(id=>!h.owned.includes(id)))h={...h,owned:[...new Set([...h.owned,...gifts])]};
 const guardian=updateGuardian(data,h,at);
 if(data.home&&h===data.home&&h.coins===coins&&h.spent===spent&&JSON.stringify(h.achievements||[])===JSON.stringify(achievements)&&JSON.stringify(h.guardian)===JSON.stringify(guardian))return data;
 return {...data,home:{...h,spent,coins,achievements,guardian}};
}

export const GOALS:Record<Goal,{label:string;target:number;unit:string}>={focus2h:{label:'Focus for 2 hours straight',target:120,unit:'min'},focus5h:{label:'Focus for 5 hours straight',target:300,unit:'min'},planned:{label:'Complete 80% of a matching plan',target:1,unit:'plan'},productive10h:{label:'Record 10 productive hours',target:600,unit:'min'},productive50h:{label:'Record 50 productive hours',target:3000,unit:'min'},consistent:{label:'30 productive minutes on 4 days in a week',target:4,unit:'days'}};
type Range={start:number;end:number;category:string};
function ranges(data:Data,at:number):Range[]{const rows=data.entries.filter(e=>e.type==='actual').map(e=>{const midnight=new Date(e.date+'T00:00:00').getTime();return {start:midnight+e.start*60000,end:midnight+e.end*60000,category:e.category}});const t=data.timer;if(t){const start=t.segmentStartedAt??t.startedAt,category=t.tasks?.find(x=>x.id===t.activeId)?.category||t.category;rows.push({start,end:at,category})}return rows.filter(r=>Number.isFinite(r.start)&&r.end>r.start).sort((a,b)=>a.start-b.start)}
export function goalProgress(data:Data,at:number):Record<Goal,{value:number;target:number;done:boolean}>{const rows=ranges(data,at),focused=rows.filter(r=>r.category==='productive');let total=0,longest=0,start=0,end=0;const days:Record<string,number>={};
 for(const r of focused){total+=(r.end-r.start)/60000;const day=new Date(r.start);const key=`${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;days[key]=(days[key]||0)+(r.end-r.start)/60000;const interruption=rows.some(x=>x.category!=='productive'&&x.start<r.start&&x.end>end);if(end&&r.start<=end+1000&&!interruption)end=Math.max(end,r.end);else{start=r.start;end=r.end}longest=Math.max(longest,(end-start)/60000)}
 let planned=0;for(const p of data.entries.filter(e=>e.type==='planned'&&e.category==='productive'&&e.end-e.start>=10)){const match=data.entries.some(e=>e.type==='actual'&&e.category==='productive'&&e.date===p.date&&((p.activityId&&e.activityId===p.activityId)||(!p.activityId&&p.title.trim()&&p.title.trim().toLowerCase()===e.title.trim().toLowerCase()))&&Math.max(0,Math.min(p.end,e.end)-Math.max(p.start,e.start))>=.8*(p.end-p.start));if(match){planned=1;break}}
 const values:Record<Goal,number>={focus2h:longest,focus5h:longest,planned,productive10h:total,productive50h:total,consistent:(()=>{const starts=Object.keys(days).map(k=>{const [y,m,d]=k.split('-').map(Number);return new Date(y,m,d).getTime()}).sort((a,b)=>a-b);return starts.reduce((best,t)=>Math.max(best,starts.filter(v=>v>=t&&v<t+7*86400000&&days[`${new Date(v).getFullYear()}-${new Date(v).getMonth()}-${new Date(v).getDate()}`]>=30).length),0)})()};return Object.fromEntries((Object.keys(GOALS) as Goal[]).map(g=>[g,{value:Math.floor(values[g]+1e-7),target:GOALS[g].target,done:values[g]+1e-7>=GOALS[g].target}])) as Record<Goal,{value:number;target:number;done:boolean}>}
// Incidents begin only after the feature is installed. Existing journal history is never punished.
export function updateGuardian(data:Data,h:HomeState,at:number):Guardian {let state:Guardian=h.guardian?{...h.guardian}:{activatedAt:at,lastTreeStart:0,lastTheftStart:0};
 const rows=ranges(data,at),distractions:Range[]=[];for(const r of rows.filter(r=>r.category==='distraction'&&r.end>state.activatedAt)){const prev=distractions[distractions.length-1];if(prev&&r.start<=prev.end+1000)prev.end=Math.max(prev.end,r.end);else distractions.push({...r})}
 for(const r of distractions){const start=Math.max(r.start,state.activatedAt);if(r.end-start>=60*60000&&start>state.lastTreeStart+1000){state.lastTreeStart=start;if(h.placed.tree&&!state.treeDeadAt)state.treeDeadAt=start+60*60000}
 if(r.end-start>=120*60000&&start>state.lastTheftStart+1000){state.lastTheftStart=start;if(!state.stolen){const slot=(['lamp','art','shelf','seat','rug'] as Slot[]).find(s=>h.placed[s]);if(slot)state.stolen={slot,id:h.placed[slot]!,at:start+120*60000}}}}
 const focusedSince=(time:number)=>rows.filter(r=>r.category==='productive'&&r.end>time).reduce((n,r)=>n+Math.max(0,r.end-Math.max(r.start,time)),0);
 if(state.treeDeadAt&&focusedSince(state.treeDeadAt)>=30*60000)delete state.treeDeadAt;
 if(state.stolen&&focusedSince(state.stolen.at)>=30*60000)delete state.stolen;
 return state}
export function recoveryMinutes(data:Data,at:number,incidentAt?:number){if(!incidentAt)return 0;return Math.min(30,Math.floor(ranges(data,at).filter(r=>r.category==='productive'&&r.end>incidentAt).reduce((n,r)=>n+Math.max(0,r.end-Math.max(r.start,incidentAt)),0)/60000))}

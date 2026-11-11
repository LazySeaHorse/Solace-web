import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
import {validEnvelope} from '../../../lib/vault-format';
export const dynamic='force-dynamic';
const reply=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){const user=await getChatGPTUser();if(!user)return reply({error:'Sign in to Haff first.'},401);if(!env.DB)return reply({error:'Sync is not configured.'},503);const row=await env.DB.prepare('SELECT owner, revision, envelope, updated_at FROM haff_vault WHERE id = 1').first<{owner:string;revision:number;envelope:string;updated_at:number}>();if(!row)return reply({revision:0,envelope:null});if(row.owner!==user.userId)return reply({error:'This journal belongs to its owner.'},403);return reply({revision:row.revision,envelope:JSON.parse(row.envelope),updatedAt:row.updated_at})}
export async function PUT(request:Request){const user=await getChatGPTUser();if(!user)return reply({error:'Sign in to Haff first.'},401);const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return reply({error:'Origin rejected.'},403);if(!request.headers.get('content-type')?.startsWith('application/json'))return reply({error:'JSON required.'},415);if(!env.DB)return reply({error:'Sync is not configured.'},503);
 let body:any;try{const raw=await request.text();if(raw.length>8_000_000)return reply({error:'Backup is too large.'},413);body=JSON.parse(raw)}catch{return reply({error:'Invalid request.'},400)}
 if(!Number.isSafeInteger(body.revision)||body.revision<0||!validEnvelope(body.envelope))return reply({error:'Invalid encrypted backup.'},400);
 const stamp=Date.now(),cipher=JSON.stringify(body.envelope);let result;
 if(body.revision===0)result=await env.DB.prepare('INSERT INTO haff_vault (id, owner, revision, envelope, updated_at) VALUES (1, ?, 1, ?, ?) ON CONFLICT(id) DO NOTHING').bind(user.userId,cipher,stamp).run();
 else result=await env.DB.prepare('UPDATE haff_vault SET envelope = ?, revision = revision + 1, updated_at = ? WHERE id = 1 AND owner = ? AND revision = ?').bind(cipher,stamp,user.userId,body.revision).run();
 if(!result.meta.changes)return reply({error:'Another device saved first. Review both copies.'},409);
 return reply({revision:body.revision+1,updatedAt:stamp});
}

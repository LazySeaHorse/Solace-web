import {type Envelope,validEnvelope} from './vault-format.ts';
const encode=(a:Uint8Array)=>{let s='';for(let i=0;i<a.length;i+=8192)s+=String.fromCharCode(...a.subarray(i,i+8192));return btoa(s)};
const decode=(s:string)=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const aad=new TextEncoder().encode('Haff private journal · v1');
export const newSalt=()=>encode(crypto.getRandomValues(new Uint8Array(16)));
export async function deriveVaultKey(password:string,salt:string){const raw=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt:decode(salt),iterations:600000},raw,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
export async function seal(data:unknown,key:CryptoKey,salt:string):Promise<Envelope>{const iv=crypto.getRandomValues(new Uint8Array(12));const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:aad},key,new TextEncoder().encode(JSON.stringify(data)));return {version:1,iterations:600000,salt,iv:encode(iv),ciphertext:encode(new Uint8Array(cipher))}}
export async function unseal(envelope:Envelope,key:CryptoKey){if(!validEnvelope(envelope))throw Error('Invalid encrypted backup.');const raw=await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(envelope.iv),additionalData:aad},key,decode(envelope.ciphertext));return JSON.parse(new TextDecoder().decode(raw))}

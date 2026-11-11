export type Envelope={version:1;iterations:600000;salt:string;iv:string;ciphertext:string};
const base64=(s:unknown,min:number,max:number)=>typeof s==='string'&&s.length>=min&&s.length<=max&&/^[A-Za-z0-9+/]+={0,2}$/.test(s);
export function validEnvelope(v:any):v is Envelope{return v?.version===1&&v.iterations===600000&&base64(v.salt,24,24)&&base64(v.iv,16,16)&&base64(v.ciphertext,24,7_000_000)}

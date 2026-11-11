'use client';
import { useId } from "react";
export function Mascot({ className = "", focused = false, small = false, pose = "note" }: { className?: string; focused?: boolean; small?: boolean; pose?: "note" | "wave" | "read" | "tea" | "rest" }) {
  const id = useId().replaceAll(":", "");
  return <svg className={`haff-mascot ${focused ? "focused" : ""} ${className} mascot-${pose}`} viewBox="0 0 240 210" fill="none" role="img" aria-label={`Haff ${pose==="wave"?"waving hello":pose==="read"?"reading a book":pose==="tea"?"with a warm cup":pose==="rest"?"resting": "holding a note"}`}>
    {!small && <><ellipse cx="124" cy="190" rx="67" ry="6" fill="#e8e9ed" opacity=".6"/></>}
    <g className="mascot-body">
      {!small&&<path d="M160 155c22 11 37 7 32-6" stroke="#1555b6" strokeWidth="6" strokeLinecap="round"/>}
      <path d="M85 121c-17 24-15 55-5 63 7 5 17 3 22-5 12 5 26 5 37 0 5 9 17 10 24 4 13-12 9-47-4-63H85Z" fill="#1c6bde"/>
      <path d="M92 174v10m59-10v10" stroke="#124da4" strokeWidth="3.5" strokeLinecap="round"/>
      <ellipse cx="67" cy="88" rx="43" ry="52" transform="rotate(-18 67 88)" fill="#1555b6"/>
      <ellipse cx="67" cy="89" rx="30" ry="39" transform="rotate(-18 67 89)" fill={`url(#ear-${id})`}/>
      <ellipse cx="172" cy="88" rx="43" ry="52" transform="rotate(18 172 88)" fill="#1555b6"/>
      <ellipse cx="172" cy="89" rx="30" ry="39" transform="rotate(18 172 89)" fill={`url(#ear-${id})`}/>
      <path d="M72 84c0-41 19-65 49-65 34 0 52 26 51 66-1 33-18 58-51 58-33 0-49-25-49-59Z" fill="#3984ee"/>
      <path d="M108 22c4-7 11-9 17-5m-10 7c8-7 15-8 19-2" stroke="#1555b6" strokeWidth="4" strokeLinecap="round"/>
      <ellipse cx="86" cy="104" rx="10" ry="6" fill="#ef9b7c" opacity=".9"/>
      <ellipse cx="156" cy="104" rx="10" ry="6" fill="#ef9b7c" opacity=".9"/>
      {pose==="rest"?<g stroke="#202124" strokeWidth="3" strokeLinecap="round"><path d="M93 86q5 5 10 0M139 86q5 5 10 0"/></g>:<g className="mascot-eyes" style={pose==="read"?{transform:"translateY(5px)"}:undefined}><ellipse cx="98" cy="85" rx="4.4" ry="6" fill="#202124"/><ellipse cx="144" cy="85" rx="4.4" ry="6" fill="#202124"/><circle cx="99.5" cy="83.2" r="1.3" fill="white"/><circle cx="145.5" cy="83.2" r="1.3" fill="white"/></g>}
      <path d="M94 70c3-2 6-2 9 0m36 0c3-2 6-2 9 0" stroke="#124da4" strokeWidth="2.5" strokeLinecap="round"/>
      <path className="mascot-trunk" d={pose==="tea"?"M111 106c0 24 9 43 28 41 13-1 18-8 24-10":pose==="wave"?"M111 106c-1 17 2 32 15 34 11 2 17-8 16-17":pose==="rest"?"M111 106c0 23 4 40 19 40 10 0 16-5 16-12":"M111 106c0 16 1 38 14 42 14 5 24-4 25-15"} stroke="#1c6bde" strokeWidth="21" strokeLinecap="round"/>
      <path d="M114 117h11m-10 7h11" stroke="#124da4" strokeWidth="2" strokeLinecap="round" opacity=".65"/>
      <path d="m102 111-7 7m45-7 6 6" stroke="#fff" strokeWidth="5" strokeLinecap="round"/>
      {!small && pose==="note" && <><rect x="52" y="141" width="42" height="40" rx="5" transform="rotate(-12 52 141)" fill="#fff"/><path d="m60 149 22-4m-20 12 17-4m-15 11 12-3" stroke="#d83995" strokeWidth="3" strokeLinecap="round"/><ellipse cx="64" cy="151" rx="9" ry="13" transform="rotate(-20 64 151)" fill="#1c6bde"/></>}
      {!small && pose==="wave" && <g className="haff-wave-arm"><path d="M85 148c-24 0-37-14-39-35" stroke="#1c6bde" strokeWidth="17" strokeLinecap="round"/><ellipse cx="45" cy="105" rx="13" ry="12" transform="rotate(-15 45 105)" fill="#3984ee"/><path d="M37 101q3-3 6-1m4-1q3-2 5 1" stroke="#b9d4fb" strokeWidth="2.5" strokeLinecap="round"/></g>}
      {!small && pose==="read" && <g className="haff-book"><path d="M79 148q20-8 42 0 22-8 42 0v32q-20-7-42 0-22-7-42 0Z" fill="#fff" stroke="#1555b6" strokeWidth="3" strokeLinejoin="round"/><path d="M121 149v29" stroke="#d83995" strokeWidth="3"/><path d="m88 156 23 1m-23 7 23 1m20-8 23-1m-23 9 23-1" stroke="#ef9b7c" strokeWidth="2" strokeLinecap="round"/><ellipse cx="78" cy="164" rx="9" ry="12" fill="#1c6bde"/><ellipse cx="164" cy="164" rx="9" ry="12" fill="#1c6bde"/></g>}
      {!small && pose==="tea" && <><g className="haff-steam" stroke="#ef9b7c" strokeWidth="2.5" strokeLinecap="round"><path d="M163 128c-7-7 7-10 0-18m12 20c-7-7 7-10 0-18"/></g><path d="M180 145h5c13 0 12 18-2 18" stroke="#d83995" strokeWidth="5"/><path d="M151 141h31v24a8 8 0 0 1-8 8h-15a8 8 0 0 1-8-8Z" fill="#d83995"/><ellipse cx="166.5" cy="141" rx="15.5" ry="4" fill="#ef9b7c"/><ellipse cx="153" cy="160" rx="9" ry="11" fill="#3984ee"/></>}
      {!small && pose==="rest" && <><path d="M65 172q55-13 111 0l-6 21H71Z" fill="#ef9b7c"/><path d="M76 179q44-7 86 0" stroke="#d83995" strokeWidth="2" strokeLinecap="round"/><path d="M94 162q25 15 52 0" stroke="#1c6bde" strokeWidth="15" strokeLinecap="round"/><path d="m180 33 3 7 8 2-8 3-3 7-3-7-8-3 8-2Z" fill="#d83995"/></>}
    </g>
    <defs><linearGradient id={`ear-${id}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d83995"/><stop offset="1" stopColor="#ef9b7c"/></linearGradient><clipPath id={id}><rect width="240" height="210"/></clipPath></defs>
  </svg>;
}

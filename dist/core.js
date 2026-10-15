export const RESOLVER='https://cloudflare-dns.com/dns-query';
const consumerDomains=new Set(['gmail.com','googlemail.com','outlook.com','hotmail.com','live.com','msn.com','yahoo.com','yahoo.co.uk','ymail.com','aol.com','icloud.com','me.com','mac.com','proton.me','protonmail.com','pm.me','gmx.com','gmx.net','gmx.de','web.de','mail.com','hotmail.co.uk','outlook.de','hotmail.de','yahoo.de','yahoo.fr','yahoo.at','yahoo.it','yahoo.es','live.co.uk','live.de','gmx.at','gmx.ch','t-online.de','aon.at','chello.at','bluewin.ch','orange.fr','free.fr','libero.it','comcast.net','att.net','yandex.ru','mail.ru','qq.com','163.com','zoho.com','fastmail.com']);
export function inputAdvice(value){
 const raw=value.trim(),email=raw.includes('@');
 if(email&&!/^[^\s@<>]+@[^\s@<>]+$/.test(raw))throw Error('Enter a domain, or an email address such as you@your-restaurant.com.');
 let name;try{name=domain(email?raw.slice(raw.lastIndexOf('@')+1):raw);}catch(e){if(email)throw Error('Check the domain after @ in your email address, such as you@your-restaurant.com.');throw e;}
 return {name,kind:email?'email':'domain',knownProvider:consumerDomains.has(name)};
}
export function domain(value){
 const raw=value.trim();
 if(!raw||raw.length>253||/[\s/@:#?\\%]/.test(raw))throw Error('Enter a domain only, such as example.com. No email address, URL or IP address.');
 let name;try{name=new URL('https://'+raw).hostname.replace(/\.$/,'').toLowerCase();}catch{throw Error('That domain cannot be parsed.');}
 if(name.length>253||!name.includes('.')||/^\d+(\.\d+){3}$/.test(name)||!name.split('.').every(s=>/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(s))||/\.(localhost|local|internal|test|invalid|onion)$/.test(name))throw Error('Use a public DNS domain with valid labels; local names and IP addresses are excluded.');
 return name;
}
export function selector(value){const s=value.trim();if(/\._domainkey(?:\.|$)/i.test(s))throw Error('Enter only the selector before ._domainkey, for example selector1.');if(s&&!s.split('.').every(x=>/^[a-zA-Z0-9](?:[a-zA-Z0-9_-]{0,61}[a-zA-Z0-9])?$/.test(x)))throw Error('Use the DKIM selector from your mail provider, without @, spaces or a URL.');if(s.length>120)throw Error('DKIM selector is too long.');return s;}
export function txt(data){
 if(!data.startsWith('"'))return data;
 const parts=[];let i=0;
 while(i<data.length){while(data[i]===' ')i++;if(i===data.length)break;if(data[i]!=='"')throw Error('Unrecognized TXT presentation.');i++;let part='',closed=false;while(i<data.length){let c=data[i++];if(c==='"'){closed=true;break;}if(c==='\\'){if(/^\d{3}/.test(data.slice(i,i+3))){const byte=Number(data.slice(i,i+3));if(byte>255)throw Error('Invalid TXT byte escape.');part+=String.fromCharCode(byte);i+=3;}else if(i<data.length)part+=data[i++];else throw Error('Incomplete TXT escape.');}else part+=c;}if(!closed)throw Error('Incomplete TXT string.');parts.push(part);}
 return parts.join('');
}
export function records(result,type){if(result.error||result.Status!==0||result.TC)return [];return(result.Answer||[]).filter(x=>x.type===type).map(x=>({...x,text:type===16?txt(x.data):x.data}));}
export function candidates(kind,rows){return rows.filter(x=>kind==='MX'||(kind==='SPF'?/^v=spf1(?:\s|$)/i.test(x.text):kind==='DMARC'?/^v=DMARC1(?:;|\s|$)/i.test(x.text):x.text.split(';').some(tag=>/^\s*p\s*=/i.test(tag))||/^v=DKIM1\s*;/i.test(x.text)));}
export function explain(kind,result){
 if(!result)return {state:'Not checked',title:'Selector needed',body:'DKIM keys live at a selector supplied by your provider. Enter it above; this tool never guesses selectors.',next:'Open the selector guide above. Microsoft 365 commonly uses selector1 and selector2; check each separately. A skipped check says nothing about whether keys exist.'};
 if(result.Status===3&&['MX','SPF'].includes(kind)&&!result.error&&!result.TC)return{state:'Domain not found',title:'Resolver reports this domain name was not found',body:'The entered domain name returned NXDOMAIN. This is not an absent mail record or an MX fallback configuration.',next:'Check the domain spelling first. If it is correct, ask your DNS provider about the domain’s public DNS status.'};
 if(result.error||result.TC||![0,3].includes(result.Status))return {state:'Unavailable',title:'No usable resolver answer',body:result.error||`DNS status ${result.Status}${result.TC?' · truncated response':''}. This is not evidence that the record is missing.`,next:'Retry later or compare with your authoritative DNS provider.'};
 let rows;try{rows=records(result,kind==='MX'?15:16);}catch(e){return{state:'Tool limitation',title:'TXT format not interpreted by this tool',body:e.message,next:'Read the raw response and compare with your DNS provider.'};}
 if(kind==='MX'){
 const nulls=rows.filter(x=>/^0\s+\.$/.test(x.text.trim()));
 if(nulls.length)return {state:rows.length===1?'Intentional':'Needs attention',title:rows.length===1?'This domain announces no incoming mail':'Null MX mixed with other MX records',body:'A sole “0 .” MX intentionally declines incoming email. It is not a broken mailbox.',next:rows.length===1?'If receiving mail is intended, ask the domain owner about this policy.':'Ask the DNS administrator to resolve the conflicting MX configuration.'};
 return rows.length?{state:'Observed',title:`${rows.length} mail routing record${rows.length===1?'':'s'}`,body:'Lower preference numbers are tried first. DNS routing does not prove that these servers or a mailbox accept mail.',next:'Compare these hosts with your mail provider’s setup instructions.'}:{state:'Incomplete',title:'No explicit MX observed',body:'SMTP can fall back to this domain’s A/AAAA addresses when MX is absent. This tool does not query fallback addresses or connect to mail servers.',next:'Check whether implicit address fallback is intentional with your DNS administrator.'};
 }
 const found=candidates(kind,rows);
 if(found.length>1)return{state:'Needs attention',title:`Multiple ${kind} candidate records`,body:'Multiple policy/key candidates require administrator review; this tool cannot choose one.',next:'Compare the raw TXT records with your provider’s intended single policy/key.'};
 if(!found.length)return{state:'Not found here',title:`No ${kind} candidate observed`,body:kind==='DMARC'?'No exact-domain DMARC policy was found. A policy may be inherited from the organizational domain; public-suffix discovery and inheritance are not checked.':kind==='DKIM'?((result.Answer||[]).some(r=>r.type===5)?'A CNAME alias was returned, but no recognizable key appeared in this resolver answer. This tool does not issue another target query. ':'No recognizable key was found at this exact selector. ')+'Other selectors may exist.': 'No SPF policy was found among the returned TXT records. This is not a message authentication result.',next:kind==='DMARC'?'Check the organizational domain policy with your mail administrator.':kind==='DKIM'?'Confirm the exact selector and DNS name with your provider.':'Ask your sending provider for its SPF publishing instructions.'};
 const text=found[0].text;
 if(kind==='SPF'){
 const all=text.match(/(?:^|\s)([+~?-]?)all(?:\s|$)/i),qualifier=all?all[1]||'+':null;
 const policy=qualifier==='+'?'This policy permits any sender with all; ask your provider whether that is intentional.':qualifier==='~'?'~all asks receivers to treat other senders as a soft fail; it does not say a message failed.':qualifier==='-'?'-all says other senders should fail SPF; this does not test an actual message.':qualifier==='?'?'?all makes no authorization assertion about other senders.':/\bredirect=/i.test(text)?'The policy redirects evaluation to another policy, which this tool does not follow.':'No all or redirect term was found; senders that do not match a mechanism normally receive a neutral result.';
 return{state:qualifier==='+'?'Needs attention':'Records found',title:qualifier==='+'?'Sending policy permits any sender':'Sending policy published',brief:policy,body:'SPF lists permitted sending services. '+policy+' This tool does not follow includes or evaluate senders, macros or lookup limits; that is a tool limitation, not incomplete setup.',next:qualifier==='+'?'Ask your sending provider to review the all mechanism before changing this policy.':'Compare the policy with all intended senders before changing it.'};
 }
 const tags=new Map();let duplicate=false;for(const part of text.split(';')){const match=part.trim().match(/^([a-z]+)\s*=\s*(.*)$/i);if(match){const key=match[1].toLowerCase();duplicate ||= tags.has(key);tags.set(key,match[2]);}}
 if(kind==='DMARC'){const p=tags.get('p')?.trim().toLowerCase();return{state:duplicate||!['none','quarantine','reject'].includes(p)?'Needs attention':'Observed',title:p==='none'?'Monitoring only: no quarantine or rejection requested':p==='quarantine'?'Failing messages should be treated as suspicious':p==='reject'?'Failing messages should be rejected':p?`Unrecognized DMARC policy: ${p}`:'DMARC candidate has no p= policy',body:(p==='none'?'Monitoring only: p=none requests no quarantine or rejection for messages failing DMARC. It can be an intentional first step while reviewing reports. ':p==='quarantine'?'p=quarantine asks receivers to treat failing messages as suspicious. ':p==='reject'?'p=reject asks receivers to reject messages failing DMARC. ':'')+'DMARC compares authenticated domains with the visible From address. This summary does not test messages or fully validate the policy.',next:duplicate?'Duplicate tags need administrator review.':!['none','quarantine','reject'].includes(p)?'Ask your mail provider for a valid DMARC policy and compare it with the published record.':'Check alignment and reports with your mail provider; do not strengthen policy blindly.'};}
 return{state:duplicate||!tags.has('p')?'Needs attention':tags.get('p')===''?'Intentional':'Records found',title:tags.get('p')===''?'DKIM key is revoked':'DKIM candidate observed · not validated',body:'A p= value publishes a key; an empty p= revokes it. Cryptographic key syntax and message signatures are not validated.',next:'Confirm the selector and active key with your provider; inspect an actual sent message’s authentication results.'};
}
export async function query(name,type,signal,fetcher=fetch){
 const started=new Date().toISOString();const url=new URL(RESOLVER);url.searchParams.set('name',name);url.searchParams.set('type',type);
 const response=await fetcher(url,{headers:{accept:'application/dns-json'},credentials:'omit',cache:'no-store',redirect:'error',referrerPolicy:'no-referrer',signal});
 if(!response.ok)throw Error(`Resolver HTTP ${response.status}`);
 const reader=response.body.getReader();let size=0;const chunks=[];try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>65536)throw Error('Resolver response exceeded 64 KiB.');chunks.push(value);}}finally{await reader.cancel().catch(()=>{});reader.releaseLock();}
 const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}const json=JSON.parse(new TextDecoder().decode(bytes));
 if(!Number.isInteger(json.Status)||json.Status<0||json.Status>15||json.Answer!==undefined&&(!Array.isArray(json.Answer)||json.Answer.length>100||json.Answer.some(x=>!Number.isInteger(x.type)||typeof x.data!=='string'||x.data.length>16000||typeof x.name!=='string'||!Number.isFinite(x.TTL)||x.TTL<0)))throw Error('Resolver response schema was not recognized.');
 return{...json,observed:started,name,type,bytes:size};
}
export class CheckSession{
 constructor(queryFn=query,deadline=12000){this.queryFn=queryFn;this.deadline=deadline;this.generation=0;this.controller=null;}
 cancel(){this.generation++;this.controller?.abort();this.controller=null;}
 async run(tasks){
  this.cancel();const id=this.generation,controller=new AbortController();this.controller=controller;
  const timer=setTimeout(()=>controller.abort(),this.deadline),results={};
  await Promise.all(tasks.map(async([kind,name,type])=>{
   let onAbort;const aborted=new Promise((_,reject)=>{onAbort=()=>reject(Error('Request cancelled or reached the 12-second deadline.'));controller.signal.addEventListener('abort',onAbort,{once:true});if(controller.signal.aborted)onAbort();});
   try{results[kind]=await Promise.race([this.queryFn(name,type,controller.signal),aborted]);}
   catch(e){results[kind]={error:`Request unavailable: ${e.message}`,name,type,observed:new Date().toISOString()};}
   finally{controller.signal.removeEventListener('abort',onAbort);}
  }));
  clearTimeout(timer);if(id!==this.generation)return null;this.controller=null;return results;
 }
}

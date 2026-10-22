/* La Liga del Saber · Transferencia anónima con control exclusivo.
   Requiere migración SQL y secretos de Supabase. No desplegar sin pruebas de rate limiting. */
import { createClient } from "npm:@supabase/supabase-js@2";
import { safeProgress } from "./validate-progress.mjs";
const site="https://cargamelo.github.io";
const url=Deno.env.get("SUPABASE_URL");
const secret=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const pepper=Deno.env.get("TRANSFER_PEPPER");
const ready=Boolean(url&&secret&&pepper&&pepper.length>=32);
const db=ready?createClient(url!,secret!,{auth:{autoRefreshToken:false,persistSession:false}}):null;
const CORS={"Access-Control-Allow-Origin":site,"Access-Control-Allow-Headers":"content-type,x-liga-token,apikey","Access-Control-Allow-Methods":"POST,OPTIONS","Vary":"Origin","Cache-Control":"no-store"};
const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{...CORS,"Content-Type":"application/json; charset=utf-8"}});
const alphabet="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function randomBytes(count:number){const x=new Uint8Array(count);crypto.getRandomValues(x);return x}
function token(){return [...randomBytes(32)].map(n=>n.toString(16).padStart(2,"0")).join("")}
function readable(count:number){return [...randomBytes(count)].map(x=>alphabet[x&31]).join("")}
async function digest(value:string){
 const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(pepper!),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
 const h=await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(value));
 return [...new Uint8Array(h)].map(x=>x.toString(16).padStart(2,"0")).join("");
}
const uuid=/^[\da-f]{8}-[\da-f]{4}-[1-8][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;
async function rpc(name:string,args:Record<string,unknown>){const {data,error}=await db!.rpc(name,args);if(error){console.error("liga_rpc",name,error.code);throw new Error("Error de almacenamiento remoto")}return data}
async function limitedBody(req:Request){
 const reader=req.body?.getReader();if(!reader)return null;
 const chunks:Uint8Array[]=[];let total=0;
 while(true){
  const {done,value}=await reader.read();if(done)break;
  total+=value.byteLength;
  if(total>250000){await reader.cancel().catch(()=>{});throw new Error("Solicitud demasiado grande")}
  chunks.push(value);
 }
 const data=new Uint8Array(total);let offset=0;
 for(const chunk of chunks){data.set(chunk,offset);offset+=chunk.byteLength}
 return JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(data));
}
async function authenticate(body:Record<string,unknown>,req:Request){
 const id=String(body.id||""),raw=req.headers.get("x-liga-token")||"";
 if(!uuid.test(id)||!/^[a-f0-9]{64}$/i.test(raw))throw new Error("Autorización incorrecta");
 return {id,hash:await digest("device:"+raw)};
}
async function allowed(req:Request,kind:string,limit:number,windowSeconds:number){
 // Until ingress can attest the peer IP, do not treat client-supplied forwarded headers as an identity.
 // A shared defensive bucket is a conservative fallback: the server is not enabled in production.
 const bucket=await digest("limit:"+kind+":unverified-ingress");
 return await rpc("liga_rate",{p_bucket:bucket,p_max:limit,p_window_seconds:windowSeconds})===true;
}
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers:CORS});
 if(req.method!=="POST")return reply({error:"Método no permitido"},405);
 if(req.headers.get("origin")&&req.headers.get("origin")!==site)return reply({error:"Origen no autorizado"},403);
 if(!ready)return reply({error:"Servidor no configurado"},503);
 try{
  let body:Record<string,unknown>;
  try{body=await limitedBody(req) as Record<string,unknown>}
  catch(e){return reply({error:e instanceof Error&&e.message==="Solicitud demasiado grande"?"Solicitud demasiado grande":"JSON incorrecto"},e instanceof Error&&e.message==="Solicitud demasiado grande"?413:400)}
  if(!body||typeof body!=="object"||Array.isArray(body))return reply({error:"Datos incorrectos"},400);
  const action=String(body.action||"");
  if(action==="create"){
   if(!await allowed(req,"create",5,3600))return reply({error:"Demasiadas solicitudes"},429);
   const progress=safeProgress(body.progress);
   const deviceToken=token(),recovery=readable(26);
   const data=await rpc("liga_create",{p_progress:progress,p_token_hash:await digest("device:"+deviceToken),p_recovery_hash:await digest("recovery:"+recovery)});
   return reply({...data,deviceToken,recoveryCode:recovery});
  }
  if(action==="redeem"){
   if(!await allowed(req,"redeem",7,600))return reply({error:"Demasiados intentos"},429);
   const code=String(body.code||"").toUpperCase().replace(/[-\s]/g,"");
   if(!/^[A-HJ-NP-Z2-9]{12}$/.test(code))return reply({error:"Código inválido"},400);
   const deviceToken=token();
   const data=await rpc("liga_redeem",{p_code_hash:await digest("code:"+code),p_new_token_hash:await digest("device:"+deviceToken)});
   return data?.ok?reply({...data,deviceToken}):reply({error:"Código caducado o no disponible"},400);
  }
  if(action==="recover"){
   if(!await allowed(req,"recover",5,3600))return reply({error:"Demasiados intentos"},429);
   const code=String(body.recoveryCode||"").toUpperCase().replace(/[-\s]/g,"");
   if(!/^[A-HJ-NP-Z2-9]{26}$/.test(code))return reply({error:"Código de recuperación inválido"},400);
   const deviceToken=token(),recovery=readable(26);
   const data=await rpc("liga_recover",{p_recovery_hash:await digest("recovery:"+code),p_new_token_hash:await digest("device:"+deviceToken),p_new_recovery_hash:await digest("recovery:"+recovery)});
   return data?.ok?reply({...data,deviceToken,recoveryCode:recovery}):reply({error:"No se ha podido recuperar la partida"},403);
  }
  const auth=await authenticate(body,req);
  if(action==="read"){
   const data=await rpc("liga_read",{p_id:auth.id,p_token_hash:auth.hash});
   return data?.ok?reply(data):reply(data,403);
  }
  if(action==="save"){
   const progress=safeProgress(body.progress),rev=Number(body.revision),operation=String(body.operation||"");
   if(!Number.isSafeInteger(rev)||rev<0||!uuid.test(operation))return reply({error:"Revisión u operación inválida"},400);
   const data=await rpc("liga_save",{p_id:auth.id,p_token_hash:auth.hash,p_base_revision:rev,p_operation:operation,p_progress:progress});
   return data?.ok?reply(data):reply(data,data?.reason==="revision_conflict"?409:403);
  }
  if(action==="issue"){
   if(!await allowed(req,"issue",12,3600))return reply({error:"Demasiadas solicitudes"},429);
   const code=readable(12);
   const data=await rpc("liga_issue",{p_id:auth.id,p_token_hash:auth.hash,p_code_hash:await digest("code:"+code)});
   return data?.ok?reply({...data,code:code.replace(/.{4}/g,"$&-").slice(0,-1)}):reply(data,403);
  }
  if(action==="cancel"){
   const ok=await rpc("liga_cancel",{p_id:auth.id,p_token_hash:auth.hash});
   return ok?reply({ok:true}):reply({error:"No se tiene el control"},403);
  }
  return reply({error:"Operación desconocida"},404);
 }catch(err){
  const message=err instanceof Error?err.message:"Error interno";
  if(/inválid|demasiado grande|Faltan|Autorización incorrecta/.test(message))return reply({error:message},400);
  return reply({error:"Error temporal del servidor"},503);
 }
});

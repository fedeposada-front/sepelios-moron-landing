export const CMS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSkSfWqKhzXqok3XzWRcfjktTa_N7DHjWZkyeBPuOxlF8KpsP8Ntq-WiNY09M-Is2Rim-MQaA_HyxqQ/pub?gid=266301715&single=true&output=csv";
export function parseCSV(text) {
  const rows=[];let row=[],value='',quoted=false;
  for(let i=0;i<text.length;i++){const c=text[i];
    if(c==='"'){if(quoted&&text[i+1]==='"'){value+='"';i++}else quoted=!quoted}
    else if(c===','&&!quoted){row.push(value);value=''}
    else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(value);if(row.some(Boolean))rows.push(row);row=[];value=''}
    else value+=c;
  }
  if(quoted)throw Error('CSV inválido');row.push(value);if(row.some(Boolean))rows.push(row);return rows;
}
export function parseCMS(text) {
 const rows=parseCSV(text.replace(/^\uFEFF/,''));
 if(rows[0]?.slice(0,6).map(x=>x.trim().toLowerCase()).join(',')!=='tipo,id,campo,valor,mostrar,orden')throw Error('Formato CMS inesperado');
 const config={},groups={};
 for(const cells of rows.slice(1)){
  const [type,id,field,value='',show='SI',order='0']=cells.map(v=>String(v??'').trim());
  if(!/^[a-z0-9_]+$/.test(id)||!/^[a-z0-9_]+$/.test(field))continue;
  if(type==='config'){if(field==='whatsapp_numero'&&!/^\d{11,15}$/.test(value))continue;config[field]=value;continue}
  if(!['seccion','servicio','precio','card','faq','zona','aviso','boton','seo'].includes(type))continue;
  if(field==='imagen'&&value&&!(/^https:\/\/[^\s"'<>]+$/.test(value)||/^\/assets\/[\w./-]+$/.test(value)))continue;
  const key=type+':'+id;groups[key]??={type,id,mostrar:true,orden:Number(order)||0};
  if(field==='mostrar') groups[key].mostrar=value.toUpperCase()!=='NO';
  else if(show.toUpperCase()!=='NO') groups[key][field]=value;
 }
 const collections={};for(const item of Object.values(groups))(collections[item.type]??=[]).push(item);
 for(const items of Object.values(collections))items.sort((a,b)=>a.orden-b.orden||a.id.localeCompare(b.id));
 return {config,collections};
}
export const cmsItems=(cms,type)=>(cms?.collections?.[type]||[]).filter(x=>x.mostrar);
export const cmsItem=(cms,type,id)=>cms?.collections?.[type]?.find(x=>x.id===id);

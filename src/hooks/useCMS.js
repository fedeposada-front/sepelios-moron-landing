import {useEffect,useState} from 'react';
import {CMS_URL,parseCMS} from '../cms/parseCMS';
export function useCMS(){
 const [cms,setCMS]=useState(null);
 useEffect(()=>{const controller=new AbortController();fetch(CMS_URL,{signal:controller.signal,cache:'no-store'}).then(r=>{if(!r.ok)throw Error('CMS '+r.status);return r.text()}).then(t=>setCMS(parseCMS(t))).catch(e=>{if(e.name!=='AbortError')console.warn('CMS: respaldo activo',e.message)});return()=>controller.abort()},[]);
 return cms;
}

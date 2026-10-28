import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertResources } from '../lib/resources.mjs';
const base = () => ({tools:[{slug:'pcb-si'}], videos:[], wishes:[], issues:[], forms:{trial:null,feedback:null,bug:null,wish:null}});
test('unset forms and empty public lists are valid', () => assert.doesNotThrow(() => assertResources(base())));
test('only company Microsoft Forms HTTPS hosts can be configured', () => {
 for (const value of ['https://forms.office.com/r/example','https://forms.cloud.microsoft/r/example']) {
  const data=base();data.forms.bug=value;assert.doesNotThrow(()=>assertResources(data));
 }
 for (const value of ['https://example.org','javascript:alert(1)','https://forms.office.com.example.org/r/x','http://forms.office.com/r/x']) {
  const data=base();data.forms.bug=value;assert.throws(()=>assertResources(data));
 }
});
const video = (extra={}) => ({tool:'pcb-si',series:'tool-guide',episode:20,label:'EP20',youtubeId:'0WrsCh3PjII',title:'Example',titleZh:'範例',titleEn:'Example',duration:'7:00',...extra});
test('video cards need a series, episode, label and well-formed length and guide links', () => {
 const data=base();data.videos=[video({guide:[{label:'快速開始',path:'/tools/pcb-si/manual/'}]})];
 assert.doesNotThrow(()=>assertResources(data));
 for (const [extra, re] of [[{series:'other'},/series/],[{episode:'20'},/episode/],[{label:' '},/label/],[{duration:'7 min'},/duration/],[{guide:[{label:'x',path:'https://example.org'}]},/guide/]]) {
  data.videos=[video(extra)];assert.throws(()=>assertResources(data),re);
 }
 data.videos=[video(),video({youtubeId:'oidkGt13ZaY'})];
 assert.throws(()=>assertResources(data),/duplicate episode/);
});
test('malformed video and duplicate IDs fail before publishing', () => {
 const data=base();data.videos=[video({youtubeId:'bad'})];
 assert.throws(()=>assertResources(data),/YouTube ID/);
 data.videos[0].youtubeId='0q0fQNSyg-E';data.videos.push({...data.videos[0]});
 assert.throws(()=>assertResources(data),/duplicate/);
});
test('unknown tools and unrecognised roadmap states fail', () => {
 const data=base();data.wishes=[{id:'example',tool:'pcb-si',status:'promised',title:'Example',titleZh:'範例'}];
 assert.throws(()=>assertResources(data),/status/);
 data.wishes[0].status='received';data.wishes[0].tool='missing';
 assert.throws(()=>assertResources(data),/unknown tool/);
});
test('known issues require bilingual details and affected versions',()=>{
 const data=base();data.issues=[{id:'example',tool:'pcb-si',title:'Example',titleZh:'範例'}];
 assert.throws(()=>assertResources(data),/affected versions/);
 for (const field of ['description', 'descriptionZh', 'versions']) {
  for (const invalid of ['   ', [], 0, {}]) {
   data.issues[0]={id:'example',tool:'pcb-si',title:'Example',titleZh:'範例',description:'A confirmed issue',descriptionZh:'已確認問題',versions:'1.0.0',[field]:invalid};
   assert.throws(()=>assertResources(data),/affected versions/);
  }
 }
});

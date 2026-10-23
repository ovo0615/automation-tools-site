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
test('malformed video and duplicate IDs fail before publishing', () => {
 const data=base();data.videos=[{tool:'pcb-si',youtubeId:'bad',title:'Example',titleZh:'範例'}];
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

import fs from "fs";
import * as topo from "topojson-client";
const world = JSON.parse(fs.readFileSync("node_modules/world-atlas/countries-110m.json"));
const A1=1.340264,A2=-0.081106,A3=0.000893,A4=0.003796,M=Math.sqrt(3)/2;
const rad=Math.PI/180;
function ee(lon,lat){
  const l=lon*rad,p=lat*rad,t=Math.asin(M*Math.sin(p)),t2=t*t,t6=t2*t2*t2;
  return [l*Math.cos(t)/(M*(A1+3*A2*t2+t6*(7*A3+9*A4*t2))), -t*(A1+A2*t2+t6*(A3+A4*t2))];
}
const [x1]=ee(-180,0),[x2]=ee(180,0);
const [,yTop]=ee(0,84),[,yBot]=ee(0,-57);
const W=1000, scale=W/(x2-x1), H=Math.round((yBot-yTop)*scale);
const tx=-x1*scale, ty=-yTop*scale;
const P=(lon,lat)=>{const [x,y]=ee(lon,lat);return [x*scale+tx,y*scale+ty];};
const r=n=>Math.round(n*10)/10;
function ringPath(ring){
  // drop points that wrap oddly; split at antimeridian jumps
  let d="",prev=null;
  for(const [lon,lat] of ring){
    const [x,y]=P(lon,lat);
    if(prev===null) d+=`M${r(x)} ${r(y)}`;
    else if(Math.abs(lon-prev)>180) d+=`M${r(x)} ${r(y)}`;
    else d+=`L${r(x)} ${r(y)}`;
    prev=lon;
  }
  return d;
}
const countries=topo.feature(world,world.objects.countries).features.filter(f=>f.id!=="010"); // no Antarctica
let land="";
for(const f of countries){
  const polys=f.geometry.type==="Polygon"?[f.geometry.coordinates]:f.geometry.coordinates;
  for(const poly of polys) for(const ring of poly) land+=ringPath(ring)+"Z";
}
// borders
const mesh=topo.mesh(world,world.objects.countries,(a,b)=>a!==b&&a.id!=="010"&&b.id!=="010");
let borders="";
for(const line of mesh.coordinates) borders+=ringPath(line);
const out=`/* Generated from Natural Earth via world-atlas (110m), Equal Earth projection. Do not edit by hand. */
window.WORLD_MAP=${JSON.stringify({w:W,h:H,scale:+scale.toFixed(4),tx:r(tx),ty:r(ty),land,borders})};
`;
fs.writeFileSync("world-map-data.js",out);
console.log(W,H,scale,tx,ty,out.length);

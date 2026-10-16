import{Z as e,i as t,n}from"./index-BCFUOWbP.js";function r(e,{top:t=10,len:n=8,amp:r=.2,freq:i=.7,heave:a=0,heaveR:o=7,key:s=`sway`}={}){let c={uTime:{value:0}},l=new Map,u=e=>{if(l.has(e))return l.get(e);let u=e.clone();return u.onBeforeCompile=e=>{e.uniforms.uTime=c.uTime,e.vertexShader=`uniform float uTime;
`+e.vertexShader.replace(`#include <begin_vertex>`,`#include <begin_vertex>
        {
          float k = clamp((${t.toFixed(3)} - transformed.y) / ${n.toFixed(3)}, 0.0, 1.0);
          k = k * k * (3.0 - 2.0 * k);
          float ph = transformed.x * 0.33 + transformed.z * 0.21;
          transformed.x += ${r.toFixed(3)} * k * sin(uTime * ${i.toFixed(3)} + ph);
          transformed.z += ${(r*.6).toFixed(3)} * k * sin(uTime * ${(i*.77).toFixed(3)} + ph * 1.7 + 1.3);
          float rr = clamp(1.0 - (transformed.x * transformed.x + transformed.z * transformed.z) / ${(o*o).toFixed(3)}, 0.0, 1.0);
          transformed.y += ${a.toFixed(3)} * rr * sin(uTime * 0.45 + transformed.x * 0.25);
        }`)},u.customProgramCacheKey=()=>`${s}${e.uuid}${t}_${n}_${r}_${i}_${a}_${o}`,l.set(e,u),u};return e.traverse(e=>{(e.isMesh||e.isLineSegments)&&(e.material=u(e.material))}),c}var i=(e,t=0)=>{let n=Math.sin(e*127.1+t*311.7)*43758.5453;return n-Math.floor(n)};function a(e,{x:r=0,y:i=0,z:a=0,h:o=.36,color:s=n.terracotta,skin:c=`#d7b08c`,ry:l=0,arms:u=0,mat:d=t.smooth}){if(e.push({x:r,y:i,z:a,ry:l}),e.cyl(o*.07,o*.16,o*.62,{color:s,seg:7,mat:d}),e.sphere(o*.12,{y:o*.76,color:c,seg:8,mat:d}),u)for(let t of[-1,1])e.rod([t*o*.06,o*.55,0],[t*o*.22,o*(.55+.3*u),0],o*.03,{color:c,seg:4,mat:d});e.pop()}var o=new e;function s(e,t,n,r,i,a=1,s=0,c=0,l=0,u=a){o.position.set(n,r,i),o.rotation.set(c,s,l),o.scale.set(a,u,a),o.updateMatrix(),e.setMatrixAt(t,o.matrix)}export{r as i,i as n,s as r,a as t};
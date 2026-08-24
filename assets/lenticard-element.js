var Lenticard=(function(p){"use strict";var Te=Object.defineProperty;var Re=(p,m,L)=>m in p?Te(p,m,{enumerable:!0,configurable:!0,writable:!0,value:L}):p[m]=L;var s=(p,m,L)=>Re(p,typeof m!="symbol"?m+"":m,L);const m={landscape:1.5,portrait:.7142857142857143,square:1,circle:1};function L(n){const i=n.filter(t=>t.width>0&&t.height>0);if(!i.length)return 1;const e=i.reduce((t,r)=>t+Math.log(r.width/r.height),0);return Math.exp(e/i.length)}function G(n,i){return n!=="auto"?n:i>=1.15?"landscape":i<=.87?"portrait":"square"}function W(n,i){return n==="auto"?"vertical":n}class ce{constructor(i){s(this,"canvas");s(this,"root");s(this,"layers",[]);s(this,"urls",[]);s(this,"count",0);this.root=document.createElement("div"),this.root.className="lc-fallback",i.appendChild(this.root),this.canvas=document.createElement("canvas")}get isLost(){return!1}setFrames(i){this.clear(),this.count=i.length,this.layers=i.map((e,t)=>{const r=document.createElement("div");return r.className="lc-fallback-layer",r.style.backgroundImage=`url("${this.urlFor(e)}")`,r.style.opacity=t===0?"1":"0",this.root.appendChild(r),r})}urlFor(i){var a;const e=i.source;if(e instanceof HTMLImageElement)return e.src;const t=document.createElement("canvas");t.width=i.width,t.height=i.height,(a=t.getContext("2d"))==null||a.drawImage(e,0,0);const r=t.toDataURL("image/png");return this.urls.push(r),r}resize(i,e,t){}render(i){if(!this.count)return;const e=this.count-1,t=(i.angle*i.parallax+1)/2*e,r=Math.max(0,Math.min(e,Math.floor(t))),a=t-r;this.layers.forEach((o,d)=>{const v=d===r?1-a:d===r+1?a:0;o.style.opacity=String(v)}),this.root.style.setProperty("--lc-ridge-pitch",`${Math.max(2,800/i.lenticules)}px`)}clear(){this.root.textContent="",this.layers=[],this.urls=[]}dispose(){this.clear(),this.root.remove()}}function z(n){return new Promise((i,e)=>{const t=new Image;!n.startsWith("data:")&&!n.startsWith("blob:")&&(t.crossOrigin="anonymous"),t.decoding="async",t.onload=()=>i(t),t.onerror=()=>e(new Error(`lenticard: could not load image "${n}"`)),t.src=n})}async function he(n){if(typeof n=="string"){const i=await z(n);return{source:i,width:i.naturalWidth,height:i.naturalHeight}}if(typeof Blob<"u"&&n instanceof Blob){if(typeof createImageBitmap=="function"){const t=await createImageBitmap(n);return{source:t,width:t.width,height:t.height}}const i=URL.createObjectURL(n),e=await z(i);return{source:e,width:e.naturalWidth,height:e.naturalHeight,revoke:i}}if(typeof ImageBitmap<"u"&&n instanceof ImageBitmap)return{source:n,width:n.width,height:n.height};if(n instanceof HTMLCanvasElement)return{source:n,width:n.width,height:n.height};if(n instanceof HTMLImageElement)return(!n.complete||n.naturalWidth===0)&&await n.decode().catch(()=>{throw new Error("lenticard: the supplied <img> never finished loading")}),{source:n,width:n.naturalWidth,height:n.naturalHeight};throw new Error("lenticard: unsupported image source")}function I(n){n.revoke&&URL.revokeObjectURL(n.revoke),typeof ImageBitmap<"u"&&n.source instanceof ImageBitmap&&n.source.close()}class H{constructor(i=120,e=22){s(this,"value",0);s(this,"velocity",0);this.stiffness=i,this.damping=e}step(i,e){const t=Math.min(e,.03333333333333333),r=(i-this.value)*this.stiffness-this.velocity*this.damping;return this.velocity+=r*t,this.value+=this.velocity*t,this.value}snap(i){this.value=i,this.velocity=0}}class de{constructor(i,e){s(this,"springX",new H);s(this,"springY",new H);s(this,"targetX",0);s(this,"targetY",0);s(this,"manual",!1);s(this,"lastInput",0);s(this,"elapsed",0);s(this,"gyroBase",null);s(this,"gyroActive",!1);s(this,"gyroLive",!1);s(this,"pose",{x:0,y:0,bob:0,energy:0,source:"rest"});s(this,"onPointerMove",i=>{const e=this.element.getBoundingClientRect();!e.width||!e.height||(this.targetX=(i.clientX-e.left)/e.width*2-1,this.targetY=(i.clientY-e.top)/e.height*2-1,this.manual=!0,this.lastInput=this.elapsed)});s(this,"onPointerLeave",()=>{this.manual=!1,this.targetX=0,this.targetY=0,this.lastInput=this.elapsed});s(this,"onOrientation",i=>{const{beta:e,gamma:t}=i;e==null||t==null||(this.gyroBase||(this.gyroBase={beta:e,gamma:t}),this.targetX=k((t-this.gyroBase.gamma)/35,-1,1),this.targetY=k((e-this.gyroBase.beta)/35,-1,1),this.manual=!0,this.gyroLive=!0,this.lastInput=this.elapsed)});this.element=i,this.options=e,this.lastInput=-1/0,this.attach()}setOptions(i){const e=this.options.mode;this.options={...this.options,...i},i.mode&&i.mode!==e&&(this.detach(),this.manual=!1,this.targetX=0,this.targetY=0,this.attach())}get isTouch(){return typeof matchMedia=="function"&&matchMedia("(hover: none) and (pointer: coarse)").matches}attach(){this.options.mode==="pointer"&&(this.element.addEventListener("pointermove",this.onPointerMove,{passive:!0}),this.element.addEventListener("pointerleave",this.onPointerLeave,{passive:!0}),this.element.addEventListener("pointercancel",this.onPointerLeave,{passive:!0})),(this.options.mode==="gyro"||this.options.mode==="pointer"&&this.isTouch)&&this.listenGyro()}detach(){this.element.removeEventListener("pointermove",this.onPointerMove),this.element.removeEventListener("pointerleave",this.onPointerLeave),this.element.removeEventListener("pointercancel",this.onPointerLeave),window.removeEventListener("deviceorientation",this.onOrientation),this.gyroActive=!1,this.gyroLive=!1,this.gyroBase=null}listenGyro(){this.gyroActive||typeof window>"u"||(window.addEventListener("deviceorientation",this.onOrientation,{passive:!0}),this.gyroActive=!0)}async enableGyro(){const i=window.DeviceOrientationEvent;if(i&&typeof i.requestPermission=="function")try{if(await i.requestPermission()!=="granted")return!1}catch{return!1}else if(typeof DeviceOrientationEvent>"u")return!1;return this.options.mode="gyro",this.gyroBase=null,this.listenGyro(),!0}setAngle(i,e,t=!1){this.targetX=k(i,-1,1),this.targetY=k(e,-1,1),this.manual=!0,this.lastInput=this.elapsed,t&&(this.springX.snap(this.targetX),this.springY.snap(this.targetY),this.pose.x=this.targetX,this.pose.y=this.targetY)}step(i){this.elapsed+=i;const{mode:e,idleSweep:t,float:r,reducedMotion:a}=this.options;let o=this.targetX,d=this.targetY;const v=(this.elapsed-this.lastInput)*1e3,P=!a&&(e==="auto"||t>0&&!this.manual&&v>t);return P&&(o=Math.sin(this.elapsed*.9),d=Math.sin(this.elapsed*.45)*.35),a&&!this.manual&&(o=0,d=0),this.pose.x=this.springX.step(o,i),this.pose.y=this.springY.step(d,i),this.pose.bob=r>0&&!a?Math.sin(this.elapsed*1.15):0,this.pose.energy=Math.min(1,Math.hypot(this.pose.x,this.pose.y)),this.pose.source=this.gyroLive?"gyro":P?"sweep":this.manual?"pointer":"rest",this.pose}destroy(){this.detach()}}function k(n,i,e){return n<i?i:n>e?e:n}const ue={orientation:"auto",axis:"auto",lenticules:96,parallax:1,interlace:.22,blend:.35,sheen:.35,lens:.5,tilt:14,float:8,radius:20,motion:"pointer",idleSweep:2600,fit:"cover",respectReducedMotion:!0},U=6,fe=`
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;function me(n){if(n===1)return"  return texture2D(uTex0, fitUv(uv, uFit0));";const i=[];for(let e=0;e<n;e++){const t=e===n-1?"else":`${e===0?"if":"else if"} (idx < ${e}.5)`;i.push(`  ${t} { return texture2D(uTex${e}, fitUv(uv, uFit${e})); }`)}return i.join(`
`)}function ge(n){return Array.from({length:n},(i,e)=>`uniform sampler2D uTex${e};
uniform vec2 uFit${e};`).join(`
`)}function pe(n){const i=Math.max(1,Math.min(n,U));return`
precision highp float;

varying vec2 vUv;

${ge(i)}

uniform float uCount;      // active frames
uniform float uLpi;        // lenticules across the card
uniform float uAngle;      // viewing angle along the parallax axis, -1..1
uniform float uParallax;   // how far the angle pushes through the stack
uniform float uSpread;     // how much of the stack one lenticule reveals (interlace)
uniform float uBlend;      // cross-frame softness
uniform float uSheen;      // ridge specular
uniform float uLens;       // ridge refraction
uniform float uAxis;       // 0 = vertical ridges, 1 = horizontal
uniform float uAA;         // pixel footprint in lenticule space, kills moire

vec2 fitUv(vec2 uv, vec2 fit) {
  return uv * fit + (0.5 - 0.5 * fit);
}

vec4 frameAt(float idx, vec2 uv) {
${me(i)}
}

void main() {
  vec2 uv = vUv;

  // Position inside the current lenticule, -0.5 .. 0.5.
  float coord = mix(uv.x, uv.y, uAxis);
  float f = fract(coord * uLpi) - 0.5;

  // A lenticule refracts: where you are under the ridge and where you are
  // standing both decide which slice of the stack reaches your eye.
  float view = clamp(f * 2.0 * uSpread + uAngle * uParallax, -1.0, 1.0);

  float last = max(uCount - 1.0, 0.0);
  float t = (view * 0.5 + 0.5) * last;
  float i0 = floor(t);
  float i1 = min(i0 + 1.0, last);
  float frac = t - i0;

  // Widen the crossover by the pixel footprint so fine interlaces stay smooth
  // instead of aliasing into moire bands.
  float edge = clamp(uBlend, 0.0, 1.0) * 0.5 + uAA;
  float w = edge < 0.0005 ? step(0.5, frac)
                          : smoothstep(0.5 - edge, 0.5 + edge, frac);

  // The ridge acts as a weak cylindrical lens across its own width.
  float mag = f * uLens / uLpi;
  vec2 lensOffset = mix(vec2(mag, 0.0), vec2(0.0, mag), uAxis);
  vec2 suv = clamp(uv + lensOffset, 0.0, 1.0);

  vec3 color = mix(frameAt(i0, suv), frameAt(i1, suv), w).rgb;

  // Plastic: a highlight down the crown of each ridge, a seam in each valley.
  float crown = pow(1.0 - min(abs(f) * 2.0, 1.0), 6.0);
  color += crown * uSheen * (0.35 + 0.65 * (uAngle * 0.5 + 0.5)) * 0.5;
  color *= 1.0 - smoothstep(0.40, 0.5, abs(f)) * uSheen * 0.30;

  gl_FragColor = vec4(color, 1.0);
}
`}function j(n,i,e){const t=n.createShader(i);if(!t)throw new Error("lenticard: could not create shader");if(n.shaderSource(t,e),n.compileShader(t),!n.getShaderParameter(t,n.COMPILE_STATUS)){const r=n.getShaderInfoLog(t);throw n.deleteShader(t),new Error(`lenticard: shader failed to compile - ${r}`)}return t}class ve{constructor(i){s(this,"canvas");s(this,"gl");s(this,"program",null);s(this,"buffer",null);s(this,"textures",[]);s(this,"frames",[]);s(this,"uniforms",new Map);s(this,"frameCount",0);s(this,"lost",!1);s(this,"width",1);s(this,"height",1);s(this,"onLost",i=>{i.preventDefault(),this.lost=!0});s(this,"onRestored",()=>{this.lost=!1,this.program=null,this.frameCount=0,this.textures=[],this.uniforms.clear(),this.frames.length&&this.setFrames(this.frames)});this.canvas=i;const e={alpha:!1,antialias:!1,depth:!1,stencil:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!0,powerPreference:"high-performance"},t=i.getContext("webgl",e)||i.getContext("experimental-webgl",e);if(!t)throw new Error("lenticard: WebGL is unavailable");this.gl=t,i.addEventListener("webglcontextlost",this.onLost),i.addEventListener("webglcontextrestored",this.onRestored);const r=new Float32Array([-1,-1,3,-1,-1,3]);this.buffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.buffer),t.bufferData(t.ARRAY_BUFFER,r,t.STATIC_DRAW),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,1)}get isLost(){return this.lost}ensureProgram(i){if(this.program&&this.frameCount===i)return;const e=this.gl;this.program&&e.deleteProgram(this.program);const t=j(e,e.VERTEX_SHADER,fe),r=j(e,e.FRAGMENT_SHADER,pe(i)),a=e.createProgram();if(!a)throw new Error("lenticard: could not create program");if(e.attachShader(a,t),e.attachShader(a,r),e.linkProgram(a),e.deleteShader(t),e.deleteShader(r),!e.getProgramParameter(a,e.LINK_STATUS)){const d=e.getProgramInfoLog(a);throw e.deleteProgram(a),new Error(`lenticard: program failed to link - ${d}`)}this.program=a,this.frameCount=i,this.uniforms.clear(),e.useProgram(a);const o=e.getAttribLocation(a,"aPosition");e.bindBuffer(e.ARRAY_BUFFER,this.buffer),e.enableVertexAttribArray(o),e.vertexAttribPointer(o,2,e.FLOAT,!1,0,0)}uniform(i){return this.uniforms.has(i)||this.uniforms.set(i,this.gl.getUniformLocation(this.program,i)),this.uniforms.get(i)}setFrames(i){const e=this.gl,t=i.slice(0,U);if(this.frames=t,!!t.length){this.ensureProgram(t.length),e.useProgram(this.program);for(const r of this.textures)e.deleteTexture(r);this.textures=t.map((r,a)=>{const o=e.createTexture();return e.activeTexture(e.TEXTURE0+a),e.bindTexture(e.TEXTURE_2D,o),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,r.source),e.uniform1i(this.uniform(`uTex${a}`),a),o})}}resize(i,e,t){const r=Math.max(1,Math.round(i*t)),a=Math.max(1,Math.round(e*t));r===this.width&&a===this.height||(this.width=r,this.height=a,this.canvas.width=r,this.canvas.height=a,this.gl.viewport(0,0,r,a))}fitFor(i,e,t){const r=i.width/i.height;if(!isFinite(r)||r<=0)return[1,1];const a=r>e,o=a?e/r:r/e;return t==="cover"?a?[o,1]:[1,o]:a?[1,1/o]:[1/o,1]}render(i){if(this.lost||!this.program||!this.frames.length)return;const e=this.gl;e.useProgram(this.program);const t=this.width/this.height;this.frames.forEach((o,d)=>{const[v,P]=this.fitFor(o,t,i.fit);e.uniform2f(this.uniform(`uFit${d}`),v,P),e.activeTexture(e.TEXTURE0+d),e.bindTexture(e.TEXTURE_2D,this.textures[d]),e.uniform1i(this.uniform(`uTex${d}`),d)});const r=i.axis===0?this.width:this.height,a=Math.min(.5,i.lenticules/Math.max(r,1));e.uniform1f(this.uniform("uCount"),this.frames.length),e.uniform1f(this.uniform("uLpi"),i.lenticules),e.uniform1f(this.uniform("uAngle"),i.angle),e.uniform1f(this.uniform("uParallax"),i.parallax),e.uniform1f(this.uniform("uSpread"),i.interlace),e.uniform1f(this.uniform("uBlend"),i.blend),e.uniform1f(this.uniform("uSheen"),i.sheen),e.uniform1f(this.uniform("uLens"),i.lens),e.uniform1f(this.uniform("uAxis"),i.axis),e.uniform1f(this.uniform("uAA"),a),e.drawArrays(e.TRIANGLES,0,3)}dispose(){var e;const i=this.gl;this.canvas.removeEventListener("webglcontextlost",this.onLost),this.canvas.removeEventListener("webglcontextrestored",this.onRestored);for(const t of this.textures)i.deleteTexture(t);this.program&&i.deleteProgram(this.program),this.buffer&&i.deleteBuffer(this.buffer),this.textures=[],this.frames=[],(e=i.getExtension("WEBGL_lose_context"))==null||e.loseContext()}}const q="lenticard-styles",ye=`
.lc-root {
  --lc-radius: 20px;
  --lc-tilt-x: 0deg;
  --lc-tilt-y: 0deg;
  --lc-lift: 0px;
  --lc-glare-x: 50%;
  --lc-glare-y: 50%;
  --lc-glare: 0;
  --lc-energy: 0;
  --lc-sheen: 0.35;
  --lc-shadow: rgba(8, 10, 24, 0.45);

  /* Must not shrink-to-fit: the canvas sizes itself from the card, so a
     shrink-wrapping root would feed its own width back in and collapse. */
  display: block;
  width: 100%;
  position: relative;
  max-width: 100%;
  font: inherit;
  -webkit-tap-highlight-color: transparent;
}

.lc-stage {
  position: relative;
  perspective: 1400px;
  perspective-origin: 50% 50%;
  width: 100%;
}

.lc-card {
  position: relative;
  width: 100%;
  aspect-ratio: var(--lc-aspect, 1.5);
  border-radius: var(--lc-radius);
  overflow: hidden;
  transform-style: preserve-3d;
  transform:
    translate3d(0, var(--lc-lift), 0)
    rotateX(var(--lc-tilt-x))
    rotateY(var(--lc-tilt-y));
  will-change: transform;
  isolation: isolate;
  background: #0b0d16;
  box-shadow:
    0 1px 1px rgba(255, 255, 255, 0.14) inset,
    0 0 0 1px rgba(255, 255, 255, 0.08) inset,
    0 2px 6px rgba(8, 10, 24, 0.28),
    0 24px 60px -18px var(--lc-shadow);
}

/* A round card ignores the radius setting and takes the shadow with it. */
.lc-root[data-orientation='circle'] .lc-card { border-radius: 50%; }
.lc-root[data-orientation='circle'] .lc-shadow {
  left: 14%;
  right: 14%;
  bottom: -4%;
}

.lc-canvas {
  /* Absolute, so the canvas never contributes to layout at all. */
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  border-radius: inherit;
}

/* Every overlay is inert: the card must stay one pointer target. */
.lc-card > .lc-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
}

/* The bright spot that tracks the pointer across the laminate. */
.lc-glare {
  background: radial-gradient(
    58% 58% at var(--lc-glare-x) var(--lc-glare-y),
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0.12) 42%,
    rgba(255, 255, 255, 0) 72%
  );
  mix-blend-mode: soft-light;
  opacity: calc(0.35 + 0.65 * var(--lc-glare));
  transition: opacity 220ms ease;
}

/* A second, tighter band that only shows up at real tilt. */
.lc-flare {
  background: linear-gradient(
    var(--lc-flare-angle, 105deg),
    transparent 32%,
    rgba(255, 255, 255, 0.22) 47%,
    rgba(190, 225, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.22) 53%,
    transparent 68%
  );
  mix-blend-mode: plus-lighter;
  opacity: calc(0.5 * var(--lc-energy));
}

/* Physical ridge texture, kept under the shader's own sheen. */
.lc-ridges {
  background-image: repeating-linear-gradient(
    var(--lc-ridge-angle, 90deg),
    rgba(255, 255, 255, 0.055) 0 1px,
    rgba(0, 0, 0, 0.05) 1px 2px,
    transparent 2px var(--lc-ridge-pitch, 4px)
  );
  opacity: calc(0.5 * var(--lc-sheen));
  mix-blend-mode: overlay;
}

/* Printed edge: a bright top lip and a dark bottom one read as thickness. */
.lc-edge {
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.22) inset,
    0 -1px 0 rgba(0, 0, 0, 0.32) inset,
    0 0 0 1px rgba(255, 255, 255, 0.06) inset;
}

/* Held in the hand, the shadow drops further away and softens — the card is
   reading as further off the surface than a cursor ever lifts it. */
.lc-root[data-held='true'] .lc-shadow {
  filter: blur(26px);
  bottom: -11%;
}

.lc-shadow {
  position: absolute;
  left: 8%;
  right: 8%;
  bottom: -6%;
  height: 14%;
  border-radius: 50%;
  background: radial-gradient(50% 50% at 50% 50%, var(--lc-shadow), transparent 72%);
  filter: blur(18px);
  transform: translate3d(calc(var(--lc-shadow-x, 0) * 1px), 0, 0)
             scale(calc(1 - 0.12 * var(--lc-energy)));
  opacity: calc(0.75 - 0.2 * var(--lc-energy));
  pointer-events: none;
  z-index: -1;
}

.lc-caption {
  margin: 14px 2px 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  letter-spacing: 0.01em;
  opacity: 0.7;
  text-align: center;
}

.lc-root[data-state='loading'] .lc-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, #131725 30%, #1e2436 50%, #131725 70%);
  background-size: 220% 100%;
  animation: lc-shimmer 1.4s ease-in-out infinite;
}

.lc-root[data-state='error'] .lc-card {
  display: grid;
  place-items: center;
  padding: 24px;
  background: #1a1320;
  color: #ffb4b4;
  font-size: 0.8125rem;
  text-align: center;
}

@keyframes lc-shimmer {
  from { background-position: 120% 0; }
  to   { background-position: -120% 0; }
}

/* CSS-mask fallback: real strip interlacing for machines without WebGL. */
.lc-fallback { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; }
.lc-fallback-layer {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  will-change: mask-position, -webkit-mask-position;
}

@media (prefers-reduced-motion: reduce) {
  .lc-card { transition: none; }
  .lc-root[data-reduced='true'] .lc-card { transform: none; }
}
`;function be(n=document){if(n.getElementById(q))return;const i=n.createElement("style");i.id=q,i.textContent=ye,n.head.appendChild(i)}function V(n){return{...ue,...n}}function O(){return typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches}function xe(n,i){const e=typeof n=="string"?document.querySelector(n):n;if(!e)throw new Error("lenticard: mount target not found");be(e.ownerDocument??document);let t=V(i);const r=document.createElement("div");r.className=["lc-root",t.className].filter(Boolean).join(" "),r.dataset.state="loading";const a=document.createElement("div");a.className="lc-stage";const o=document.createElement("div");o.className="lc-card";const d=document.createElement("canvas");d.className="lc-canvas",o.appendChild(d);const v=h=>{const l=document.createElement("div");return l.className=`lc-layer ${h}`,o.appendChild(l),l};v("lc-ridges"),v("lc-glare"),v("lc-flare"),v("lc-edge");const P=document.createElement("div");P.className="lc-shadow",a.append(o,P),r.appendChild(a);let y=null;const ee=()=>{t.caption?(y||(y=document.createElement("figcaption"),y.className="lc-caption",r.appendChild(y)),y.textContent=t.caption):(y==null||y.remove(),y=null)};ee(),e.appendChild(r);let g,te=!1;try{g=new ve(d)}catch{d.remove(),g=new ce(o),te=!0}const R=new de(o,{mode:t.motion,idleSweep:t.idleSweep,float:t.float,reducedMotion:t.respectReducedMotion&&O()});let E="landscape",f="vertical",X=m.landscape,M=[],D=0,F=!1,_=!0;function N(){r.dataset.orientation=E,r.dataset.axis=f,r.style.setProperty("--lc-aspect",String(X)),r.style.setProperty("--lc-radius",`${t.radius}px`),r.style.setProperty("--lc-sheen",String(t.sheen)),r.style.setProperty("--lc-ridge-angle",f==="vertical"?"90deg":"0deg"),r.style.setProperty("--lc-flare-angle",f==="vertical"?"105deg":"15deg"),r.dataset.reduced=String(t.respectReducedMotion&&O())}async function ie(h){var b,x;const l=++D;r.dataset.state="loading";const c=(h??[]).slice(0,U);if(!c.length){r.dataset.state="empty";return}try{const w=await Promise.all(c.map(he));if(l!==D||F){w.forEach(I);return}M.forEach(I),M=w;const B=L(w);E=G(t.orientation,B),f=W(t.axis,E),X=m[E],N(),$(),g.setFrames(w),u.axis=f==="vertical"?0:1,g.render(u),A=0,T(),r.dataset.state="ready",(b=t.onReady)==null||b.call(t,{orientation:E,axis:f,aspect:B})}catch(w){if(l!==D||F)return;r.dataset.state="error",o.textContent=w.message??"lenticard: failed to load frames",(x=t.onError)==null||x.call(t,w)}}function $(){const h=o.offsetWidth,l=o.offsetHeight;if(!h||!l)return;const c=Math.min(window.devicePixelRatio||1,2);g.resize(h,l,c),u.axis=f==="vertical"?0:1,g.render(u),T();const b=f==="vertical"?h:l;r.style.setProperty("--lc-ridge-pitch",`${Math.max(2,b/Math.max(t.lenticules,1)).toFixed(2)}px`),A=0}let S=0,C=0,A=0;const u={angle:0,lenticules:t.lenticules,parallax:t.parallax,interlace:t.interlace,blend:t.blend,sheen:t.sheen,lens:t.lens,axis:0,fit:t.fit};function re(h){const l=C?Math.min((h-C)/1e3,.1):.016666666666666666;C=h;const c=R.step(l),b=k(f==="vertical"?c.x:c.y,-1,1),x=c.source==="gyro",w=c.x*t.tilt*(x?1.25:1),B=-c.y*t.tilt*(x?1.25:1),Le=-c.energy*(x?20:6)+c.bob*t.float*(x?1.4:1);r.style.setProperty("--lc-tilt-y",`${w.toFixed(3)}deg`),r.style.setProperty("--lc-tilt-x",`${B.toFixed(3)}deg`),r.style.setProperty("--lc-lift",`${Le.toFixed(2)}px`),r.style.setProperty("--lc-glare-x",`${(50+c.x*42).toFixed(2)}%`),r.style.setProperty("--lc-glare-y",`${(50+c.y*42).toFixed(2)}%`),r.style.setProperty("--lc-glare",c.energy.toFixed(3)),r.style.setProperty("--lc-energy",c.energy.toFixed(3)),r.style.setProperty("--lc-shadow-x",(-c.x*(x?26:14)).toFixed(2)),r.dataset.held=x?"true":"false";const Pe=Math.abs(b-u.angle)>4e-4;u.angle=b,u.axis=f==="vertical"?0:1,Pe?A=0:A++,A<3&&g.render(u)}function ne(h){S=requestAnimationFrame(ne),re(h),(!_||document.hidden)&&Y()}function ae(){performance.now()-C>90&&re(performance.now())}o.addEventListener("pointermove",ae,{passive:!0});function T(){S||F||!_||document.hidden||(C=0,A=0,S=requestAnimationFrame(ne))}function Y(){S&&(cancelAnimationFrame(S),S=0)}const se=()=>document.hidden?Y():T();document.addEventListener("visibilitychange",se);const oe=new ResizeObserver(()=>$());oe.observe(o);const le=new IntersectionObserver(h=>{const l=h[h.length-1],c=l.boundingClientRect;c.width===0||c.height===0||(_=l.isIntersecting,_&&T())},{threshold:0});return le.observe(r),N(),ie(t.images),T(),{element:r,get orientation(){return E},get axis(){return f},get canvas(){return g.canvas},update(h){const l=Object.fromEntries(Object.entries(h).filter(([,b])=>b!==void 0)),c=l.images!==void 0&&l.images!==t.images;t=V({...t,...l}),u.lenticules=t.lenticules,u.parallax=t.parallax,u.interlace=t.interlace,u.blend=t.blend,u.sheen=t.sheen,u.lens=t.lens,u.fit=t.fit,R.setOptions({mode:t.motion,idleSweep:t.idleSweep,float:t.float,reducedMotion:t.respectReducedMotion&&O()}),l.className!==void 0&&(r.className=["lc-root",t.className].filter(Boolean).join(" ")),l.caption!==void 0&&ee(),c?ie(t.images):(l.orientation!==void 0||l.axis!==void 0)&&(E=G(t.orientation,L(M)),f=W(t.axis),X=m[E],$()),N(),A=0,T()},setAngle(h,l,c=!1){R.setOptions({mode:"none"}),R.setAngle(h,l,c),A=0,T()},async enableGyro(){const h=await R.enableGyro();return h&&(t={...t,motion:"gyro"}),h},toBlob(h="image/png",l){return new Promise(c=>{if(te)return c(null);g.render(u),g.canvas.toBlob(c,h,l)})},destroy(){F=!0,Y(),document.removeEventListener("visibilitychange",se),o.removeEventListener("pointermove",ae),oe.disconnect(),le.disconnect(),R.destroy(),g.dispose(),M.forEach(I),M=[],r.remove()}}}const K=["lenticules","parallax","interlace","blend","sheen","lens","tilt","float","radius"],J=["orientation","axis","motion","caption","fit"],we={"idle-sweep":"idleSweep"},Ee=/,\s*(?=(?:https?:\/\/|data:|blob:|\/|\.{1,2}\/))/;function Ae(n){if(!n)return[];const i=n.trim();if(i.startsWith("["))try{const t=JSON.parse(i);if(Array.isArray(t))return t.filter(r=>typeof r=="string")}catch{}return(/[\r\n]/.test(i)?i.split(/[\r\n]+/):/data:|blob:/.test(i)?i.split(Ee):i.split(",")).map(t=>t.trim()).filter(Boolean)}class Q extends HTMLElement{constructor(){super(...arguments);s(this,"card",null);s(this,"mount",null);s(this,"imagesOverride",null)}static get observedAttributes(){return["images","idle-sweep",...K,...J]}get images(){return this.imagesOverride??Ae(this.getAttribute("images"))}set images(e){var t;this.imagesOverride=e,(t=this.card)==null||t.update({images:e})}get instance(){return this.card}connectedCallback(){this.card||(this.style.display||(this.style.display="block"),this.mount=document.createElement("div"),this.appendChild(this.mount),this.card=xe(this.mount,this.readOptions()))}disconnectedCallback(){var e,t;(e=this.card)==null||e.destroy(),this.card=null,(t=this.mount)==null||t.remove(),this.mount=null}attributeChangedCallback(e){if(this.card){if(e==="images"){this.imagesOverride=null,this.card.update({images:this.images});return}this.card.update(this.readOptions())}}readOptions(){const e={images:this.images};for(const t of K){const r=this.getAttribute(t);if(r===null)continue;const a=Number(r);Number.isFinite(a)&&(e[t]=a)}for(const t of J){const r=this.getAttribute(t);r!==null&&(e[t]=r)}for(const[t,r]of Object.entries(we)){const a=this.getAttribute(t);if(a===null)continue;const o=Number(a);Number.isFinite(o)&&(e[r]=o)}return e}}function Z(n="lenticular-card"){typeof customElements>"u"||customElements.get(n)||customElements.define(n,Q)}return Z(),p.LenticularCardElement=Q,p.defineLenticularCard=Z,Object.defineProperty(p,Symbol.toStringTag,{value:"Module"}),p})({});
//# sourceMappingURL=lenticard-element.iife.js.map

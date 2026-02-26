/* GALAXY */
const canvas=document.getElementById("galaxy");
if(canvas){
  const ctx=canvas.getContext("2d");
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  let stars=[];
  for(let i=0;i<400;i++){
    stars.push({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      size:Math.random()*2,
      speed:Math.random()*0.5
    });
  }
  function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    stars.forEach(star=>{
      star.y+=star.speed;
      if(star.y>canvas.height)star.y=0;
      ctx.beginPath();
      ctx.arc(star.x,star.y,star.size,0,Math.PI*2);
      ctx.fillStyle="white";
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ARTIFACT DATA */
const artifacts=[
  {title:"Ceramic Artifact", desc:"Ancient ceramic piece used for rituals.", age:"1200 Years"},
  {title:"Clay Fragment", desc:"Historical clay structure fragment.", age:"1500 Years"},
  {title:"Roman Statue", desc:"Marble statue fragment.", age:"1800 Years"},
  {title:"Metal Jug", desc:"Ancient storage container.", age:"1400 Years"},
  {title:"Stone Head", desc:"Carved mythological sculpture.", age:"2200 Years"},
  {title:"Ceramic Bowl", desc:"Decorative medieval bowl.", age:"1000 Years"},
  {title:"Ancient Mask", desc:"Ceremonial ritual mask.", age:"2000 Years"},
  {title:"Bronze Object", desc:"Decorative bronze artifact.", age:"1700 Years"}
];

const gallery=document.getElementById("artifactGallery");

if(gallery){
  artifacts.forEach((artifact,i)=>{
    const card=document.createElement("div");
    card.className="artifact-card";
    card.innerHTML=`
      <img src="images/art${i+1}.jpeg">
      <div class="artifact-overlay">
        <h3>${artifact.title}</h3>
        <p>${artifact.age}</p>
      </div>
    `;
    card.onclick=()=>openModal(i);
    gallery.appendChild(card);
  });
}

function openModal(i){
  document.getElementById("modalImage").src=`images/art${i+1}.jpeg`;
  document.getElementById("modalTitle").innerText=artifacts[i].title;
  document.getElementById("modalDesc").innerText=artifacts[i].desc;
  document.getElementById("modalAge").innerText="Estimated Age: "+artifacts[i].age;
  document.getElementById("artifactModal").style.display="flex";
}

function closeModal(){
  document.getElementById("artifactModal").style.display="none";
}

/* AI RECONSTRUCTION */
async function restoreAI(){
  const img=document.getElementById("modalImage");
  const result=document.getElementById("aiResult");

  result.innerHTML="Reconstructing...";

  const response=await fetch(img.src);
  const blob=await response.blob();
  const formData=new FormData();
  formData.append("image",blob);

  const aiResponse=await fetch("/reconstruct",{
    method:"POST",
    body:formData
  });

  const data=await aiResponse.json();

  result.innerHTML=`
    <h3>Reconstructed Version</h3>
    <img id="reconstructedImg"
         src="data:image/png;base64,${data.reconstructed}"
         style="width:100%;border-radius:15px;margin-top:10px;">
    <button class="save-btn" onclick="saveImage()">💾 Save Image</button>
  `;
}

function saveImage(){
  const img=document.getElementById("reconstructedImg");
  const link=document.createElement("a");
  link.href=img.src;
  link.download="reconstructed_artifact.png";
  link.click();
}
async function detectAgeAI() {
  const img = document.getElementById("modalImage");
  const result = document.getElementById("aiResult");

  result.innerHTML = "Detecting age...";

  const response = await fetch(img.src);
  const blob = await response.blob();
  const formData = new FormData();
  formData.append("image", blob);

  const aiResponse = await fetch("/detect-age", {
    method: "POST",
    body: formData
  });

  const data = await aiResponse.json();

  result.innerHTML = `
    <h3>🕰 AI Age Detection</h3>
    <p>${data.age}</p>
  `;
}
async function generate3DAI() {
  const img = document.getElementById("modalImage");
  const result = document.getElementById("aiResult");

  result.innerHTML = "Generating 3D Model...";

  const response = await fetch(img.src);
  const blob = await response.blob();
  const formData = new FormData();
  formData.append("image", blob);

  const aiResponse = await fetch("/generate-3d", {
    method: "POST",
    body: formData
  });

  const data = await aiResponse.json();

  result.innerHTML = `
    <h3>🧊 3D Generated Model</h3>
    <img src="data:image/png;base64,${data.model3d}"
         style="width:100%;border-radius:15px;margin-top:10px;">
  `;
}
/* ===== Fundo animado ===== */
const canvas=document.getElementById("bgCanvas");
const ctx=canvas.getContext("2d");
function resizeCanvas(){canvas.width=innerWidth;canvas.height=innerHeight;}
resizeCanvas(); window.addEventListener('resize',resizeCanvas);
let particles=[];
for(let i=0;i<70;i++) particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*2+1,dx:(Math.random()-0.5)*0.4,dy:(Math.random()-0.5)*0.4});
function animate(){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle="rgba(255,255,255,0.7)";for(let p of particles){ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();p.x+=p.dx;p.y+=p.dy;if(p.x<0||p.x>canvas.width)p.dx*=-1;if(p.y<0||p.y>canvas.height)p.dy*=-1;}requestAnimationFrame(animate);}
animate();

/* ===== Cronômetro ===== */
let timer=null, seconds=0, running=false;
const cronometro=document.getElementById("cronometro");
function updateDisplay(){const h=String(Math.floor(seconds/3600)).padStart(2,"0");const m=String(Math.floor((seconds%3600)/60)).padStart(2,"0");const s=String(seconds%60).padStart(2,"0");cronometro.textContent=`${h}:${m}:${s}`;}
function startTimer(){if(!running){running=true;timer=setInterval(()=>{seconds++;updateDisplay()},1000);}}
function pauseTimer(){running=false;clearInterval(timer);}
function resetTimer(){running=false;clearInterval(timer);seconds=0;updateDisplay();}

/* ===== Tema escuro/claro ===== */
const body=document.body;
const themeBtn=document.getElementById("themeToggle");
let dark=true;
themeBtn.addEventListener('click',()=>{dark=!dark;body.classList.toggle("light-theme",!dark);themeBtn.textContent=dark?"🌙":"☀️";});

/* ===== Tópicos ===== */
const topicsData=[
  {title:"1. Introdução ao Java", exercise:"Instale o JDK e crie seu HelloWorld.java."},
  {title:"2. Variáveis e Tipos de Dados", exercise:"Crie variáveis int, double, String e boolean e imprima seus valores."},
  {title:"3. Operadores Aritméticos e Lógicos", exercise:"Crie uma calculadora simples que soma, subtrai, multiplica e divide dois números."},
  {title:"4. Estruturas Condicionais (if, else, switch)", exercise:"Leia a idade de uma pessoa e diga se é maior de idade."},
  {title:"5. Estruturas de Repetição (for, while, do-while)", exercise:"Mostre números de 1 a 100 usando for."},
  {title:"6. Arrays e Matrizes", exercise:"Crie um vetor de 5 números e some todos."},
  {title:"7. Métodos e Funções", exercise:"Crie um método que recebe dois números e retorna o maior."},
  {title:"8. Classes e Objetos", exercise:"Crie uma classe Carro com marca, modelo e ano."},
  {title:"9. Construtores e Encapsulamento", exercise:"Crie uma classe com construtor e métodos get/set."},
  {title:"10. Herança e Polimorfismo", exercise:"Crie Animal, Cachorro e Gato com comportamentos diferentes."},
  {title:"11. Interfaces e Classes Abstratas", exercise:"Crie interface Pagável e classe Fatura que a implemente."},
  {title:"12. Collections (List, Set, Map)", exercise:"Use ArrayList para armazenar nomes e exibir todos."},
  {title:"13. Tratamento de Exceções", exercise:"Divida dois números e trate divisão por zero."},
  {title:"14. Arquivos (FileReader e FileWriter)", exercise:"Leia e escreva em um arquivo de texto."},
  {title:"15. POO Avançada", exercise:"Combine herança, polimorfismo e encapsulamento em um sistema."}
];

const topicsContainer=document.getElementById("topics");
topicsData.forEach(data=>{
  const li=document.createElement("li");
  li.className="topic"; 
  li.innerHTML=`
    <div class="topic-header">
      <span class="title" onclick="toggleExercise(this)">${data.title}</span>
      <button class="btn-done" onclick="toggleDone(this)">✅</button>
    </div>
    <div class="exercise">
      <p>Exercício: ${data.exercise}</p>
      <textarea></textarea>
      <button onclick="checkAnswer(this)">Marcar como feito</button>
    </div>`;
  topicsContainer.appendChild(li);
});

/* Toggle exercícios */
function toggleExercise(el){
  const exercise=el.closest(".topic").querySelector(".exercise");
  exercise.style.display=exercise.style.display==="block"?"none":"block";
}

/* Pontuação e barra */
const progressFill=document.getElementById("progressFill");
const progressText=document.getElementById("progressText");
const scoreEl=document.getElementById("score");
function updateProgress(){
  const topics=document.querySelectorAll(".topic");
  const doneTopics=document.querySelectorAll(".topic.done").length;
  const percent=Math.round((doneTopics/topics.length)*100);
  progressFill.style.width=percent+"%";
  progressText.textContent=percent+"%";
  scoreEl.textContent="Pontuação: "+(doneTopics*10);

  // Flash animação
  progressFill.style.animation="progressFlash 0.6s";
  setTimeout(()=>{progressFill.style.animation="";},600);
}
function toggleDone(btn){
  const li=btn.closest(".topic");
  li.classList.toggle("done"); 
  // Confete
  if(li.classList.contains("done")) showConfetti();
  updateProgress();
}
function checkAnswer(btn){
  const li=btn.closest(".topic");
  if(!li.classList.contains("done")) li.classList.add("done");
  showConfetti();
  updateProgress();
}

/* ===== Diário estilo Chat ===== */
const chatBox=document.getElementById("chatBox");
const chatInput=document.getElementById("chatInput");
const sendBtn=document.getElementById("sendBtn");
const resetChatBtn=document.getElementById("resetChatBtn");

if(localStorage.getItem("chatHistory")) chatBox.innerHTML=localStorage.getItem("chatHistory");

function addMessage(text, type){
  const div=document.createElement("div");
  div.className="chat-message "+type;
  div.textContent=text;
  chatBox.appendChild(div);
  chatBox.scrollTop=chatBox.scrollHeight;
  saveChat();
}

function saveChat(){localStorage.setItem("chatHistory",chatBox.innerHTML);}

// Enviar mensagem com feedback
sendBtn.addEventListener('click',()=>{
  const txt=chatInput.value.trim();
  if(txt){
    addMessage(txt,"chat-user");
    chatInput.value="";
    setTimeout(()=>{addMessage("Mensagem registrada ✅","chat-system");},200);
  }
});

// Resetar diário
resetChatBtn.addEventListener('click',()=>{
  if(confirm("Tem certeza que deseja limpar o diário?")){
    chatBox.innerHTML="";
    localStorage.removeItem("chatHistory");
  }
});

// Enter envia
chatInput.addEventListener('keypress',(e)=>{
  if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendBtn.click();}
});

/* ===== Confete simples ===== */
function showConfetti(){
  for(let i=0;i<20;i++){
    const c=document.createElement("div");
    c.style.position="fixed";
    c.style.width="6px";
    c.style.height="6px";
    c.style.background=["#f44336","#ffeb3b","#4caf50","#2196f3","#ff9800"][Math.floor(Math.random()*5)];
    c.style.left=(Math.random()*window.innerWidth)+"px";
    c.style.top="0px";
    c.style.borderRadius="50%";
    c.style.zIndex=9999;
    c.style.opacity=1;
    document.body.appendChild(c);
    let fall=Math.random()*3+2;
    let rot=Math.random()*10;
    const anim=setInterval(()=>{
      c.style.top=parseFloat(c.style.top)+fall+"px";
      c.style.transform=`rotate(${rot}deg)`;
      rot+=5;
      if(parseFloat(c.style.top)>window.innerHeight){c.remove(); clearInterval(anim);}
    },16);
  }
}

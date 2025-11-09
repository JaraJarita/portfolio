const navToggle=document.getElementById('navToggle');
const mainNav=document.getElementById('mainNav');
navToggle?.addEventListener('click',()=>{
  const visible=mainNav.style.display==='flex';
  mainNav.style.display=visible?'none':'flex';
});

const yearEl=document.getElementById('year');
if(yearEl){yearEl.textContent=String(new Date().getFullYear());}

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    if(!id) return; 
    const el=document.querySelector(id);
    if(!el) return;
    e.preventDefault();
    el.scrollIntoView({behavior:'smooth'});
    if(window.innerWidth<=640){mainNav.style.display='none';}
  });
});

const form=document.getElementById('contactForm');
const statusEl=document.getElementById('formStatus');
const FORMSPREE=window.FORMSPREE_ENDPOINT||'';
const CONTACT_EMAIL=window.CONTACT_EMAIL||'';

async function submitViaFormspree(data){
  const res=await fetch(FORMSPREE,{method:'POST',headers:{'Accept':'application/json'},body:data});
  if(res.ok){return {ok:true}}
  const j=await res.json().catch(()=>({}));
  return {ok:false,err:j.errors?.map(e=>e.message).join(', ')||'Error al enviar'}
}

function submitViaMailto(name,email,message){
  const subject=encodeURIComponent('Contacto desde portafolio');
  const body=encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\n${message}`);
  const href=`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  window.location.href=href;
  return {ok:true}
}

form?.addEventListener('submit',async e=>{
  // Si hay action (FormSubmit u otro) dejamos que el navegador envíe el formulario
  if(form.getAttribute('action')){
    statusEl.textContent='Enviando...';
    return; // no preventDefault
  }
  e.preventDefault();
  statusEl.textContent='Enviando...';
  const formData=new FormData(form);
  const name=formData.get('name')?.toString().trim();
  const email=formData.get('email')?.toString().trim();
  const message=formData.get('message')?.toString().trim();

  try{
    if(FORMSPREE){
      const result=await submitViaFormspree(formData);
      if(result.ok){
        statusEl.textContent='¡Mensaje enviado! Te responderé pronto.';
        form.reset();
      }else{
        statusEl.textContent=result.err||'No se pudo enviar.';
      }
    }else if(CONTACT_EMAIL){
      submitViaMailto(name,email,message);
      statusEl.textContent='Abriendo tu cliente de correo...';
    }else{
      statusEl.textContent='Configura un email o Formspree.';
    }
  }catch(err){
    statusEl.textContent='Ocurrió un error. Intenta de nuevo.';
  }
});

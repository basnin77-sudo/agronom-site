'use strict';
const root=document.documentElement;
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused=motionQuery.matches;
const motionButton=document.getElementById('motion-toggle');
const header=document.getElementById('header');
const hero=document.querySelector('.hero');
const heroPicture=document.querySelector('.hero-picture');
const menuButton=document.querySelector('.menu-button');
const mobileMenu=document.getElementById('mobile-menu');
let scrollScheduled=false;
function paintScroll(){
  scrollScheduled=false;
  header.classList.toggle('is-scrolled',scrollY>35);
  if(!motionPaused&&scrollY<hero.offsetHeight)heroPicture.style.setProperty('--hero-shift',`${Math.min(scrollY*.12,75)}px`);
}
function scheduleScroll(){if(!scrollScheduled){scrollScheduled=true;requestAnimationFrame(paintScroll);}}
addEventListener('scroll',scheduleScroll,{passive:true});paintScroll();
function closeMenu(returnFocus=false){mobileMenu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Открыть меню');if(returnFocus)menuButton.focus();}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';mobileMenu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');});
mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileMenu.hidden)closeMenu(true);});
addEventListener('click',e=>{if(!mobileMenu.hidden&&!header.contains(e.target))closeMenu();});
function setMotion(paused){
  motionPaused=paused;root.classList.toggle('motion-paused',paused);
  motionButton.setAttribute('aria-pressed',String(paused));motionButton.setAttribute('aria-label',paused?'Включить анимацию':'Выключить анимацию');motionButton.querySelector('span').textContent=paused?'▷':'Ⅱ';
  if(paused)document.querySelectorAll('.counter').forEach(el=>{el.textContent=el.dataset.count;});
  scheduleScroll();
}
motionButton.addEventListener('click',()=>setMotion(!motionPaused));
motionQuery.addEventListener('change',e=>setMotion(e.matches));setMotion(motionPaused);
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});},{threshold:.08,rootMargin:'0px 0px -20px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  root.classList.add('js-motion');
  const counterObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    counterObserver.unobserve(entry.target);
    const element=entry.target,target=Number(element.dataset.count);
    if(motionPaused){element.textContent=String(target);return;}
    const start=performance.now();
    function frame(now){if(motionPaused){element.textContent=String(target);return;}const t=Math.min((now-start)/1200,1);element.textContent=String(Math.round(target*(1-Math.pow(1-t,3))));if(t<1)requestAnimationFrame(frame);}
    requestAnimationFrame(frame);
  });},{threshold:.8});
  document.querySelectorAll('.counter').forEach(el=>counterObserver.observe(el));
}
const demoView=document.getElementById('demo-view');
const calendarTemplate=demoView.innerHTML;
const demoTemplates={
 calendar:calendarTemplate,
 diagnosis:`<p class="demo-kicker">ПОСМОТРЕТЬ ВНИМАТЕЛЬНЕЕ</p><h3>Что расскажет<br>фотография?</h3><div class="demo-photo"><img src="assets/strawberries-premium-v2.webp" alt="Клубника — иллюстрация для демонстрации"><div class="demo-scan" aria-hidden="true"></div><span class="demo-photo-label">Снимите растение и проблемное место</span></div><div class="demo-info"><strong class="demo-mini-title">Фото → возможная причина → справочник</strong>В приложении результат анализа можно сравнить с описанием признаков.</div><p class="demo-tip">Это демонстрация сценария. Сайт не выполняет диагностику.</p>`,
 guide:`<p class="demo-kicker">СПРАВОЧНИК ПОД РУКОЙ</p><h3>Знакомые растения.<br>Понятные вопросы.</h3><div class="demo-guides"><div class="demo-guide-card"><img src="assets/tomato.svg" alt="Томат">Томат<span>Овощи</span></div><div class="demo-guide-card"><img src="assets/strawberry.svg" alt="Клубника">Клубника<span>Ягоды</span></div><div class="demo-guide-card"><img src="assets/apple.svg" alt="Яблоня">Яблоня<span>Плодовый сад</span></div><div class="demo-guide-card"><img src="assets/hp-monstera.svg" alt="Монстера">Монстера<span>Растения дома</span></div></div><div class="demo-info" style="margin-top:12px"><strong class="demo-mini-title">201 карточка в базе</strong>Признаки проблем, уход и полезные наблюдения.</div><p class="demo-tip">Пример материалов. Полный справочник — в приложении.</p>`,
 diary:`<p class="demo-kicker">ИСТОРИЯ ВАШЕГО САДА</p><h3>Замечать.<br>Сохранять. Растить.</h3><div class="demo-journal-header"><img src="assets/strawberry.svg" alt="Клубника"><div><strong>Моя клубника</strong><small>Пример дневника растения</small></div></div><div class="demo-entry"><strong>Первый цветок</strong><span>Наблюдение</span><p>Появились цветоносы. Добавили фотографию.</p></div><div class="demo-entry"><strong>Первые ягоды</strong><span>Урожай</span><p>Сохранили результат сезона.</p></div><div class="demo-entry"><strong>Планы на следующий год</strong><span>Заметка</span><p>Записали то, что хочется повторить.</p></div><p class="demo-tip">Все записи здесь условные. Создайте свою историю в приложении.</p>`
};
const featureTabs=[...document.querySelectorAll('.feature-tab')];
const featurePanel=document.getElementById('feature-panel');
function selectFeature(button,focus=false){
 const name=button.dataset.feature;if(!(name in demoTemplates))return;
 featureTabs.forEach(tab=>{const active=tab===button;tab.classList.toggle('is-active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});
 featurePanel.setAttribute('aria-labelledby',button.id);
 demoView.innerHTML=demoTemplates[name];
 if(!motionPaused&&typeof demoView.animate==='function')demoView.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});
 if(focus)button.focus();
}
featureTabs.forEach((button,index)=>{
 button.addEventListener('click',()=>selectFeature(button));
 button.addEventListener('keydown',e=>{let next;
  if(e.key==='ArrowDown'||e.key==='ArrowRight')next=(index+1)%featureTabs.length;
  if(e.key==='ArrowUp'||e.key==='ArrowLeft')next=(index+featureTabs.length-1)%featureTabs.length;
  if(e.key==='Home')next=0;if(e.key==='End')next=featureTabs.length-1;
  if(next!==undefined){e.preventDefault();selectFeature(featureTabs[next],true);}
 });
});
demoView.addEventListener('click',event=>{const task=event.target.closest('.demo-task');if(!task)return;task.setAttribute('aria-pressed',String(task.getAttribute('aria-pressed')!=='true'));});
const mobileQuery=matchMedia('(max-width: 950px)');
function setTabOrientation(){document.querySelector('.feature-tabs').setAttribute('aria-orientation','vertical');if(!mobileQuery.matches)closeMenu();}
mobileQuery.addEventListener('change',setTabOrientation);setTabOrientation();
const isAppleMobile=/iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
if(isAppleMobile){const message=document.getElementById('device-message');message.textContent='Вы открыли сайт на iPhone или iPad. APK предназначена для Android: откройте эту страницу на подходящем телефоне. Версия для iOS здесь пока не представлена.';message.hidden=false;}

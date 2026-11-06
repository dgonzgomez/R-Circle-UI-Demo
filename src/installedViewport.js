// With the default status bar, iOS positions the web view below the system bar.
// Use its layout height, never screen.height, which includes that system area.
export function installedIphoneHeight({standalone,iphone,viewportHeight}){
 if(!standalone||!iphone||!Number.isFinite(viewportHeight)||viewportHeight<=0)return null;
 return viewportHeight;
}

export function syncInstalledViewport(browser=window){
 const root=browser.document.documentElement;
 const standalone=browser.matchMedia('(display-mode: standalone)');
 const fullscreen=browser.matchMedia('(display-mode: fullscreen)');
 const update=()=>{
  const height=installedIphoneHeight({
   standalone:browser.navigator.standalone===true||standalone.matches||fullscreen.matches,
   iphone:/iPhone|iPod/.test(browser.navigator.userAgent||''),
   viewportHeight:browser.innerHeight,
  });
  if(height)root.style.setProperty('--installed-app-height',`${height}px`);
  else root.style.removeProperty('--installed-app-height');
 };
 update();
 browser.addEventListener('resize',update);
 browser.addEventListener('pageshow',update);
 standalone.addEventListener('change',update);
 fullscreen.addEventListener('change',update);
 browser.addEventListener('orientationchange',update);
 return()=>{
  browser.removeEventListener('resize',update);
  browser.removeEventListener('pageshow',update);
  standalone.removeEventListener('change',update);
  fullscreen.removeEventListener('change',update);
  browser.removeEventListener('orientationchange',update);
 };
}

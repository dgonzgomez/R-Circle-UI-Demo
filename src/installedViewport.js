// iOS can report a home-screen layout viewport shorter than the display.
// Size the installed canvas from the display, without resizing it for a keyboard.
export function installedIphoneHeight({standalone,iphone,screenWidth,screenHeight,portrait}){
 if(!standalone||!iphone||screenWidth<=0||screenHeight<=0)return null;
 return portrait?Math.max(screenWidth,screenHeight):Math.min(screenWidth,screenHeight);
}

export function syncInstalledViewport(browser=window){
 const root=browser.document.documentElement;
 const standalone=browser.matchMedia('(display-mode: standalone)');
 const fullscreen=browser.matchMedia('(display-mode: fullscreen)');
 const orientation=browser.matchMedia('(orientation: portrait)');
 const update=()=>{
  const height=installedIphoneHeight({
   standalone:browser.navigator.standalone===true||standalone.matches||fullscreen.matches,
   iphone:/iPhone|iPod/.test(browser.navigator.userAgent||''),
   screenWidth:browser.screen.width,screenHeight:browser.screen.height,
   portrait:orientation.matches,
  });
  if(height)root.style.setProperty('--installed-app-height',`${height}px`);
  else root.style.removeProperty('--installed-app-height');
 };
 update();
 browser.addEventListener('resize',update);
 browser.addEventListener('pageshow',update);
 standalone.addEventListener('change',update);
 fullscreen.addEventListener('change',update);
 orientation.addEventListener('change',update);
 return()=>{
  browser.removeEventListener('resize',update);
  browser.removeEventListener('pageshow',update);
  standalone.removeEventListener('change',update);
  fullscreen.removeEventListener('change',update);
  orientation.removeEventListener('change',update);
 };
}

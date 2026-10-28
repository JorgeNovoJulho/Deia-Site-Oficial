// Progressive enhancement: mark the current navigation destination.
function updateNavigation() {
  document.querySelectorAll('.nav a').forEach(link => {
    if (link.hash === location.hash) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('hashchange', updateNavigation);
updateNavigation();

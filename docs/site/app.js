/**
 * Zoffice Landing Page Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle')
  const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('zoffice-site-theme')
  if (savedTheme === 'light') {
    document.body.classList.remove('theme-dark')
    document.body.classList.add('theme-light')
    if (themeIcon) themeIcon.textContent = '🌙'
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.body.classList.contains('theme-light')
      if (isLight) {
        document.body.classList.remove('theme-light')
        document.body.classList.add('theme-dark')
        localStorage.setItem('zoffice-site-theme', 'dark')
        if (themeIcon) themeIcon.textContent = '☀️'
      } else {
        document.body.classList.remove('theme-dark')
        document.body.classList.add('theme-light')
        localStorage.setItem('zoffice-site-theme', 'light')
        if (themeIcon) themeIcon.textContent = '🌙'
      }
    })
  }

  // Interactive ribbon preview tabs
  const ribbonTabs = document.querySelectorAll('.ribbon-tabs .tab')
  ribbonTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      ribbonTabs.forEach((t) => t.classList.remove('active'))
      tab.classList.add('active')
    })
  })
})

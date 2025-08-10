// ===== 主题管理系统 =====
document.addEventListener('DOMContentLoaded', () => {
  // 初始化主题
  initTheme();
  
  // 监听系统主题变化
  const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  colorSchemeQuery.addEventListener('change', systemThemeChange);
});

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // 优先级: 用户设置 > 系统设置
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme(systemPrefersDark ? 'dark' : 'light');
  }
}

function setTheme(theme) {
  // 设置根元素的data-dark-mode属性
  document.documentElement.setAttribute('data-dark-mode', theme === 'dark');
  // 保留原有的data-theme属性以兼容其他代码
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  // 更新主题色元标签
  const metaThemeColor = document.querySelector("meta[name=theme-color]");
  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", theme === 'dark' ? '#121212' : '#f8f8f8');
  }
  
  // 更新UI状态
  updateThemeToggleUI(theme);
  
  // 派发主题变更事件
  const themeEvent = new CustomEvent('themeChanged', {
    detail: { theme: theme }
  });
  document.dispatchEvent(themeEvent);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

function updateThemeToggleUI(theme) {
  const themeToggle = document.querySelector('.toggle');
  if (!themeToggle) return;
  
  // 使用aria-pressed属性控制动画状态
  themeToggle.setAttribute('aria-pressed', theme === 'dark');
}

function systemThemeChange(e) {
  // 仅当用户未手动设置主题时跟随系统
  if (!localStorage.getItem('theme')) {
    setTheme(e.matches ? 'dark' : 'light');
  }
}

// 确保初始渲染时不闪烁
(function() {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // 设置初始主题属性
  document.documentElement.setAttribute(
    'data-theme', 
    savedTheme || (systemPrefersDark ? 'dark' : 'light')
  );
})();

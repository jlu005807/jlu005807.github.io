/**
 * 主题切换按钮功能 - 固定在左上角
 */

document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  // 检测是否为移动设备
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // 清除可能存在的本地存储的位置信息
  localStorage.removeItem('themeTogglePosition');
  
  // 移除拖拽相关的类名
  themeToggle.classList.remove('draggable');
  
  // 添加提示消息
  themeToggle.setAttribute('title', '点击切换主题');
  
  // 优化点击反馈动画
  themeToggle.addEventListener('click', function() {
    // 添加一个短暂的缩放动画
    themeToggle.style.transform = 'scale(1.2)';
    setTimeout(() => {
      themeToggle.style.transform = '';
    }, 200);
  });
  
  // 设备适配优化
  function adjustForScreenSize() {
    const windowWidth = window.innerWidth;
    
    if (isMobileDevice || windowWidth < 736) {
      // 移动设备上的优化
      themeToggle.style.width = '42px';
      themeToggle.style.height = '42px';
      
      // 确保在小屏幕上不挡住内容
      if (windowWidth < 480) {
        themeToggle.style.top = '10px';
        themeToggle.style.left = '10px';
      }
    } else {
      // 平板/桌面设备的优化
      themeToggle.style.width = '50px';
      themeToggle.style.height = '50px';
    }
  }
  
  // 初始调整
  adjustForScreenSize();
  
  // 监听窗口大小变化，实时调整
  window.addEventListener('resize', adjustForScreenSize);
});

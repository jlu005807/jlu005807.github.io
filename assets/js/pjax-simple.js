// 简化的 PJAX 实现 - 页面内容无刷新切换，音乐不中断
(function() {
  'use strict';

  // 检查浏览器支持
  if (!window.history || !window.history.pushState) {
    console.warn('浏览器不支持 pushState，无法使用 PJAX');
    return;
  }

  // 配置
  const config = {
    selector: 'a[href^="/"], a[href^="./"], a[href$=".html"]', // 拦截的链接
    containerSelector: '#wrapper', // 要替换的容器
    timeout: 5000 // 超时时间
  };

  // 当前正在加载
  let isLoading = false;

  // 加载页面内容
  async function loadPage(url) {
    if (isLoading) return false;
    isLoading = true;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('加载失败');
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      return doc;
    } catch (error) {
      console.error('PJAX加载失败:', error);
      return null;
    } finally {
      isLoading = false;
    }
  }

  // 替换页面内容
  function replacePage(doc) {
    // 1. 替换主内容
    const newContent = doc.querySelector(config.containerSelector);
    const oldContent = document.querySelector(config.containerSelector);
    
    if (newContent && oldContent) {
      oldContent.innerHTML = newContent.innerHTML;
    }

    // 2. 更新 title
    document.title = doc.title;

    // 3. 更新 meta 标签
    const newThemeColor = doc.querySelector('meta[name="theme-color"]');
    const oldThemeColor = document.querySelector('meta[name="theme-color"]');
    if (newThemeColor && oldThemeColor) {
      oldThemeColor.setAttribute('content', newThemeColor.getAttribute('content'));
    }

    // 4. 执行新页面的脚本（如果需要）
    // 注意：这可能会导致问题，需要谨慎处理
    
    // 5. 触发自定义事件通知页面已切换
    window.dispatchEvent(new CustomEvent('pjax:success', {
      detail: { url: window.location.href }
    }));
  }

  // 处理链接点击
  function handleClick(e) {
    const link = e.target.closest('a');
    if (!link) return;

    // 检查是否是需要拦截的链接
    if (!link.matches(config.selector)) return;
    
    // 检查是否是外部链接
    if (link.hostname !== window.location.hostname) return;
    
    // 检查是否是当前页面
    if (link.href === window.location.href) {
      e.preventDefault();
      return;
    }

    // 检查是否按了修饰键
    if (e.ctrlKey || e.metaKey || e.shiftKey) return;

    // 拦截点击
    e.preventDefault();

    // 加载新页面
    loadPage(link.href).then(doc => {
      if (!doc) {
        // 加载失败，使用传统方式跳转
        window.location.href = link.href;
        return;
      }

      // 更新 URL
      window.history.pushState({}, doc.title, link.href);

      // 替换内容
      replacePage(doc);

      // 滚动到顶部
      window.scrollTo(0, 0);
    });
  }

  // 处理浏览器后退/前进
  window.addEventListener('popstate', (e) => {
    loadPage(window.location.href).then(doc => {
      if (doc) {
        replacePage(doc);
      } else {
        // 加载失败，刷新页面
        window.location.reload();
      }
    });
  });

  // 绑定事件
  document.addEventListener('click', handleClick);

  // 页面加载完成通知
  console.log('PJAX 已启用 - 页面切换不会中断音乐');

})();

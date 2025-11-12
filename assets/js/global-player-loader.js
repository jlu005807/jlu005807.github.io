// 全局音乐播放器加载器 - 通过iframe实现跨页面持久化
(function() {
  'use strict';

  // 检查是否已经加载过播放器
  if (document.getElementById('global-music-player-frame')) {
    return;
  }

  // 标记播放器正在初始化，提高优先级
  window._playerInitializing = true;
  
  // 页面卸载时保存播放器状态，但不销毁iframe
  window.addEventListener('beforeunload', function(e) {
    // 标记页面正在切换，播放器应该保持
    sessionStorage.setItem('player_transitioning', 'true');
    sessionStorage.setItem('player_transition_time', Date.now().toString());
    
    // 不销毁iframe，让它保持运行
    // iframe会在新页面加载时被重用或重新创建
  });
  
  // 检查是否从另一个页面切换过来
  const isTransitioning = sessionStorage.getItem('player_transitioning') === 'true';
  const transitionTime = parseInt(sessionStorage.getItem('player_transition_time') || '0');
  const timeSinceTransition = Date.now() - transitionTime;
  
  // 如果是在短时间内切换过来的（5秒内），说明是页面导航
  if (isTransitioning && timeSinceTransition < 5000) {
    console.log('页面切换检测：优先加载音乐播放器');
    // 清除标记
    sessionStorage.removeItem('player_transitioning');
  }

  // 创建3个独立的iframe，分别用于按钮、面板和播放列表
  // 这样可以精确控制每个区域的大小和位置，避免覆盖整个页面
  
  // 主iframe容器（包含所有播放器元素）
  const iframe = document.createElement('iframe');
  iframe.id = 'global-music-player-frame';
  iframe.src = 'player-iframe.html';
  iframe.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    pointer-events: none;
    z-index: 10000;
    background: transparent;
  `;
  
  // 设置iframe属性
  iframe.setAttribute('allowtransparency', 'true');
  iframe.setAttribute('scrolling', 'no');
  iframe.setAttribute('frameborder', '0');
  
  // 创建播放器按钮 - 直接在父页面中创建，使用唱片样式
  const playerButton = document.createElement('button');
  playerButton.id = 'global-player-open-btn';
  playerButton.className = 'music-player';
  playerButton.setAttribute('data-tooltip', '音乐播放器');
  playerButton.setAttribute('aria-label', '打开音乐播放器');
  playerButton.innerHTML = `
    <div class="container">
      <div class="plate">
        <div class="black">
          <div class="border">
            <div class="white">
              <div class="center"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="player">
        <div class="rect"></div>
        <div class="circ"></div>
      </div>
    </div>
  `;
  playerButton.style.cssText = `
    position: fixed;
    top: 20px;
    left: 180px;
    width: 40px;
    height: 40px;
    z-index: 10003;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    clip-path: circle(45%);
    pointer-events: auto;
  `;
  
  // 为按钮添加样式（唱片样式）
  if (!document.getElementById('player-button-style')) {
    const style = document.createElement('style');
    style.id = 'player-button-style';
    style.textContent = `
      /* 父页面的播放器按钮样式 */
      #global-player-open-btn.music-player {
        display: flex !important; /* 确保显示 */
      }
      
      #global-player-open-btn.music-player:active .plate {
        transform: scale(0.95);
      }
      
      #global-player-open-btn.music-player .container {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      #global-player-open-btn.music-player .plate {
        width: 70%;
        height: 70%;
        position: relative;
        z-index: 1;
      }
      
      #global-player-open-btn.music-player .black {
        width: 100%;
        height: 100%;
        position: relative;
        background-color: #1a1a1a;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      #global-player-open-btn.music-player .border {
        width: 70%;
        height: 70%;
        border: 0.12em solid #787878;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      #global-player-open-btn.music-player .white {
        width: 40%;
        height: 40%;
        background-color: #ddd;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      #global-player-open-btn.music-player .center {
        width: 35%;
        height: 35%;
        background-color: #0d0d0d;
        border-radius: 50%;
        transition: background-color 0.5s ease;
      }
      
      #global-player-open-btn.music-player.playing .center {
        background-color: #444;
        box-shadow: 0 0 5px rgba(255, 255, 255, 0.5) inset;
      }
      
      #global-player-open-btn.music-player .player {
        position: absolute;
        transform-origin: 10% center;
        top: 25%;
        left: 70%;
        width: 30%;
        height: 30%;
        z-index: 3;
        transition: transform 0.4s ease;
        filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5));
      }
      
      #global-player-open-btn.music-player .player .rect {
        width: 80%;
        height: 15%;
        background-color: #888;
        position: absolute;
        top: 13%;
        left: 0;
        transform-origin: left;
        transform: rotate(-25deg);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      }
      
      #global-player-open-btn.music-player .player .circ {
        width: 20%;
        height: 35%;
        border-radius: 50%;
        background-color: #666;
        position: absolute;
        top: 0;
        left: 0;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }
      
      #global-player-open-btn.music-player.playing .plate {
        animation: rotate-plate 3s linear infinite;
      }
      
      #global-player-open-btn.music-player.playing .player {
        transform: rotate(25deg);
      }
      
      @keyframes rotate-plate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      /* 悬停提示 */
      #global-player-open-btn.music-player:hover::after {
        content: attr(data-tooltip);
        position: absolute;
        top: 50%;
        left: calc(100% + 12px);
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: #fff;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 13px;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        animation: tooltipFadeIn 0.2s ease forwards;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        z-index: 10005;
      }
      
      #global-player-open-btn.music-player:hover::before {
        content: '';
        position: absolute;
        top: 50%;
        left: calc(100% + 4px);
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 6px 8px 6px 0;
        border-color: transparent rgba(0, 0, 0, 0.9) transparent transparent;
        pointer-events: none;
        opacity: 0;
        animation: tooltipFadeIn 0.2s ease forwards;
        z-index: 10005;
      }
      
      html[data-dark-mode="false"] #global-player-open-btn.music-player:hover::after,
      html[data-theme="light"] #global-player-open-btn.music-player:hover::after {
        background: rgba(255, 255, 255, 0.95);
        color: #000;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }
      
      html[data-dark-mode="false"] #global-player-open-btn.music-player:hover::before,
      html[data-theme="light"] #global-player-open-btn.music-player:hover::before {
        border-color: transparent rgba(255, 255, 255, 0.95) transparent transparent;
      }
      
      @keyframes tooltipFadeIn {
        to { opacity: 1; }
      }
      
      /* 移动端样式 */
      @media (max-width: 768px) {
        #global-player-open-btn.music-player {
          top: 10px !important;
          left: 135px !important;
          width: 32px !important;
          height: 32px !important;
        }
        
        /* 移动端隐藏提示 */
        #global-player-open-btn.music-player:hover::after,
        #global-player-open-btn.music-player:hover::before {
          display: none !important;
        }
        
        /* 移动端播放图标位置修正 */
        #global-player-open-btn.music-player.playing .player {
          transform: rotate(25deg) translateX(0) !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // 按钮点击事件 - 直接通知 iframe 打开/关闭播放器
  playerButton.addEventListener('click', function() {
    if (iframe.contentWindow) {
      // 发送消息到 iframe，告诉它切换播放器面板
      iframe.contentWindow.postMessage({ type: 'togglePlayer' }, '*');
    }
  });
  
  // 创建代理层用于处理面板区域的交互
  const clickProxy = document.createElement('div');
  clickProxy.id = 'player-click-proxy';
  clickProxy.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    pointer-events: none;
  `;
  
  // 转发所有鼠标和输入事件到iframe（支持拖动、hover、input等）
  const mouseEvents = ['click', 'mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave', 'mouseover', 'mouseout'];
  
  // 添加触摸事件支持（移动端）
  const touchEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
  
  // 用于跟踪拖动状态
  let isDragging = false;
  let dragTarget = null;
  let rafId = null; // requestAnimationFrame ID
  let pendingUpdate = null; // 待更新的值
  
  // 用于跟踪点击状态（判断是否是完整的点击事件）
  let mouseDownTarget = null; // 记录 mousedown 的目标
  let mouseDownX = 0;
  let mouseDownY = 0;
  
  // 优化的更新函数，使用 requestAnimationFrame 避免卡顿
  function updateRangeValue() {
    if (!pendingUpdate || !dragTarget) {
      rafId = null;
      return;
    }
    
    const { value, triggerInput } = pendingUpdate;
    dragTarget.value = value;
    
    if (triggerInput) {
      const inputEvent = new Event('input', { bubbles: true });
      dragTarget.dispatchEvent(inputEvent);
    }
    
    pendingUpdate = null;
    rafId = null;
  }
  
  // 请求更新 range 值
  function requestRangeUpdate(value, triggerInput = true) {
    pendingUpdate = { value, triggerInput };
    
    if (!rafId) {
      rafId = requestAnimationFrame(updateRangeValue);
    }
  }
  
  mouseEvents.forEach(eventType => {
    clickProxy.addEventListener(eventType, (e) => {
      if (eventType === 'click' || eventType === 'mousedown') {
        e.stopPropagation();
      }
      
      if (!iframe.contentWindow || !iframe.contentDocument) return;
      
      // 计算位置相对于iframe的坐标
      const rect = iframe.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // 查找点击位置的元素
      const element = iframe.contentDocument.elementFromPoint(x, y);
      
      // 记录 mousedown 位置和目标（用于判断完整点击）
      if (eventType === 'mousedown') {
        mouseDownTarget = element;
        mouseDownX = e.clientX;
        mouseDownY = e.clientY;
      }
      
      // 特殊处理 range input 的拖动 - mousedown 开始拖动
      if (element && element.type === 'range') {
        if (eventType === 'mousedown') {
          isDragging = true;
          dragTarget = element;
          
          // 计算range的值
          const inputRect = element.getBoundingClientRect();
          const inputX = e.clientX - inputRect.left;
          const percent = Math.max(0, Math.min(1, inputX / inputRect.width));
          const min = parseFloat(element.min) || 0;
          const max = parseFloat(element.max) || 100;
          const value = min + (max - min) * percent;
          
          requestRangeUpdate(value, true);
          e.preventDefault();
        }
        // mousemove 和 mouseup 由全局监听器处理
        return;
      }
      
      // 非range元素，正常转发事件
      if (element) {
        const mouseEvent = new MouseEvent(eventType, {
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y,
          button: e.button,
          buttons: e.buttons,
          ctrlKey: e.ctrlKey,
          shiftKey: e.shiftKey,
          altKey: e.altKey,
          metaKey: e.metaKey
        });
        element.dispatchEvent(mouseEvent);
      }
    });
  });
  
  // 添加触摸事件处理（移动端支持）
  let touchStartTime = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let scrollableElement = null; // 记录当前正在滚动的元素
  let lastTouchY = 0; // 记录上一次触摸的Y坐标
  
  touchEvents.forEach(eventType => {
    clickProxy.addEventListener(eventType, (e) => {
      if (!iframe.contentWindow || !iframe.contentDocument) {
        console.log('iframe 未就绪');
        return;
      }
      
      const touch = e.touches[0] || e.changedTouches[0];
      if (!touch) {
        console.log('无触摸点');
        return;
      }
      
      // 触摸点相对于视口的坐标（这是 elementFromPoint 需要的）
      const viewportX = touch.clientX;
      const viewportY = touch.clientY;
      
      // 计算相对于 iframe 的坐标（用于边界检查）
      const rect = iframe.getBoundingClientRect();
      const iframeX = viewportX - rect.left;
      const iframeY = viewportY - rect.top;
      
      console.log(`${eventType} 视口坐标 (${viewportX.toFixed(0)}, ${viewportY.toFixed(0)}), iframe坐标 (${iframeX.toFixed(0)}, ${iframeY.toFixed(0)})`);
      
      // 使用视口坐标查找 iframe 内的目标元素
      let element = iframe.contentDocument.elementFromPoint(viewportX, viewportY);
      
      // touchstart: 检查是否在可滚动区域内（播放列表）
      if (eventType === 'touchstart') {
        scrollableElement = null;
        lastTouchY = viewportY;
        
        if (element) {
          let checkElement = element;
          while (checkElement && checkElement !== iframe.contentDocument.body) {
            const style = iframe.contentWindow.getComputedStyle(checkElement);
            const overflowY = style.overflowY;
            if ((overflowY === 'auto' || overflowY === 'scroll') && checkElement.scrollHeight > checkElement.clientHeight) {
              scrollableElement = checkElement;
              console.log(`✅ 找到可滚动元素: ${checkElement.id || checkElement.className}`);
              break;
            }
            checkElement = checkElement.parentElement;
          }
        }
      }
      
      // touchmove: 如果在可滚动区域内，处理滚动
      if (eventType === 'touchmove' && scrollableElement) {
        const deltaY = lastTouchY - viewportY;
        scrollableElement.scrollTop += deltaY;
        lastTouchY = viewportY;
        
        // 阻止页面滚动
        e.preventDefault();
        e.stopPropagation();
        console.log(`📜 滚动播放列表: deltaY=${deltaY}, scrollTop=${scrollableElement.scrollTop}`);
        return; // 不再继续处理其他逻辑
      }
      
      // touchend/touchcancel: 清除滚动状态
      if (eventType === 'touchend' || eventType === 'touchcancel') {
        if (scrollableElement) {
          console.log(`✅ 滚动结束`);
          scrollableElement = null;
          return; // 滚动操作结束，不触发点击
        }
      }
      
      // 如果没找到元素或找到 body/html，尝试直接找播放器按钮
      if (!element || element.tagName === 'BODY' || element.tagName === 'HTML') {
        console.log('未找到具体元素，尝试直接获取播放器按钮');
        element = iframe.contentDocument.getElementById('open-player');
        
        // 验证触摸点是否在按钮范围内
        if (element) {
          const btnRect = element.getBoundingClientRect();
          const inButton = (
            touch.clientX >= btnRect.left && 
            touch.clientX <= btnRect.right &&
            touch.clientY >= btnRect.top && 
            touch.clientY <= btnRect.bottom
          );
          
          if (!inButton) {
            console.log('触摸点不在按钮范围内');
            element = null;
          } else {
            console.log('✅ 确认触摸在播放器按钮上');
          }
        }
      }
      
      if (element) {
        console.log(`找到元素: ${element.tagName}#${element.id || '(无ID)'}.${element.className || '(无class)'}`);
      } else {
        console.log('未找到任何元素');
      }
      
      // 记录触摸开始信息（用于判断是点击还是拖动）
      if (eventType === 'touchstart') {
        touchStartTime = Date.now();
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
      }
      
      // 处理 range input 的触摸拖动 - 使用统一的 requestAnimationFrame 优化
      if (element && element.type === 'range') {
        if (eventType === 'touchstart') {
          isDragging = true;
          dragTarget = element;
          
          const inputRect = element.getBoundingClientRect();
          const inputX = touch.clientX - inputRect.left;
          const percent = Math.max(0, Math.min(1, inputX / inputRect.width));
          const min = parseFloat(element.min) || 0;
          const max = parseFloat(element.max) || 100;
          const value = min + (max - min) * percent;
          
          requestRangeUpdate(value, true);
          e.preventDefault();
          e.stopPropagation();
        } else if (eventType === 'touchmove' && isDragging && dragTarget) {
          // 使用统一的 requestAnimationFrame 优化拖动平滑度
          const inputRect = dragTarget.getBoundingClientRect();
          const inputX = touch.clientX - inputRect.left;
          const percent = Math.max(0, Math.min(1, inputX / inputRect.width));
          const min = parseFloat(dragTarget.min) || 0;
          const max = parseFloat(dragTarget.max) || 100;
          const value = min + (max - min) * percent;
          
          requestRangeUpdate(value, true);
          e.preventDefault();
          e.stopPropagation();
        } else if ((eventType === 'touchend' || eventType === 'touchcancel') && isDragging && dragTarget) {
          // 确保最后一次更新完成
          if (rafId) {
            cancelAnimationFrame(rafId);
            updateRangeValue(); // 立即执行最后一次更新
          }
          
          dragTarget.dispatchEvent(new Event('change', { bubbles: true }));
          isDragging = false;
          dragTarget = null;
          pendingUpdate = null;
          rafId = null;
          e.preventDefault();
        }
        return;
      }
      
      // 对于非 range 元素，转发触摸事件并在 touchend 时触发点击
      if (element) {
        // 转发触摸事件
        try {
          const touchEvent = new TouchEvent(eventType, {
            bubbles: true,
            cancelable: true,
            touches: e.touches,
            targetTouches: e.targetTouches,
            changedTouches: e.changedTouches
          });
          element.dispatchEvent(touchEvent);
          console.log(`✓ 转发 ${eventType} 到元素`);
        } catch (err) {
          console.log('TouchEvent 转发失败:', err.message);
        }
        
        // 在 touchend 时，如果是快速点击（不是拖动），触发点击事件
        if (eventType === 'touchend') {
          const touchDuration = Date.now() - touchStartTime;
          const touchMoveX = Math.abs(touch.clientX - touchStartX);
          const touchMoveY = Math.abs(touch.clientY - touchStartY);
          
          console.log(`触摸统计: 时长=${touchDuration}ms, 移动X=${touchMoveX}px, Y=${touchMoveY}px`);
          
          // 判断是点击而不是拖动（时间<300ms，移动距离<10px）
          if (touchDuration < 300 && touchMoveX < 10 && touchMoveY < 10) {
            console.log('✅ 判定为点击，触发 click 事件');
            
            // 模拟点击事件
            const clickEvent = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              clientX: touch.clientX,
              clientY: touch.clientY,
              view: iframe.contentWindow
            });
            
            const clicked = element.dispatchEvent(clickEvent);
            console.log(`click 事件已触发, 结果: ${clicked}`);
            e.preventDefault();
          } else {
            console.log('❌ 判定为拖动，不触发点击');
          }
        }
      } else {
        console.log('⚠️ 没有找到元素，无法转发事件');
      }
    }, { passive: false });
  });
  
  // 全局 mousemove 监听器 - 允许在任何位置拖动进度条
  document.addEventListener('mousemove', (e) => {
    if (isDragging && dragTarget) {
      // 拖动中 - 使用 requestAnimationFrame 优化
      const inputRect = dragTarget.getBoundingClientRect();
      const inputX = e.clientX - inputRect.left;
      const percent = Math.max(0, Math.min(1, inputX / inputRect.width));
      const min = parseFloat(dragTarget.min) || 0;
      const max = parseFloat(dragTarget.max) || 100;
      const value = min + (max - min) * percent;
      
      requestRangeUpdate(value, true);
      e.preventDefault();
    }
  });
  
  // 全局 mouseup 监听器 - 结束拖动
  document.addEventListener('mouseup', (e) => {
    if (isDragging && dragTarget) {
      // 确保最后一次更新完成
      if (rafId) {
        cancelAnimationFrame(rafId);
        updateRangeValue(); // 立即执行最后一次更新
      }
      
      const changeEvent = new Event('change', { bubbles: true });
      dragTarget.dispatchEvent(changeEvent);
      isDragging = false;
      dragTarget = null;
      pendingUpdate = null;
      rafId = null;
      
      // 只在拖动时阻止默认行为，不影响正常点击
      e.preventDefault();
      e.stopPropagation();
    } else {
      // 不在拖动状态，检查是否是完整的点击（用于关闭播放器）
      if (mouseDownTarget && mouseDownX !== null && mouseDownY !== null) {
        const deltaX = Math.abs(e.clientX - mouseDownX);
        const deltaY = Math.abs(e.clientY - mouseDownY);
        const isClick = deltaX < 10 && deltaY < 10; // 移动小于10px视为点击
        
        // 如果是完整点击且在播放器外，通知 iframe 关闭播放器
        if (isClick && iframe.contentWindow) {
          const rect = iframe.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const clickedElement = iframe.contentDocument?.elementFromPoint(x, y);
          
          iframe.contentWindow.postMessage({
            type: 'checkClosePlayer',
            clickedElement: clickedElement ? clickedElement.className : '',
            clientX: e.clientX,
            clientY: e.clientY
          }, '*');
        }
      }
      
      // 重置 mousedown 记录
      mouseDownTarget = null;
      mouseDownX = null;
      mouseDownY = null;
    }
  });
  
  // 转发滚轮事件到iframe（用于播放列表滚动）
  clickProxy.addEventListener('wheel', (e) => {
    if (!iframe.contentWindow || !iframe.contentDocument) return;
    
    // 计算位置相对于iframe的坐标
    const rect = iframe.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 查找滚轮事件位置的元素
    const element = iframe.contentDocument.elementFromPoint(x, y);
    
    if (element) {
      // 检查元素或其父元素是否可滚动
      let scrollableElement = element;
      while (scrollableElement && scrollableElement !== iframe.contentDocument.body) {
        const style = iframe.contentWindow.getComputedStyle(scrollableElement);
        const overflowY = style.overflowY;
        
        // 如果找到可滚动元素
        if (overflowY === 'auto' || overflowY === 'scroll') {
          // 直接操作滚动位置
          scrollableElement.scrollTop += e.deltaY;
          e.preventDefault();
          return;
        }
        
        scrollableElement = scrollableElement.parentElement;
      }
      
      // 如果没有找到可滚动元素，尝试转发wheel事件
      const wheelEvent = new WheelEvent('wheel', {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
        deltaX: e.deltaX,
        deltaY: e.deltaY,
        deltaZ: e.deltaZ,
        deltaMode: e.deltaMode
      });
      element.dispatchEvent(wheelEvent);
    }
  }, { passive: false });
  
  // 监听iframe内的消息，动态调整点击区域和按钮状态
  window.addEventListener('message', (event) => {
    if (event.data.type === 'player-panel-state') {
      // 当面板打开时，扩大可点击区域覆盖整个面板
      if (event.data.isOpen) {
        // 面板打开：覆盖整个面板+播放列表区域
        clickProxy.style.pointerEvents = 'auto';
      } else {
        // 面板关闭：不接收事件（只有按钮接收）
        clickProxy.style.pointerEvents = 'none';
      }
    }
    
    // 同步播放状态到按钮
    if (event.data.type === 'player-state') {
      if (event.data.isPlaying) {
        playerButton.classList.add('playing');
      } else {
        playerButton.classList.remove('playing');
      }
    }
  });
  
  // 等待DOM加载完成后插入
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(iframe);
      document.body.appendChild(clickProxy);
      document.body.appendChild(playerButton);  // 添加按钮到页面
    });
  } else {
    document.body.appendChild(iframe);
    document.body.appendChild(clickProxy);
    document.body.appendChild(playerButton);  // 添加按钮到页面
  }

  // 监听来自父页面的主题变化
  function syncThemeToIframe() {
    const html = document.documentElement;
    const darkMode = html.getAttribute('data-dark-mode');
    const theme = html.getAttribute('data-theme');
    
    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'theme-change',
        darkMode: darkMode,
        theme: theme
      }, '*');
    }
  }

  // 监听主题变化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && 
          (mutation.attributeName === 'data-dark-mode' || 
           mutation.attributeName === 'data-theme')) {
        syncThemeToIframe();
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-dark-mode', 'data-theme']
  });

  // iframe加载完成后同步主题
  iframe.addEventListener('load', () => {
    syncThemeToIframe();
    
    // 标记播放器初始化完成
    window._playerInitializing = false;
    window._playerReady = true;
    
    // 触发自定义事件通知播放器已准备好
    window.dispatchEvent(new CustomEvent('playerReady', { 
      detail: { iframe: iframe } 
    }));
    
    console.log('音乐播放器已加载并准备就绪');
  });
  
  // 优先插入播放器到DOM（在其他脚本之前）
  if (document.body) {
    document.body.insertBefore(iframe, document.body.firstChild);
    document.body.insertBefore(clickProxy, document.body.firstChild);
  } else {
    // 如果body还没准备好，等待DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
      document.body.insertBefore(iframe, document.body.firstChild);
      document.body.insertBefore(clickProxy, document.body.firstChild);
    });
  }

})();

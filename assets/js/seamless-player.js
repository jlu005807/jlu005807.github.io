// 全局音乐播放器 - 无缝跨页面方案
// 使用 BroadcastChannel 在标签页间同步状态
(function() {
  'use strict';

  // 检查浏览器支持
  if (!window.BroadcastChannel) {
    console.warn('浏览器不支持 BroadcastChannel，播放器可能无法跨页面同步');
  }

  // 创建广播频道用于跨页面通信
  const channel = window.BroadcastChannel ? new BroadcastChannel('music-player-sync') : null;
  
  // 播放器实例ID（用于识别是否是同一个页面）
  const instanceId = Date.now() + '-' + Math.random();
  
  // 标记这个页面是否是"主播放器"（正在播放音乐的页面）
  let isMasterPlayer = false;
  
  // 检查是否有其他页面正在播放
  function checkForMasterPlayer() {
    if (!channel) return false;
    
    return new Promise((resolve) => {
      let responded = false;
      
      // 询问是否有主播放器
      channel.postMessage({
        type: 'ping-master',
        fromInstance: instanceId
      });
      
      // 监听回应
      const listener = (e) => {
        if (e.data.type === 'pong-master' && e.data.fromInstance !== instanceId) {
          responded = true;
          channel.removeEventListener('message', listener);
          resolve(true);
        }
      };
      
      channel.addEventListener('message', listener);
      
      // 100ms后如果没有回应，说明没有主播放器
      setTimeout(() => {
        if (!responded) {
          channel.removeEventListener('message', listener);
          resolve(false);
        }
      }, 100);
    });
  }
  
  // 监听来自其他页面的消息
  if (channel) {
    channel.addEventListener('message', (e) => {
      // 如果我是主播放器，回应ping
      if (e.data.type === 'ping-master' && isMasterPlayer && e.data.fromInstance !== instanceId) {
        channel.postMessage({
          type: 'pong-master',
          fromInstance: instanceId
        });
      }
      
      // 如果有新的主播放器接管，我就不再是主播放器
      if (e.data.type === 'i-am-master' && e.data.fromInstance !== instanceId) {
        isMasterPlayer = false;
        // 可以选择暂停或保持音频，但不再接管控制
      }
    });
  }
  
  // 页面加载完成后初始化
  async function init() {
    const hasMaster = await checkForMasterPlayer();
    
    if (!hasMaster) {
      // 没有其他页面在播放，我成为主播放器
      isMasterPlayer = true;
      if (channel) {
        channel.postMessage({
          type: 'i-am-master',
          fromInstance: instanceId
        });
      }
    } else {
      // 有其他页面在播放，我不初始化音频播放
      isMasterPlayer = false;
    }
  }
  
  // 页面卸载前通知其他页面
  window.addEventListener('beforeunload', () => {
    if (isMasterPlayer && channel) {
      channel.postMessage({
        type: 'master-leaving',
        fromInstance: instanceId
      });
    }
  });
  
  // 页面可见性变化时处理
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // 页面隐藏，可能要离开
    } else {
      // 页面重新可见，检查是否需要接管
      if (!isMasterPlayer) {
        checkForMasterPlayer().then(hasMaster => {
          if (!hasMaster) {
            isMasterPlayer = true;
            if (channel) {
              channel.postMessage({
                type: 'i-am-master',
                fromInstance: instanceId
              });
            }
          }
        });
      }
    }
  });
  
  // 初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

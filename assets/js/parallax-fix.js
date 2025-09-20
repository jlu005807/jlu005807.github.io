// 轮播图层级管理和Windows 100%缩放修复
document.addEventListener('DOMContentLoaded', function() {
    // ===== 轮播图层级管理 =====
    // 确保轮播图有正确的层级，不干扰视差背景
    const carousel = document.querySelector('.carousel');
    const parallaxWrapper = document.getElementById('parallax_wrapper');
    
    if (carousel && parallaxWrapper) {
        // 确保视差背景在底层
        parallaxWrapper.style.zIndex = "0";
        // 确保轮播图在合适的层级
        carousel.style.zIndex = "1";
        
        // 确保轮播图不会阻挡鼠标事件到视差背景
        carousel.style.pointerEvents = "auto";
    }
    
    // ===== Windows 100%缩放修复 =====
    // 检测是否需要应用修复
    function checkAndApplyFix() {
        // 仅在可能受 Windows 100% 缩放影响的环境下应用修复：Windows 平台、DPR === 1、大屏
        var isWindows = navigator.platform.indexOf('Win') === 0 || navigator.userAgent.indexOf('Windows') !== -1;
        if (isWindows && window.devicePixelRatio && window.devicePixelRatio === 1 && window.innerWidth > 1280) {
            applyBackgroundFix();
        } else {
            // 其余情况恢复正常样式
            resetBackgroundStyles();
        }
    }
    
    // 应用背景图修复
    function applyBackgroundFix() {
        const wrapperBg = document.querySelector('#wrapper > .bg');
        if (wrapperBg) {
            // 保存原始样式以便恢复
            if (!wrapperBg.dataset.originalPosition) {
                wrapperBg.dataset.originalPosition = wrapperBg.style.position || '';
                wrapperBg.dataset.originalTransform = wrapperBg.style.transform || '';
            }
            
            // 应用修复样式（不强制写入 transform，允许后续 JS 变换生效）
            wrapperBg.style.position = 'fixed';
            wrapperBg.style.backgroundSize = 'contain, auto, cover'; // 背景图完全覆盖
            wrapperBg.style.backgroundPosition = 'right bottom, center, center';
            wrapperBg.style.backgroundAttachment = 'fixed';
            // Do not forcibly set transform here; leave it to CSS scoped rules when needed.
            wrapperBg.style.width = '100vw';
            wrapperBg.style.height = '100vh';
            wrapperBg.style.zIndex = '-1';
            
            // 添加类以便CSS选择器识别
            document.body.classList.add('windows-100-scaling');
        }
    }
    
    // 恢复原始样式
    function resetBackgroundStyles() {
        const wrapperBg = document.querySelector('#wrapper > .bg');
        if (wrapperBg && wrapperBg.dataset.originalPosition) {
            wrapperBg.style.position = wrapperBg.dataset.originalPosition;
            wrapperBg.style.transform = wrapperBg.dataset.originalTransform;
            wrapperBg.style.backgroundSize = 'contain, auto, cover';
            wrapperBg.style.backgroundPosition = 'right bottom, center, center';
            
            document.body.classList.remove('windows-100-scaling');
        }
    }
    
    // 初始检查
    checkAndApplyFix();
    
    // 监听窗口大小变化
    window.addEventListener('resize', checkAndApplyFix);
});

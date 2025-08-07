// 轮播图层级管理，确保不影响视差背景
document.addEventListener('DOMContentLoaded', function() {
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
});

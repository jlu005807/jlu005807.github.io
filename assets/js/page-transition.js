/**
 * 页面跳转过渡效果增强
 * 
 * 此脚本提供页面间平滑过渡，利用页面加载时间创建淡入淡出效果
 * 并确保新页面总是从顶部开始显示，减轻跳转时的卡顿感
 */

(function() {
    // 全局变量
    const FADE_OUT_DURATION = 400; // 淡出动画时长(ms)
    const FADE_IN_DURATION = 600;  // 淡入动画时长(ms)
    const MIN_TRANSITION_TIME = 300; // 最小过渡时间(ms)
    
    // 页面加载完成时执行的入场动画
    function performEntranceAnimation() {
        // 检查是否为message页面
        const isMessagePage = window.location.pathname.toLowerCase().includes('message.html');
        
        // 所有页面都滚动到顶部
        window.scrollTo(0, 0);
        
        // 如果是message页面，需要特殊处理Giscus加载
        if (isMessagePage) {
            // 为message页面提供一个通知函数，在Giscus加载完成后调用
            window.notifyGiscusLoaded = function() {
                // 标记Giscus已加载
                window._giscusLoaded = true;
                
                // 清除定时器
                if (window._giscusWaitTimer) {
                    clearTimeout(window._giscusWaitTimer);
                    window._giscusWaitTimer = null;
                }
            };
            
            // 设置超时保护，如果Giscus加载太久，也会继续执行
            if (!window._giscusWaitTimer) {
                window._giscusWaitTimer = setTimeout(function() {
                    if (!window._giscusLoaded) {
                        window._giscusLoaded = true;
                    }
                }, 8000); // 8秒超时
            }
        }
        
        // 淡入动画
        if (document.body.style.opacity === '0' || document.body.style.opacity === '') {
            // 确保页面不可见
            document.body.style.opacity = '0';
            
            // 等待DOM绘制完成
            requestAnimationFrame(function() {
                // 设置过渡动画
                document.body.style.transition = `opacity ${FADE_IN_DURATION}ms ease-in-out`;
                
                // 加一点延迟确保过渡效果应用
                setTimeout(function() {
                    document.body.style.opacity = '1';
                }, 20);
            });
        }
    }
    
    // 页面退出动画和导航
    function navigateWithTransition(href) {
        // 防止重复触发
        if (window._isNavigating) return;
        window._isNavigating = true;
        
        // 记录状态用于下一个页面
        sessionStorage.setItem('navigatingToNewPage', 'true');
        sessionStorage.setItem('previousPage', window.location.pathname);
        sessionStorage.setItem('targetPage', href);
        
        // 淡出动画
        document.body.style.transition = `opacity ${FADE_OUT_DURATION}ms ease-out`;
        document.body.style.opacity = '0';
        
        // 启动延迟导航，确保有足够时间完成过渡效果
        const navigationStart = Date.now();
        setTimeout(function() {
            const elapsedTime = Date.now() - navigationStart;
            const remainingTime = Math.max(0, MIN_TRANSITION_TIME - elapsedTime);
            
            // 添加一些额外延迟以确保过渡平滑
            setTimeout(function() {
                window.location.href = href;
            }, remainingTime);
        }, FADE_OUT_DURATION * 0.7); // 在动画完成70%时就开始准备导航
    }
    
    // 预加载链接页面
    function preloadPage(href) {
        if (!window._preloadedLinks) {
            window._preloadedLinks = new Set();
        }
        
        if (!window._preloadedLinks.has(href)) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = href;
            document.head.appendChild(link);
            window._preloadedLinks.add(href);
        }
    }
    
    // 监听DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPageTransition);
    } else {
        initPageTransition();
    }
    
    // 初始化页面过渡系统
    function initPageTransition() {
        // 检查当前是否为message页面
        const isMessagePage = window.location.pathname.toLowerCase().includes('message.html');
        
        // 如果是从其他页面跳转过来的，执行入场动画
        if (sessionStorage.getItem('navigatingToNewPage') === 'true') {
            performEntranceAnimation();
            sessionStorage.removeItem('navigatingToNewPage');
            
            // 检查是否有目标锚点
            const targetAnchor = sessionStorage.getItem('targetAnchor');
            if (targetAnchor) {
                // 延迟一下再滚动到锚点，等待页面加载完毕
                setTimeout(function() {
                    const targetElement = document.querySelector(targetAnchor);
                    if (targetElement) {
                        targetElement.scrollIntoView({behavior: 'smooth'});
                    }
                }, 800); // 给页面足够时间淡入和加载内容
                
                // 清除锚点信息
                sessionStorage.removeItem('targetAnchor');
            }
            
            // 对message页面特殊处理，避免与Giscus冲突
            if (isMessagePage) {
                // 标记页面通过跳转抵达
                window._arrivedViaTransition = true;
            }
        } else {
            // 直接访问的情况，确保页面可见
            document.body.style.opacity = '1';
            
            // 处理URL中的锚点
            if (window.location.hash) {
                // 延迟一下再滚动到锚点
                setTimeout(function() {
                    const targetElement = document.querySelector(window.location.hash);
                    if (targetElement) {
                        targetElement.scrollIntoView({behavior: 'smooth'});
                    }
                }, 500);
            }
        }
        
        // 初始化链接监听
        initLinkInterception();
        
        // 预加载可能的目标页面
        setTimeout(preloadPotentialTargets, 1000);
    }
    
    // 预加载可能会点击的链接
    function preloadPotentialTargets() {
        const links = document.querySelectorAll('a[href$=".html"]:not([href^="http"]):not([href^="//"]):not([href^="#"])');
        links.forEach(link => {
            if (window._preloadedLinks && window._preloadedLinks.size >= 5) return;
            
            const href = link.getAttribute('href');
            if (isVisibleInViewport(link) && href) {
                preloadPage(href);
            }
        });
    }
    
    // 判断元素是否在可视区域内
    function isVisibleInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // 初始化链接拦截
    function initLinkInterception() {
        document.addEventListener('click', function(event) {
            let target = event.target;
            
            // 查找被点击的链接元素
            while (target && target !== document) {
                if (target.tagName === 'A') {
                    const href = target.getAttribute('href');
                    
                    // 跳过处理空链接
                    if (!href) break;
                    
                    // 处理不同类型的链接
                    if (href === '#') {
                        // 默认的返回顶部链接，不做特殊处理
                        break;
                    } else if (href.startsWith('#')) {
                        // 页内锚点链接，平滑滚动
                        event.preventDefault();
                        const targetElement = document.querySelector(href);
                        if (targetElement) {
                            targetElement.scrollIntoView({behavior: 'smooth'});
                        }
                        break;
                    } else if (href.includes('.html#')) {
                        // 带锚点的页面链接
                        event.preventDefault();
                        const [pagePath, anchor] = href.split('#');
                        // 存储锚点信息供下一个页面使用
                        sessionStorage.setItem('targetAnchor', '#' + anchor);
                        navigateWithTransition(pagePath);
                        break;
                    } else if (!href.includes('://') && !href.startsWith('//') && href.includes('.html')) {
                        // 普通页面跳转链接
                        event.preventDefault();
                        sessionStorage.removeItem('targetAnchor'); // 清除可能存在的锚点
                        navigateWithTransition(href);
                        break;
                    }
                    // 其他链接（如外部链接）使用默认行为
                    break;
                }
                target = target.parentElement;
            }
        });
    }
    
    // 优化页面刷新和返回行为
    window.addEventListener('pageshow', function(event) {
        // 如果是从缓存加载的页面，确保状态正确
        if (event.persisted) {
            document.body.style.opacity = '1';
            sessionStorage.removeItem('navigatingToNewPage');
            window._isNavigating = false;
        }
    });
})();

// 智能回到顶部按钮功能 - 根据 fullcard 状态切换功能
(function() {
    'use strict';
    
    let smartButton = null;
    let currentExpandedCard = null;
    
    // 创建智能回到顶部按钮
    function createSmartBackToTopButton() {
        const button = document.createElement('button');
        button.className = 'smart-back-to-top';
        button.setAttribute('aria-label', '回到顶部');
        button.setAttribute('title', '回到顶部');
        
        // 添加点击事件
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (currentExpandedCard) {
                // 如果有展开的 fullcard，滚动到该卡片顶部
                const bookElement = currentExpandedCard.querySelector('.book');
                if (bookElement) {
                    bookElement.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            } else {
                // 如果没有展开的 fullcard，滚动到页面顶部
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
        
        // 将按钮添加到页面
        document.body.appendChild(button);
        
        return button;
    }
    
    // 检查是否有展开的 fullcard
    function findExpandedCard() {
        const expandedBook = document.querySelector('.book.book--expanded');
        return expandedBook ? expandedBook.closest('.fullcard-wrapper') : null;
    }
    
    // 控制按钮显示/隐藏和功能切换
    function updateSmartButton() {
        if (!smartButton) return;
        
        const expandedCard = findExpandedCard();
        currentExpandedCard = expandedCard;
        
        if (expandedCard) {
            // 有 fullcard 展开时，根据卡片内滚动位置决定是否显示按钮
            const bookElement = expandedCard.querySelector('.book');
            if (bookElement) {
                const bookScrollTop = bookElement.scrollTop;
                const shouldShow = bookScrollTop > 100;
                
                if (shouldShow) {
                    showSmartButton('返回卡片顶部');
                } else {
                    hideSmartButton();
                }
            }
        } else {
            // 没有 fullcard 展开时，根据页面滚动位置决定是否显示按钮
            const pageScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const shouldShow = pageScrollTop > 300;
            
            if (shouldShow) {
                showSmartButton('回到页面顶部');
            } else {
                hideSmartButton();
            }
        }
    }
    
    // 显示智能按钮
    function showSmartButton(title) {
        if (!smartButton.classList.contains('show')) {
            smartButton.setAttribute('title', title);
            smartButton.setAttribute('aria-label', title);
            smartButton.classList.remove('hide');
            smartButton.classList.add('show');
        }
    }
    
    // 隐藏智能按钮
    function hideSmartButton() {
        if (smartButton.classList.contains('show')) {
            smartButton.classList.remove('show');
            smartButton.classList.add('hide');
            // 延迟隐藏，等待动画完成
            setTimeout(() => {
                if (smartButton.classList.contains('hide')) {
                    smartButton.style.display = 'none';
                }
            }, 300);
        }
    }
    
    // 监听 fullcard 状态变化
    function observeFullcardChanges() {
        // 监听所有 book 元素的类名变化
        const allBooks = document.querySelectorAll('.book');
        
        allBooks.forEach(book => {
            // 创建 MutationObserver 监听类名变化
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        updateSmartButton();
                    }
                });
            });
            
            // 开始观察类名变化
            observer.observe(book, {
                attributes: true,
                attributeFilter: ['class']
            });
            
            // 监听 book 元素的滚动事件
            book.addEventListener('scroll', updateSmartButton, { passive: true });
        });
    }
    
    // 初始化函数
    function init() {
        // 等待DOM完全加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        // 延迟执行，确保所有脚本都已加载
        setTimeout(() => {
            // 创建智能按钮
            smartButton = createSmartBackToTopButton();
            
            // 监听 fullcard 变化
            observeFullcardChanges();
            
            // 监听页面滚动事件
            let ticking = false;
            function handlePageScroll() {
                if (!ticking) {
                    requestAnimationFrame(function() {
                        updateSmartButton();
                        ticking = false;
                    });
                    ticking = true;
                }
            }
            
            window.addEventListener('scroll', handlePageScroll, { passive: true });
            
            // 初始检查
            updateSmartButton();
            
            console.log('智能回到顶部按钮已初始化');
        }, 1000);
    }
    
    // 开始初始化
    init();
})();

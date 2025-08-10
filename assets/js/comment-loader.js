// 评论系统加载优化
document.addEventListener('DOMContentLoaded', function() {
	// 监听评论系统加载
	const giscusContainer = document.querySelector('.giscus');
	const loadingIndicator = document.getElementById('comment-loading');
	
	if (!giscusContainer || !loadingIndicator) {
		return; // 如果没有评论容器，直接返回
	}
	
	// 创建一个观察器来监听 giscus 容器内的变化
	const observer = new MutationObserver(function(mutations) {
		// 检查是否有iframe被添加（表示评论已加载）
		if (giscusContainer.querySelector('iframe')) {
			// 隐藏加载指示器
			if (loadingIndicator) {
				loadingIndicator.style.display = 'none';
			}
			
			// 确保iframe宽度正确，且边界框完全显示
			const iframe = giscusContainer.querySelector('iframe');
			if (iframe) {
				iframe.style.width = '100%';
				iframe.style.maxWidth = '100%';
				iframe.style.boxSizing = 'border-box';
				iframe.style.overflow = 'hidden';
				
				// 监听iframe内容加载完成
				iframe.addEventListener('load', function() {
					// 添加额外的监听以处理评论系统可能的动态大小变化
					setTimeout(function() {
						// 确保iframe宽度适当
						iframe.style.width = '100%';
						iframe.style.maxWidth = '100%';
						
						// 尝试修复iframe内容中可能的样式问题
						try {
							const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
							if (iframeDoc) {
								// 为iframe内的主容器添加样式
								const mainContainer = iframeDoc.querySelector('.gsc-main');
								if (mainContainer) {
									mainContainer.style.width = '98%';
									mainContainer.style.maxWidth = '98%';
									mainContainer.style.boxSizing = 'border-box';
								}
							}
						} catch(e) {
							// 跨域问题，忽略错误
							console.log('跨域限制，无法访问iframe内容');
						}
						
						// 通知页面过渡系统Giscus已加载
						if (window.notifyGiscusLoaded && typeof window.notifyGiscusLoaded === 'function') {
							window.notifyGiscusLoaded();
						}
					}, 1000);
				});
			}
			
			// 停止观察
			observer.disconnect();
		}
	});
	
	// 开始观察目标节点变化
	observer.observe(giscusContainer, { childList: true, subtree: true });
	
	// 15秒后无论如何都隐藏加载指示器（防止加载失败时一直显示）
	setTimeout(function() {
		if (loadingIndicator) {
			loadingIndicator.style.display = 'none';
			
			// 如果加载超时，也通知页面过渡系统
			if (window.notifyGiscusLoaded && typeof window.notifyGiscusLoaded === 'function') {
				window.notifyGiscusLoaded();
			}
		}
	}, 15000);
});

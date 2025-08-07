// Expanding Cards功能 - 悬停展开，离开收起，添加延迟避免快速划过
document.addEventListener('DOMContentLoaded', function() {
	const panels = document.querySelectorAll('.panel');
	const container = document.querySelector('.expanding-cards-container');
	const wrapper = document.querySelector('.expanding-cards-wrapper');
	
	// 检测是否为触摸设备
	const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
	
	// 延迟展开控制
	let expandTimer = null;
	const expandDelay = 100; // 100ms延迟展开
	
	panels.forEach(panel => {
		if (isTouchDevice) {
			// 触摸设备使用点击事件
			panel.addEventListener('click', () => {
				// 检查是否已经是激活状态
				const wasActive = panel.classList.contains('active');
				
				// 移除所有活跃状态
				panels.forEach(p => p.classList.remove('active'));
				
				// 如果不是激活状态，则激活；如果已经激活，则保持关闭（切换效果）
				if (!wasActive) {
					panel.classList.add('active');
					// 为容器添加expanded类
					if (container) {
						container.classList.add('expanded');
					}
					// 为wrapper添加has-active-card类
					if (wrapper) {
						wrapper.classList.add('has-active-card');
					}
				} else {
					// 移除容器的expanded类
					if (container) {
						container.classList.remove('expanded');
					}
					// 移除wrapper的has-active-card类
					if (wrapper) {
						wrapper.classList.remove('has-active-card');
					}
				}
			});
		} else {
			// 非触摸设备使用悬停事件，添加延迟
			panel.addEventListener('mouseenter', () => {
				// 清除之前的计时器
				if (expandTimer) {
					clearTimeout(expandTimer);
				}
				
				// 设置延迟展开
				expandTimer = setTimeout(() => {
					// 移除所有活跃状态
					panels.forEach(p => p.classList.remove('active'));
					// 为当前悬停的panel添加活跃状态
					panel.classList.add('active');
					// 为容器添加expanded类以支持动态高度调整
					if (container) {
						container.classList.add('expanded');
					}
					// 为wrapper添加has-active-card类以提升z-index
					if (wrapper) {
						wrapper.classList.add('has-active-card');
					}
				}, expandDelay);
			});
			
			// 鼠标快速离开时取消展开
			panel.addEventListener('mouseleave', () => {
				if (expandTimer) {
					clearTimeout(expandTimer);
					expandTimer = null;
				}
			});
		}
	});
	
	// 容器离开时恢复默认状态（仅限非触摸设备）
	if (container && !isTouchDevice) {
		container.addEventListener('mouseleave', () => {
			// 清除计时器
			if (expandTimer) {
				clearTimeout(expandTimer);
				expandTimer = null;
			}
			// 移除所有活跃状态，保持收起状态
			panels.forEach(p => p.classList.remove('active'));
			// 移除容器的expanded类
			if (container) {
				container.classList.remove('expanded');
			}
			// 移除wrapper的has-active-card类
			if (wrapper) {
				wrapper.classList.remove('has-active-card');
			}
		});
	}
});

/*
	Massively by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$nav = $('#nav'),
		$main = $('#main'),
		$navPanelToggle, $navPanel, $navPanelInner;

	// Breakpoints.
		breakpoints({
			default:   ['1681px',   null       ],
			xlarge:    ['1281px',   '1680px'   ],
			large:     ['981px',    '1280px'   ],
			medium:    ['737px',    '980px'    ],
			small:     ['481px',    '736px'    ],
			xsmall:    ['361px',    '480px'    ],
			xxsmall:   [null,       '360px'    ]
		});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				$bg = $('<div class="bg"></div>').appendTo($t),
				on, off;

			on = function() {

				$bg
					.removeClass('fixed')
					.css('transform', 'matrix(1,0,0,1,0,0)');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$bg.css('transform', 'matrix(1,0,0,1,0,' + (pos * intensity) + ')');

					});

			};

			off = function() {

				$bg
					.addClass('fixed')
					.css('transform', 'none');

				$window
					.off('scroll._parallax');

			};

			// Disable parallax on ..
				if (browser.name == 'ie'			// IE
				||	browser.name == 'edge'			// Edge
				||	window.devicePixelRatio > 1		// Retina/HiDPI (= poor performance)
				||	browser.mobile)					// Mobile devices
					off();

			// Enable everywhere else.
				else {

					breakpoints.on('>large', on);
					breakpoints.on('<=large', off);

				}

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('.scrolly').scrolly();

	// Background.
		$wrapper._parallax(0.925);

	// Nav Panel.

		// Toggle.
			$navPanelToggle = $(
				'<a href="#navPanel" id="navPanelToggle">Menu</a>'
			)
				.appendTo($wrapper);

			// Change toggle styling once we've scrolled past the header.
				$header.scrollex({
					bottom: '5vh',
					enter: function() {
						$navPanelToggle.removeClass('alt');
					},
					leave: function() {
						$navPanelToggle.addClass('alt');
					}
				});

		// Panel.
			$navPanel = $(
				'<div id="navPanel">' +
					'<nav>' +
					'</nav>' +
					'<a href="#navPanel" class="close"></a>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right',
					target: $body,
					visibleClass: 'is-navPanel-visible'
				});

			// Get inner.
				$navPanelInner = $navPanel.children('nav');

			// Move nav content on breakpoint change.
				var $navContent = $nav.children();

				breakpoints.on('>medium', function() {

					// NavPanel -> Nav.
						$navContent.appendTo($nav);

					// Flip icon classes.
						$nav.find('.icons, .icon')
							.removeClass('alt');

				});

				breakpoints.on('<=medium', function() {

					// Nav -> NavPanel.
						$navContent.appendTo($navPanelInner);

					// Flip icon classes.
						$navPanelInner.find('.icons, .icon')
							.addClass('alt');

				});

			// Hack: Disable transitions on WP.
				if (browser.os == 'wp'
				&&	browser.osVersion < 10)
					$navPanel
						.css('transition', 'none');

	// Intro.
		var $intro = $('#intro');

		if ($intro.length > 0) {

			// Hack: Fix flex min-height on IE.
				if (browser.name == 'ie') {
					$window.on('resize.ie-intro-fix', function() {

						var h = $intro.height();

						if (h > $window.height())
							$intro.css('height', 'auto');
						else
							$intro.css('height', h);

					}).trigger('resize.ie-intro-fix');
				}

			// Hide intro on scroll (> small).
				breakpoints.on('>small', function() {

					$main.unscrollex();

					$main.scrollex({
						mode: 'bottom',
						top: '25vh',
						bottom: '-50vh',
						enter: function() {
							$intro.addClass('hidden');
						},
						leave: function() {
							$intro.removeClass('hidden');
						}
					});

				});

			// Hide intro on scroll (<= small).
				breakpoints.on('<=small', function() {

					$main.unscrollex();

					$main.scrollex({
						mode: 'middle',
						top: '15vh',
						bottom: '-15vh',
						enter: function() {
							$intro.addClass('hidden');
						},
						leave: function() {
							$intro.removeClass('hidden');
						}
					});

			});

		}

	// Parallax 视差控制器
	(function(){
		// 检测是否为移动端 - 放宽检测条件
		var isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
		if (isMobile) {
			document.body.classList.add('parallax-inactive');
			return;
		}
		const config = {
			range: 8,          // 减小范围到12像素
			bgOffset: 3,        // 减小背景偏移到2像素
			fgOffset: 6,        // 减小前景偏移到8像素
			rotationFactor: 0.6, // 减小旋转角度到0.6度
			smoothFactor: 0.35   // 增加平滑因子，让移动更流畅
		};
		
		const wrapper = document.getElementById('parallax_wrapper');
		const bg = document.getElementById('parallax_bg');
		const fg = document.getElementById('parallax_foreground');
		if (!wrapper || !bg || !fg) return;
		
		// 添加当前变换状态跟踪
		let currentTransform = {
			bg: { x: 0, y: 0, rotateX: 0, rotateY: 0 },
			fg: { x: 0, y: 0, rotateX: 0, rotateY: 0 }
		};
		
		// 添加目标变换状态
		let targetTransform = {
			bg: { x: 0, y: 0, rotateX: 0, rotateY: 0 },
			fg: { x: 0, y: 0, rotateX: 0, rotateY: 0 }
		};
		
		// 添加性能优化变量
		let lastTime = 0;
		let animationId = null;
		
		function calculateTransform(h, v, offset, isBackground) {
			if (isBackground) {
				return `translate3d(${h * offset}px, ${v * offset}px, 0) rotateX(${-v * config.rotationFactor}deg) rotateY(${h * config.rotationFactor}deg)`;
			} else {
				return `translate3d(${h * -offset}px, ${v * -offset}px, 0) rotateX(${v * config.rotationFactor}deg) rotateY(${h * -config.rotationFactor}deg)`;
			}
		}
		
		// 改进的平滑插值函数 - 基于时间的插值
		function lerp(start, end, factor) {
			return start + (end - start) * factor;
		}
		
		// 应用平滑变换 - 基于时间的动画
		function applySmoothTransform(deltaTime) {
			// 基于时间的插值因子，确保60fps的平滑动画
			const timeFactor = Math.min(deltaTime / 16.67, 1); // 16.67ms = 60fps
			const lerpFactor = config.smoothFactor * timeFactor;
			
			// 使用改进的线性插值
			currentTransform.bg.x = lerp(currentTransform.bg.x, targetTransform.bg.x, lerpFactor);
			currentTransform.bg.y = lerp(currentTransform.bg.y, targetTransform.bg.y, lerpFactor);
			currentTransform.bg.rotateX = lerp(currentTransform.bg.rotateX, targetTransform.bg.rotateX, lerpFactor);
			currentTransform.bg.rotateY = lerp(currentTransform.bg.rotateY, targetTransform.bg.rotateY, lerpFactor);
			
			currentTransform.fg.x = lerp(currentTransform.fg.x, targetTransform.fg.x, lerpFactor);
			currentTransform.fg.y = lerp(currentTransform.fg.y, targetTransform.fg.y, lerpFactor);
			currentTransform.fg.rotateX = lerp(currentTransform.fg.rotateX, targetTransform.fg.rotateX, lerpFactor);
			currentTransform.fg.rotateY = lerp(currentTransform.fg.rotateY, targetTransform.fg.rotateY, lerpFactor);
			
			// 应用变换 - 使用更精确的数值
			bg.style.transform = `translate3d(${currentTransform.bg.x.toFixed(2)}px, ${currentTransform.bg.y.toFixed(2)}px, 0) rotateX(${currentTransform.bg.rotateX.toFixed(2)}deg) rotateY(${currentTransform.bg.rotateY.toFixed(2)}deg)`;
			fg.style.transform = `translate3d(${currentTransform.fg.x.toFixed(2)}px, ${currentTransform.fg.y.toFixed(2)}px, 0) rotateX(${currentTransform.fg.rotateX.toFixed(2)}deg) rotateY(${currentTransform.fg.rotateY.toFixed(2)}deg)`;
		}
		
		function handleMouseMove(e) {
			const width = wrapper.offsetWidth;
			const height = wrapper.offsetHeight;
			const horizontal = (e.clientX / width - 0.5) * config.range;
			const vertical = (e.clientY / height - 0.5) * config.range;
			const maxOffset = config.range * 0.8;
			
			// 直接限制范围
			const clampedHorizontal = Math.max(Math.min(horizontal, maxOffset), -maxOffset);
			const clampedVertical = Math.max(Math.min(vertical, maxOffset), -maxOffset);
			
			// 设置目标变换
			targetTransform.bg.x = clampedHorizontal * config.bgOffset;
			targetTransform.bg.y = clampedVertical * config.bgOffset;
			targetTransform.bg.rotateX = -clampedVertical * config.rotationFactor;
			targetTransform.bg.rotateY = clampedHorizontal * config.rotationFactor;
			
			targetTransform.fg.x = -clampedHorizontal * config.fgOffset;
			targetTransform.fg.y = -clampedVertical * config.fgOffset;
			targetTransform.fg.rotateX = clampedVertical * config.rotationFactor;
			targetTransform.fg.rotateY = -clampedHorizontal * config.rotationFactor;
		}
		
		// 优化的节流函数 - 使用RAF和防抖
		function createOptimizedThrottle(func) {
			let ticking = false;
			let lastArgs = null;
			
			return function(...args) {
				lastArgs = args;
				
				if (!ticking) {
					requestAnimationFrame(() => {
						func.apply(this, lastArgs);
						ticking = false;
					});
					ticking = true;
				}
			};
		}
		
		// 优化的动画循环
		function animate(currentTime) {
			const deltaTime = currentTime - lastTime;
			lastTime = currentTime;
			
			applySmoothTransform(deltaTime);
			animationId = requestAnimationFrame(animate);
		}
		
		// 启动动画循环
		animationId = requestAnimationFrame(animate);
		
		wrapper.addEventListener('mousemove', createOptimizedThrottle(handleMouseMove));
		wrapper.addEventListener('mouseleave', function(){
			// 平滑重置到初始状态
			targetTransform.bg = { x: 0, y: 0, rotateX: 0, rotateY: 0 };
			targetTransform.fg = { x: 0, y: 0, rotateX: 0, rotateY: 0 };
		});

		function hideParallax() {
			var pw = document.getElementById('parallax_wrapper');
			if (!pw) return;
			// 防止多次绑定
			pw.removeEventListener('transitionend', pw._parallaxHideHandler || (()=>{}));
			// 已经隐藏则不再处理
			if (pw.classList.contains('parallax-hide')) return;
			pw.classList.add('parallax-hide');
			pw._parallaxHideHandler = function handler(e) {
				// 只处理自身的opacity动画
				if (e.target !== pw) return;
				pw.style.display = 'none';
				pw.removeEventListener('transitionend', handler);
			};
			pw.addEventListener('transitionend', pw._parallaxHideHandler);
			document.body.classList.add('parallax-inactive');
		}
		function showParallax() {
			var pw = document.getElementById('parallax_wrapper');
			if (!pw) return;
			// 防止多次绑定
			pw.removeEventListener('transitionend', pw._parallaxHideHandler || (()=>{}));
			// 已经显示则不再处理
			if (!pw.classList.contains('parallax-hide') && pw.style.display === 'block') return;
			pw.style.display = 'block';
			// 触发重绘，确保动画生效
			void pw.offsetWidth;
			pw.classList.remove('parallax-hide');
			document.body.classList.remove('parallax-inactive');
		}
		function checkParallax() {
			// 修改：允许在页面顶部一定范围内显示视差效果
			if (window.scrollY <= 1) {
				showParallax();
			} else {
				hideParallax();
			}
		}
		window.addEventListener('scroll', checkParallax);
		window.addEventListener('wheel', hideParallax, {passive: true});
		window.addEventListener('touchmove', hideParallax, {passive: true});
		window.addEventListener('keydown', function(e) {
			if ([32,33,34,35,36,38,40].includes(e.keyCode)) {
				hideParallax();
			}
		});
		
		// 添加调试信息
		console.log('优化后的视差效果已加载，配置:', config);
		console.log('视差元素:', {wrapper, bg, fg});
	})();

	
 // 页面加载时淡入淡出过渡动画
 try {
	// 初始化时设置透明度为0
	document.body.style.opacity = 0;
	// 只添加透明度过渡效果，不影响位置和变换
	document.body.style.transition = 'opacity 400ms ease-in-out';
	
	// 页面加载完成后淡入
	window.addEventListener('DOMContentLoaded', function() {
	  // 短暂延迟确保过渡效果生效
	  setTimeout(function() {
		document.body.style.opacity = 1;
	  }, 50);
	});
	
	// 所有内部链接点击时淡出再跳转
	document.querySelectorAll('a').forEach(function(link) {
	  // 只处理同域名且没有target属性的链接
	  if (link.hostname === window.location.hostname && !link.hasAttribute('target')) {
		link.addEventListener('click', function(e) {
		  // 不处理锚点链接和javascript链接
		  if (link.getAttribute('href').startsWith('#') || link.getAttribute('href').startsWith('javascript:')) return;
		  e.preventDefault();
		  // 只添加淡出效果，不改变位置
		  document.body.style.opacity = 0;
		  // 等待动画完成后跳转
		  setTimeout(function() {
			// 记录当前滚动位置到会话存储，以便返回时恢复
			sessionStorage.setItem('lastScrollPosition', window.pageYOffset);
			window.location = link.href;
		  }, 380); // 稍微延长时间，让过渡更完整
		});
	  }
	});
	
	// 如果是从内部页面返回，检查是否需要恢复滚动位置
	if(sessionStorage.getItem('lastScrollPosition')) {
	  window.addEventListener('load', function() {
		// 等待一会儿再恢复，确保页面已完全加载
		setTimeout(function() {
		  // 恢复上次保存的滚动位置
		  window.scrollTo(0, sessionStorage.getItem('lastScrollPosition'));
		  // 使用后删除，避免影响后续访问
		  sessionStorage.removeItem('lastScrollPosition');
		}, 100);
	  });
	}
  } catch (e) { console.log('页面过渡动画出错:', e); /* 保留错误信息便于调试 */ }
  
})(jQuery);



// ====== 平滑滚动与锚点跳转相关功能 ======

// 1. “Start My Story”按钮：点击后让搜索框居中并自动聚焦
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  var btn = document.querySelector('a.button.large[href="#article-search"]');
  var search = document.getElementById('article-search');
  if (btn && search) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      // 计算目标位置，使搜索框在视口垂直居中
      var rect = search.getBoundingClientRect();
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var target = rect.top + scrollTop - (window.innerHeight / 2) + (rect.height / 2);
      window.scrollTo({
        top: target,
        behavior: 'smooth'
      });
      // 自动聚焦输入框
      setTimeout(function() {
        search.focus();
      }, 500);
    });
  }
});

// 2. 首页顶部图片：点击后平滑滚动到页面顶部
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  var imgLink = document.querySelector('section > a.image.fit');
  if (imgLink) {
    imgLink.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});

// 3. 通用曲线锚点平滑滚动（支持中断）
// ------------------------------------------------------------
// 缓动函数（easeInOutCubic）
function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// 动画滚动到目标位置（支持自定义时长，用户滚轮时进入惯性滚动阶段）
function smoothScrollTo(targetY, duration = 800) {
  const startY = window.pageYOffset || document.documentElement.scrollTop;
  const diff = targetY - startY;
  const startTime = performance.now();
  let interrupted = false;
  let inertia = false;
  let inertiaStart = 0;
  let inertiaDuration = 800; // 惯性滚动时长（ms），可根据需要调整
  let inertiaStartY = 0;
  let inertiaVelocity = 0;

  // 滚轮中断机制，进入惯性滚动阶段
  function onWheel(e) {
    if (!interrupted) {
      interrupted = true;
      inertia = true;
      inertiaStart = performance.now();
      inertiaStartY = window.pageYOffset || document.documentElement.scrollTop;
      // 估算惯性速度（正负号代表方向，数值可调节惯性感）
      inertiaVelocity = e.deltaY * 1.5; // 1.5 可调节惯性强度
      window.removeEventListener('wheel', onWheel, { passive: true });
    }
  }
  window.addEventListener('wheel', onWheel, { passive: true });

  function step(now) {
    if (!interrupted) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutCubic(progress);
      window.scrollTo(0, startY + diff * ease);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        window.removeEventListener('wheel', onWheel, { passive: true });
      }
    } else if (inertia) {
      // 惯性滚动阶段
      const elapsed = now - inertiaStart;
      const progress = Math.min(elapsed / inertiaDuration, 1);
      // easeOutCubic 让惯性更自然
      const ease = 1 - Math.pow(1 - progress, 3);
      // 计算惯性滚动距离
      const inertiaDistance = inertiaVelocity * (1 - ease);
      window.scrollTo(0, inertiaStartY + inertiaVelocity - inertiaDistance);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
  }
  requestAnimationFrame(step);
}

// 4. 所有锚点跳转：自定义曲线平滑滚动，index页面更慢，其它页面适中
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  // 只在本地页面（非外链）应用自定义曲线滚动
  var localPages = ['index.html', 'introduction.html', 'other.html', 'message.html'];
  var isLocal = localPages.some(function(name) {
    return window.location.pathname.endsWith(name);
  });
  if (!isLocal) return;

  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(function(anchor) {
    // 排除 .actions 区块下的 a（如Continue按钮等，保留原有平滑机制）
    if (anchor.closest('.actions')) return;
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href').slice(1);
      var target = document.getElementById(targetId) || document.querySelector('[name="' + targetId + '"]');
      if (target) {
        e.preventDefault();
        var rect = target.getBoundingClientRect();
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        var top = rect.top + scrollTop;
        var distance = Math.abs(top - scrollTop);
        // 所有页面统一速度：每1000px用1200ms，最短800ms，最长3000ms
        var duration = Math.min(3000, Math.max(800, distance / 1000 * 1200));
        smoothScrollTo(top, duration);
      }
    });
  });
});
// ====== 平滑滚动与锚点跳转相关功能 END ======

// 页面加载完成后检查URL中的锚点并滚动到对应位置
$(document).ready(function() {
	if (window.location.hash) {
		var target = window.location.hash;
		if (target === '#top') {
			// 滚动到页面顶部
			$('html, body').animate({ scrollTop: 0 }, 800);
		} else {
			// 滚动到指定位置
			var targetElement = $(target);
			if (targetElement.length) {
				$('html, body').animate({
					scrollTop: targetElement.offset().top
				}, 800);
			}
		}
	}

	// 为轮播图的"Learn More"链接添加点击事件处理
	$('.carousel a.scrolly').on('click', function(e) {
		e.preventDefault(); // 阻止默认跳转行为
		
		var targetId = $(this).attr('href');
		var targetElement = $(targetId);
		
		if (!targetElement.length) return;
		
		// 获取目标元素的父级article元素
		var targetArticle = targetElement.closest('article');
		
		// 检查目标文章是否被搜索功能隐藏
		var isTargetHidden = targetArticle.length && 
							 (targetArticle.css('display') === 'none' || 
							  targetArticle.is(':hidden'));
		
		var searchInput = document.getElementById('article-search');
		
		if (searchInput && searchInput.value.trim() !== '' && isTargetHidden) {
			// 停止当前所有动画，防止冲突
			$('html, body').stop(true, false);
			
			// 只有当目标文章被搜索隐藏时才清除搜索
			searchInput.value = ''; // 清空搜索框
			
			// 使用原生JavaScript触发input事件
			var inputEvent = new Event('input', {
				bubbles: true,
				cancelable: true
			});
			searchInput.dispatchEvent(inputEvent);
			
			// 计算跳转距离以确定等待时间
			var currentScrollTop = $(window).scrollTop();
			var targetOffsetTop = targetElement.offset().top;
			var jumpDistance = Math.abs(targetOffsetTop - currentScrollTop);
			
			// 远距离跳转需要更长的稳定时间
			var baseDelay = jumpDistance > 2000 ? 200 : 100; // 远距离使用200ms基础延迟
			var extraDelay = jumpDistance > 3000 ? 100 : 0;  // 超远距离额外100ms
			
			// 使用多重延迟确保DOM完全稳定
			setTimeout(function() {
				// 第一次等待DOM更新
				requestAnimationFrame(function() {
					// 第二次等待渲染完成
					requestAnimationFrame(function() {
						// 第三次等待布局稳定 - 远距离跳转使用更长时间
						setTimeout(function() {
							// 第四次等待确保远距离跳转完全稳定
							requestAnimationFrame(function() {
								var updatedTarget = $(targetId);
								if (updatedTarget.length && updatedTarget.is(':visible')) {
									// 根据距离调整动画速度
									var animationDuration = jumpDistance > 2000 ? 1200 : 1000;
									$('html, body').animate({
										scrollTop: updatedTarget.offset().top
									}, animationDuration, 'swing');
								}
							});
						}, baseDelay + extraDelay);
					});
				});
			}, 50);
		} else {
			// 如果搜索框为空或目标文章已可见，直接跳转
			$('html, body').stop(true, false).animate({
				scrollTop: targetElement.offset().top
			}, 800, 'swing');
		}
	});
});
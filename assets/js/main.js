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

	
 // 页面加载时淡入
 try {
	document.body.style.opacity = 0;
	window.addEventListener('DOMContentLoaded', function() {
	  document.body.style.opacity = 1;
	});
	// 所有内部链接点击时淡出再跳转
	document.querySelectorAll('a').forEach(function(link) {
	  if (link.hostname === window.location.hostname && !link.hasAttribute('target')) {
		link.addEventListener('click', function(e) {
		  if (link.getAttribute('href').startsWith('#') || link.getAttribute('href').startsWith('javascript:')) return;
		  e.preventDefault();
		  document.body.style.opacity = 0;
		  setTimeout(function() {
			window.location = link.href;
		  }, 300);
		});
	  }
	});
  } catch (e) { /* ignore */ }
  
})(jQuery);
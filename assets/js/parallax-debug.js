// 视差效果诊断和修复脚本
// 加载此脚本后，将在全局范围内提供diagnoseParallax()和fixParallax()函数

(function() {
    // 添加全局诊断函数
    window.diagnoseParallax = function() {
        console.group('视差效果诊断');
        
        // 检查元素是否存在
        const bg = document.getElementById('parallax_bg');
        const fg = document.getElementById('parallax_foreground');
        console.log('背景元素存在:', !!bg);
        console.log('前景元素存在:', !!fg);
        
        if (!bg || !fg) {
            console.error('视差元素不存在，无法继续诊断');
            console.groupEnd();
            return;
        }
        
        // 检查视差是否被明确禁用
        console.log('body类列表:', [...document.body.classList]);
        console.log('parallax-inactive类:', document.body.classList.contains('parallax-inactive'));
        console.log('windows-100-scaling类:', document.body.classList.contains('windows-100-scaling'));
        
        // 获取计算样式
        const bgComputed = getComputedStyle(bg);
        const fgComputed = getComputedStyle(fg);
        
        console.log('背景计算的transform:', bgComputed.transform);
        console.log('前景计算的transform:', fgComputed.transform);
        
        // 检查关键CSS属性
        console.log('背景position:', bgComputed.position);
        console.log('背景z-index:', bgComputed.zIndex);
        console.log('背景transform-style:', bgComputed.transformStyle);
        console.log('背景will-change:', bgComputed.willChange);
        
        console.log('前景position:', fgComputed.position);
        console.log('前景z-index:', fgComputed.zIndex);
        
        // 检查内联样式
        console.log('背景内联样式:', bg.style.cssText);
        console.log('前景内联样式:', fg.style.cssText);
        
        // 输出重要样式规则
        console.log('检查干扰CSS规则:');
        const relevantBgRules = findRelevantCSSRules('#parallax_bg');
        const relevantFgRules = findRelevantCSSRules('#parallax_foreground');
        
        console.log('作用于#parallax_bg的CSS规则:', relevantBgRules);
        console.log('作用于#parallax_foreground的CSS规则:', relevantFgRules);
        
        console.groupEnd();
        
        // 返回可能的原因
        if (bgComputed.transform === 'none' && fgComputed.transform !== 'none') {
            console.warn('诊断结果: 背景的transform被设为none，而前景正常。这可能是CSS规则干扰。');
            return '背景transform被强制为none';
        } else if (document.body.classList.contains('parallax-inactive')) {
            console.warn('诊断结果: parallax-inactive类存在，视差效果被禁用。');
            return 'parallax-inactive类禁用了视差';
        } else if (document.body.classList.contains('windows-100-scaling')) {
            console.warn('诊断结果: windows-100-scaling类存在，Windows缩放修复可能禁用了视差。');
            return 'windows-100-scaling类可能禁用了视差';
        }
        
        return '找不到明确原因，请检查控制台输出';
    };
    
    // 查找影响元素的CSS规则
    function findRelevantCSSRules(selector) {
        const rules = [];
        try {
            for (let i = 0; i < document.styleSheets.length; i++) {
                try {
                    const sheet = document.styleSheets[i];
                    // 跳过被CORS阻止的样式表
                    if (!sheet.cssRules) continue;
                    
                    for (let j = 0; j < sheet.cssRules.length; j++) {
                        const rule = sheet.cssRules[j];
                        if (rule.selectorText && 
                            (rule.selectorText === selector || 
                             rule.selectorText.includes(selector + ',') || 
                             rule.selectorText.includes(',' + selector) || 
                             rule.selectorText.includes(selector + ' ') || 
                             rule.selectorText.includes(' ' + selector) ||
                             rule.selectorText.includes(selector + ':') ||
                             rule.selectorText.includes(selector + '.'))) {
                            
                            if (rule.style && (rule.style.transform !== '' || rule.style.position !== '')) {
                                rules.push({
                                    selector: rule.selectorText,
                                    transform: rule.style.transform || 'not set',
                                    position: rule.style.position || 'not set',
                                    important: rule.style.getPropertyPriority('transform') || 'not important',
                                    source: sheet.href || 'inline style'
                                });
                            }
                        }
                    }
                } catch (e) {
                    // 忽略无法访问的样式表
                    console.log('无法访问样式表 #' + i + ': ' + e.message);
                }
            }
        } catch (e) {
            console.error('查找CSS规则时出错:', e);
        }
        return rules;
    }
    
    // 修复视差效果
    window.fixParallax = function() {
        console.group('应用视差修复');
        
        const bg = document.getElementById('parallax_bg');
        const fg = document.getElementById('parallax_foreground');
        
        if (!bg || !fg) {
            console.error('找不到视差元素，无法修复');
            console.groupEnd();
            return false;
        }
        
        // 移除可能干扰的类
        document.body.classList.remove('parallax-inactive');
        document.body.classList.remove('windows-100-scaling');
        
        // 应用直接内联样式修复
        bg.style.cssText += `
            transform-style: preserve-3d !important;
            will-change: transform !important;
            position: fixed !important;
            z-index: 0 !important;
        `;
        
        // 创建和应用强制使用JS变换的函数
        if (!window._parallaxFixInterval) {
            window._parallaxBgTransform = '';
            
            // 监控背景transform变化
            const originalSetTransform = Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype, 'transform').set;
            
            // 劫持transform设置
            Object.defineProperty(bg.style, 'transform', {
                set: function(value) {
                    console.log('拦截到transform设置:', value);
                    window._parallaxBgTransform = value;
                    // 使用cssText直接应用带!important的样式
                    this.cssText += `transform: ${value} !important; -webkit-transform: ${value} !important;`;
                },
                get: function() {
                    return window._parallaxBgTransform;
                }
            });
            
            // 监听鼠标移动，确保能触发视差效果
            document.getElementById('parallax_wrapper').addEventListener('mousemove', function(e) {
                // 仅记录，实际处理由原始事件处理程序完成
                console.log('监测到鼠标移动:', e.clientX, e.clientY);
            });
            
            console.log('已应用背景强制变换修复');
        }
        
        console.log('视差修复已应用，请移动鼠标测试效果');
        console.groupEnd();
        return true;
    };
    
    // 在页面加载完成后自动运行诊断
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            console.log('%c视差效果诊断工具已加载', 'font-weight:bold;color:#0066CC');
            console.log('请在控制台中执行以下命令:');
            console.log('%cdiagnoseParallax()', 'background:#eee;padding:3px;border-radius:3px');
            console.log('%cfixParallax()', 'background:#eee;padding:3px;border-radius:3px');
        }, 1000);
    });
})();
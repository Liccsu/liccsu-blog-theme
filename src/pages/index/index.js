/**
 * Sky Theme - 首页特定脚本
 * 仅在首页加载的JavaScript功能
 */

// 导入首页特定样式
import './index.css';

console.log('Sky Theme - 首页脚本已加载');

/**
 * 首页标题特效控制器
 * 使用立即执行函数避免变量名冲突
 */
(function() {
    'use strict';
    
    /**
     * 标题特效管理器
     */
    const TitleEffectsManager = {
        titleElement: null,
        decorationEffect: 'none',
        styleEffect: 'none',
        originalText: '',

        /**
         * 初始化标题特效
         */
        init() {
            // 查找标题元素
            this.titleElement = document.getElementById('main-title');
            if (!this.titleElement) {
                console.warn('未找到标题元素 #main-title');
                return;
            }

            // 获取配置的特效类型
            this.decorationEffect = this.titleElement.dataset.decorationEffect || 'none';
            this.styleEffect = this.titleElement.dataset.styleEffect || 'none';
            this.originalText = this.titleElement.dataset.originalText || this.titleElement.textContent.trim();

            console.log('标题特效配置:', {
                decoration: this.decorationEffect,
                style: this.styleEffect,
                text: this.originalText
            });

            // 应用特效
            this.applyEffects();
        },

        /**
         * 应用所有特效
         */
        applyEffects() {
            // 应用装饰特效
            this.applyDecorationEffect();
            
            // 应用样式特效
            this.applyStyleEffect();
        },

        /**
         * 应用装饰特效
         */
        applyDecorationEffect() {
            if (this.decorationEffect === 'none') return;

            // 为粒子和星光特效准备嵌套结构
            if (this.decorationEffect === 'effect-particles' || this.decorationEffect === 'effect-starlight') {
                this.titleElement.innerHTML = `<span><span><span>${this.originalText}</span></span></span>`;
            }

            // 添加装饰特效类
            this.titleElement.classList.add(this.decorationEffect);

            // 为霓虹边缘特效设置data-text属性
            if (this.decorationEffect === 'effect-neon-edge') {
                this.titleElement.setAttribute('data-text', this.originalText);
            }
        },

        /**
         * 应用样式特效
         */
        applyStyleEffect() {
            if (this.styleEffect === 'none') return;

            // 添加样式特效类
            this.titleElement.classList.add(this.styleEffect);

            // 为特定特效设置数据属性
            if (this.styleEffect === 'effect-marker-pop' || this.styleEffect === 'effect-diagonal-split') {
                this.titleElement.setAttribute('data-text', this.originalText);
            }
        }
    };

    /**
     * 页面加载完成后初始化
     */
    document.addEventListener('DOMContentLoaded', () => {
        TitleEffectsManager.init();
    });

})();

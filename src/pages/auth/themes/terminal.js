import './terminal.css';

/**
 * Terminal Theme Translation & Effects
 * Simulates a system boot/override by replacing text with "Geek" English.
 */
/**
 * Terminal Theme Translation & Effects
 * Simulates a system boot/override by replacing text with "Geek" English.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Text Replacements Map (Selector -> New Text)
    const textMap = {
        '.auth-title': 'SYSTEM ACCESS',
        '.auth-subtitle': 'Identify yourself to proceed.',
        'label[for="username"]': 'USER_ID',
        'label[for="plainPassword"]': 'PASSCODE', // Login
        'label[for="password"]': 'PASSCODE', // Signup
        'label[for="confirmPassword"]': 'CONFIRM_PASS', // Signup
        'label[for="email"]': 'EMAIL_ADDR', // Signup/Reset
        'label[for="displayName"]': 'ALIAS', // Signup
        'label[for="emailCode"]': 'AUTH_TOKEN', // Signup
        'label[for="phone"]': 'COMM_LINK', // Speculative
        'label[for="remember-me"]': 'PERSIST SESSION',
        '#emailCodeSendButton': 'TX_TOKEN', // Send Code Button
        '.auth-copyright': '', // Hide copyright
        'a[href="/"] span': 'ABORT_SESSION', // Back to home
    };

    // 2. Apply Text Replacements
    Object.entries(textMap).forEach(([selector, text]) => {
        const els = document.querySelectorAll(selector);
        els.forEach(el => {
            if (selector.includes('span')) {
                el.innerText = text;
            } else {
                el.innerText = text;
            }
        });
    });

    // Main Action Button (EXECUTE) - Exclude social login buttons
    const mainSubmitButtons = document.querySelectorAll('form:not(.social-auth-provider-form) button[type="submit"]');
    mainSubmitButtons.forEach(btn => btn.innerText = 'EXECUTE');

    // 3. Placeholder Replacements
    const placeholderMap = {
        '#username': 'Enter user_id...',
        '#plainPassword': 'Enter passcode...',
        '#password': 'Enter passcode...',
        '#confirmPassword': 'Confirm passcode...',
        '#email': 'Enter email_addr...',
        '#displayName': 'Enter alias...',
        '#emailCode': 'Input 6-digit token...',
        '#phone': 'Enter comm_link...',
    };

    Object.entries(placeholderMap).forEach(([selector, text]) => {
        const el = document.querySelector(selector);
        if (el) el.setAttribute('placeholder', text);
    });

    // 4. Special Handling for Links & Notices
    const forgotLink = document.querySelector('a[href*="password-reset"]');
    if (forgotLink) forgotLink.innerText = 'RESET_CREDENTIALS?';

    // Signup Page: "Have account? Login"
    const loginNotice = document.querySelector('a[href="/login"]');
    if (loginNotice) {
        loginNotice.innerText = 'INIT_SESSION';
        // Try to find the "Already have account?" span preceding it
        const parent = loginNotice.parentElement;
        if (parent) {
            const span = parent.querySelector('span');
            if (span) span.innerText = 'Identity detected? ';
        }
    }

    // Login Page: "No account? Register"
    const signupNotice = document.querySelector('a[href="/signup"]');
    if (signupNotice) {
        signupNotice.innerText = 'INIT_NEW_ID';
        const parent = signupNotice.parentElement;
        if (parent) {
            const span = parent.querySelector('span');
            if (span) span.innerText = 'No identity found? ';
        }
    }

    // 5. Social Provider Translation

    // 5. Social Provider Translation
    const providerMap = {
        '微信登录': 'WECHAT',
        '企业微信': 'WORK_WECHAT',
        'QQ登录': 'TENCENT_QQ',
        'GitHub': 'GITHUB',
        'Gitee': 'GITEE',
        '百度': 'BAIDU',
        '飞书': 'LARK',
        '钉钉': 'DINGTALK',
        '阿里云': 'ALIYUN'
    };

    // Target buttons in .social-auth-provider-form
    const socialButtons = document.querySelectorAll('.social-auth-provider-form button span');
    socialButtons.forEach(span => {
        const text = span.innerText.trim();
        // Check exact match or partial match if needed
        if (providerMap[text]) {
            span.innerText = providerMap[text];
        } else {
            // Fallback: uppercase whatever is there
            span.innerText = text.toUpperCase();
        }
    });

    // Divider text "其他登录方式"
    const dividerText = document.querySelector('.uppercase.tracking-wider');
    if (dividerText) dividerText.innerText = 'ALT_ACCESS_METHODS';
});

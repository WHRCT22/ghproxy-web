/**
 * 
 * 全局配置
 * 
 */
// 使用 Tailwind 配置深色模式
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {}
    }
}



/**
 * 
 * 全局变量
 * 
 */
// 选项卡配置
const tabs = {
    'git-clone': {
        title: 'Git Clone',
        content: 'git clone https://github.akams.cn/https://github.com/user/repo.git',
        guide: '使用 Git Clone 方式下载仓库：\n1. 复制生成的命令\n2. 在终端中粘贴并执行\n3. 等待克隆完成'
    },
    'wget-curl': {
        title: 'Wget && Curl',
        content: 'wget https://github.akams.cn/https://github.com/user/repo/archive/master.zip\ncurl -O https://proxy.akams.cn/https://github.com/user/repo/archive/master.zip',
        guide: '使用 Wget 或 Curl 下载：\n1. 选择需要的下载命令\n2. 在终端中执行命令\n3. 文件将下载到当前目录'
    },
    'direct-download': {
        title: 'Direct Download',
        content: 'https://github.akams.cn/https://github.com/user/repo/archive/master.zip',
        guide: '直接在浏览器中下载：\n1. 复制生成的链接\n2. 在浏览器中打开或右键另存为\n3. 选择保存位置并下载'
    }
};

// 当前选中的选项卡
let currentTab = 'git-clone';


// 定义代理源数组
const mirrors = [
    "https://gh.llkk.cc",
    "https://ghproxy.cn",
    "https://ghproxy.net",
    "https://gitproxy.click",
    "https://github.tbedu.top",
    "https://github.moeyy.xyz",
];

// 当前选中的代理节点
let currentProxy = 'github.akams.cn';



/**
 * 
 * 主题相关功能
 * 
 */
// 主题初始化
function initTheme() {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}

// 主题切换
function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark')
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.theme = 'light'
    } else {
        document.documentElement.classList.add('dark')
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.theme = 'dark'
    }
}



/**
 * 
 * 下载功能
 * 
 */
// 处理直接下载的函数
function handleDirectDownload() {
    // 获取输入的 URL
    const urlInput = document.querySelector('#github-url');
    const url = urlInput.value.trim();
    
    // 验证输入
    if (!url) {
        alert('请输入 GitHub 链接');
        return;
    }

    // 验证是否为有效的 GitHub URL
    // if (!validateGitHubUrl(url)) {
    //     alert('仅用于加速下载来自 GitHub 的资源！');
    //     return;
    // }
    if (url.toLowerCase().indexOf("github".toLowerCase()) < 0) {
        alert('仅用于加速下载来自 GitHub 的资源！');
        return;
    }

    // 生成代理 URL
    const proxyUrl = generateProxyUrl(url);
    
    // 在新窗口打开下载链接
    window.open(proxyUrl, '_blank');
}



/**
 * 
 * 输入框下拉菜单功能
 * 
 */
// 切换代理下拉菜单
function toggleProxyDropdown() {
    const dropdown = document.getElementById('proxy-dropdown');
    dropdown.classList.toggle('hidden');
}

// 更新选择代理
function selectProxy(name, url) {
    document.getElementById('selected-proxy').textContent = name;
    // 更新当前代理源，移除 https:// 前缀
    currentProxy = new URL(url).hostname;
    document.getElementById('proxy-dropdown').classList.add('hidden');
    
    // 如果输入框有值，重新生成链接
    const urlInput = document.getElementById('github-url');
    if (urlInput.value.trim()) {
        updateProxyUrl();
    }
}

// 初始化代理选项时设置默认值
function generateProxyOptions() {
    const dropdown = document.getElementById('proxy-dropdown');
    const options = mirrors.map(url => {
        const domain = new URL(url).hostname;
        return {
            value: url,
            text: domain
        };
    });

    // 生成下拉菜单HTML，修改按钮样式为居中
    dropdown.innerHTML = `
        <div class="py-1">
            ${options.map(option => `
                <button class="w-full px-4 py-2 text-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" 
                        onclick="selectProxy('${option.text}', '${option.value}')">
                    ${option.text}
                </button>
            `).join('')}
        </div>
    `;

    // 设置默认选中的代理
    currentProxy = new URL(mirrors[0]).hostname;
    document.getElementById('selected-proxy').textContent = currentProxy;
}



/**
 * 
 * 选项卡相关功能
 * 
 */
// 更新代理 URL
function updateProxyUrl() {
    const urlInput = document.querySelector('#github-url');
    const url = urlInput.value.trim();
    if (!url) {
        alert('请输入 GitHub 链接');
        return;
    }
    const proxyUrl = generateProxyUrl(url);
    // 更新所有选项卡的内容
    tabs['git-clone'].content = `git clone ${proxyUrl}`;
    tabs['wget-curl'].content = `wget ${proxyUrl}\ncurl -O ${proxyUrl}`;
    tabs['direct-download'].content = proxyUrl;
    // 更新当前选项卡显示
    renderTabContent(currentTab);
}

// 更新选项卡内容
function renderTabContent(tabId) {
    const hasInput = document.querySelector('#github-url').value.trim() !== '';
    const tabButtons = document.querySelectorAll('[data-tab]');
    const contentArea = document.querySelector('#tab-content');
    
    // 更新选项卡样式
    tabButtons.forEach(button => {
        if (button.dataset.tab === tabId) {
            button.classList.add('text-blue-500', 'border-b-2', 'border-blue-500');
            button.classList.remove('text-gray-500', 'hover:text-gray-700');
        } else {
            button.classList.remove('text-blue-500', 'border-b-2', 'border-blue-500');
            button.classList.add('text-gray-500', 'hover:text-gray-700');
        }
    });

    // 更新内容
    if (hasInput) {
        if (tabId === 'wget-curl') {
            const [wgetCmd, curlCmd] = tabs[tabId].content.split('\n');
            contentArea.innerHTML = `
                <div class="code-block">
                    <div class="code-content bg-gray-50 dark:bg-gray-700 font-mono dark:text-gray-200">
                        <div class="text-center">${wgetCmd}</div>
                    </div>
                    <div class="copy-buttons">
                        <button class="copy-btn" onclick="copyToClipboard('${wgetCmd.replace(/'/g, "\\'")}', this)">
                            <i class="fas fa-copy"></i>
                            <span>复制</span>
                        </button>
                    </div>
                </div>
                <div class="code-block">
                    <div class="code-content bg-gray-50 dark:bg-gray-700 font-mono dark:text-gray-200">
                        <div class="text-center">${curlCmd}</div>
                    </div>
                    <div class="copy-buttons">
                        <button class="copy-btn" onclick="copyToClipboard('${curlCmd.replace(/'/g, "\\'")}', this)">
                            <i class="fas fa-copy"></i>
                            <span>复制</span>
                        </button>
                    </div>
                </div>
            `;
        } else {
            contentArea.innerHTML = `
                <div class="code-block">
                    <div class="code-content bg-gray-50 dark:bg-gray-700 font-mono dark:text-gray-200">
                        <div class="text-center">${tabs[tabId].content}</div>
                    </div>
                    <div class="copy-buttons">
                        <button class="copy-btn" onclick="copyToClipboard('${tabs[tabId].content.replace(/'/g, "\\'")}', this)">
                            <i class="fas fa-copy"></i>
                            <span>复制</span>
                        </button>
                    </div>
                </div>
            `;
        }
    } else {
        // 无输入时显示使用说明
        contentArea.innerHTML = `
            <div class="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-900/50 rounded-lg p-2">
                <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 pt-0.5">
                        <i class="fas fa-info-circle text-blue-400"></i>
                    </div>
                    <div class="flex-grow">
                        <p class="text-blue-700 dark:text-blue-200 text-sm leading-5">
                            ${tabs[tabId].guide}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
}



/**
 * 
 * 复制功能
 * 
 */
// 复制到剪贴板
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text)
        .then(() => {
            // 更新按钮状态
            const icon = button.querySelector('i');
            const span = button.querySelector('span');
            
            // 保存原始状态
            const originalIcon = 'fas fa-copy';
            const originalText = '复制';
            
            // 更改为成功状态
            icon.className = 'fas fa-check';
            span.textContent = '已复制';
            button.classList.add('copy-success');
            
            // 2秒后恢复原始状态
            setTimeout(() => {
                icon.className = originalIcon;
                span.textContent = originalText;
                button.classList.remove('copy-success');
            }, 2000);
        })
        .catch(err => {
            console.error('复制失败:', err);
            button.classList.add('copy-error');
            
            setTimeout(() => {
                button.classList.remove('copy-error');
            }, 2000);
        });
}



/**
 * 
 * 辅助函数
 * 
 */
// URL 处理和验证
function validateGitHubUrl(url) {
    // GitHub URL 正则表达式 - 支持所有 GitHub 相关域名、子域名及 .git 链接
    const githubRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)*(github(usercontent)?\.com)/i;
    return githubRegex.test(url);
}

// 生成代理 URL 的函数
function generateProxyUrl(url) {
    if (!url) return '';
    // 移除可能存在的协议前缀
    url = url.replace(/^(https?:\/\/)/, '');
    return `https://${currentProxy}/https://${url}`;
}

// 显示错误消息
function showError(message) {
    const input = document.querySelector('#github-url');
    input.classList.add('border-red-500', 'focus:ring-red-500');
    
    // 显示错误消息
    const errorDiv = document.createElement('div');
    errorDiv.className = 'text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    
    const existingError = input.parentNode.querySelector('.text-red-500');
    if (existingError) {
        existingError.remove();
    }
    
    input.parentNode.appendChild(errorDiv);
    
    // 3秒后清除错误状态
    setTimeout(() => {
        input.classList.remove('border-red-500', 'focus:ring-red-500');
        errorDiv.remove();
    }, 3000);
}



/**
 *
 * 节点检测代码
 *
 */
const MirrorsChecker = {
    // 状态数据
    state: {
        mirrors: [], // 节点数组
        stats: {
            total: 0,
            success: 0,
            failed: 0
        }
    },

    // 添加显示配置
    config: {
        showServer: false,
        showIP: false,
        showLocation: false,
        showSpeed: false
    },

    // API 相关方法
    api: {
        async getMirrors() {
            try {
                console.log('开始获取节点列表...');
                const response = await fetch('https://api.akams.cn/github');
                console.log('API响应:', response);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('API返回数据:', data);
                
                if (data.code === 200 && Array.isArray(data.data) && data.data.length > 0) {
                    console.log('成功获取节点列表:', data.data);
                    // 从 data 数组中提取 url 字段
                    MirrorsChecker.state.mirrors = data.data.map(item => ({
                        value: item.url,
                        text: new URL(item.url).hostname,
                        // 可选：保存其他信息供后续使用
                        server: item.server,
                        ip: item.ip,
                        location: item.location,
                        baseLatency: item.latency,
                        speed: item.speed
                    }));
                    
                    MirrorsChecker.state.stats.total = data.data.length;
                    console.log('总节点数:', MirrorsChecker.state.stats.total);
                    
                    // 清空现有表格内容
                    const tbody = document.getElementById('mirrors-tbody');
                    tbody.innerHTML = '';
                    
                    const isMobile = window.innerWidth < 640;
                    
                    // 为每个节点创建表格行
                    MirrorsChecker.state.mirrors.forEach(mirror => {
                        const template = document.getElementById('mirror-row-template');
                        const row = template.content.cloneNode(true).querySelector('tr');
                        
                        const nameCell = row.querySelector('.mirror-name-cell');
                        const nameSpan = nameCell.querySelector('.mirror-name');
                        
                        nameSpan.textContent = mirror.text;
                        nameCell.title = mirror.text;
                        
                        if (isMobile) {
                            // 移动端模板
                            row.innerHTML = `
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                    <div class="mirror-name-cell" title="${mirror.text}">
                                        <span class="mirror-name">${mirror.text}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <span class="mirror-delay">-</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                                    <button class="select-mirror-btn px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm">
                                        选择此节点
                                    </button>
                                </td>`;
                        }
                        
                        tbody.appendChild(row);
                    });
                } else {
                    throw new Error('API返回数据格式错误: ' + JSON.stringify(data));
                }
            } catch (error) {
                console.error('获取节点列表失败:', error);
                throw new Error('获取节点列表失败: ' + error.message);
            }
        },

        testMirror(mirror, element) {
            console.log('开始测试节点:', mirror.text);
            if (!mirror.value.endsWith('/')) mirror.value += '/';
            
            return new Promise((resolve) => {
                const start = Date.now();
                const img = new Image();

                img.onload = () => {
                    const time = Date.now() - start;
                    console.log(`节点 ${mirror.text} 测试成功, 延迟: ${time}ms`);
                    const result = { mirror: mirror.value, time, success: true };
                    MirrorsChecker.ui.updateResult(element, result);
                    MirrorsChecker.state.stats.success++;
                    resolve(result);
                };

                img.onerror = () => {
                    const time = Date.now() - start;
                    console.log(`节点 ${mirror.text} 测试失败, 用时: ${time}ms`);
                    const result = { mirror: mirror.value, time, success: false };
                    MirrorsChecker.ui.updateResult(element, result);
                    MirrorsChecker.state.stats.failed++;
                    resolve(result);
                };

                const testUrl = `${mirror.value}https://raw.githubusercontent.com/microsoft/vscode/main/resources/linux/code.png?t=${Date.now()}`;
                console.log('测试URL:', testUrl);
                img.src = testUrl;

                // 设置超时
                setTimeout(() => {
                    if (!img.complete) {
                        console.log(`节点 ${mirror.text} 测试超时`);
                        img.src = '';
                        const result = { mirror: mirror.value, time: 5000, success: false };
                        MirrorsChecker.ui.updateResult(element, result);
                        MirrorsChecker.state.stats.failed++;
                        resolve(result);
                    }
                }, 5000);
            });
        }
    },

    // UI 更新方法
    ui: {
        updateProgress(progress) {
            const progressBar = document.getElementById('progress-bar');
            progressBar.style.width = `${Math.round(progress)}%`;
            
            // 添加进度条动画
            progressBar.style.transition = 'width 300ms ease-out';
        },

        updateResult(element, result) {
            if (!element) return;
            const isMobile = window.innerWidth < 640;
            const delaySpan = element.querySelector('.mirror-delay');
            const statusSpan = !isMobile ? element.querySelector('.mirror-status') : null;
            const button = element.querySelector('.select-mirror-btn');

            // 更新延迟显示
            if (delaySpan) {
                delaySpan.textContent = result.success ? `${result.time}ms` : '超时';
                delaySpan.className = 'mirror-delay';
                if (result.success) {
                    if (result.time < 500) delaySpan.classList.add('text-green-500');
                    else if (result.time < 1000) delaySpan.classList.add('text-yellow-500');
                    else delaySpan.classList.add('text-red-500');
                } else {
                    delaySpan.classList.add('text-gray-900', 'dark:text-gray-200'); // 只在超时时添加灰白色
                }
            }

            // 更新状态显示 - 仅在非移动端显示
            if (statusSpan && !isMobile) {
                statusSpan.innerHTML = result.success ? 
                    `<i class="fas fa-check-circle mr-2 text-green-500"></i><span class="text-gray-900 dark:text-gray-200">可用</span>` :
                    `<i class="fas fa-times-circle mr-2 text-red-500"></i><span class="text-gray-900 dark:text-gray-200">不可用</span>`;
            }

            // 更新按钮状态
            if (button) {
                button.disabled = !result.success;
                if (result.success) {
                    button.classList.remove('opacity-50', 'cursor-not-allowed');
                    button.onclick = () => selectProxy(new URL(result.mirror).hostname, result.mirror);
                } else {
                    button.classList.add('opacity-50', 'cursor-not-allowed');
                }
            }
        },

        showStats() {
            const { total, success, failed } = MirrorsChecker.state.stats;
            const container = document.getElementById('mirrors-container');
            
            // 添加统计信息到表格上方
            const statsHtml = `
                <div class="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-500 dark:text-gray-400">总节点数：${total}</span>
                        <span class="text-green-500">可用节点：${success}</span>
                        <span class="text-red-500">失败节点：${failed}</span>
                    </div>
                </div>
            `;
            
            container.querySelector('.overflow-x-auto').insertAdjacentHTML('beforebegin', statsHtml);
        }
    },

    // 工具方法
    utils: {
        sortByLatency() {
            const tbody = document.getElementById('mirrors-tbody');
            const rows = Array.from(tbody.getElementsByTagName('tr'));
            const isMobile = window.innerWidth < 640;
            
            rows.sort((a, b) => {
                // 获取延迟值
                const delayA = parseInt(a.querySelector('.mirror-delay').textContent) || Infinity;
                const delayB = parseInt(b.querySelector('.mirror-delay').textContent) || Infinity;
                
                // 移动端只按延迟排序，PC端先按状态后按延迟排序
                if (!isMobile) {
                    const statusA = a.querySelector('.mirror-status');
                    const statusB = b.querySelector('.mirror-status');
                    const successA = statusA && statusA.textContent.includes('可用');
                    const successB = statusB && statusB.textContent.includes('可用');
                    
                    if (successA !== successB) return successB - successA;
                }
                
                // 按延迟排序
                return delayA - delayB;
            });

            tbody.innerHTML = '';
            rows.forEach(row => tbody.appendChild(row));
        }
    },

    // 初始化方法
    async init() {
        try {
            await this.api.getMirrors();
            
            // 更新表格列显示
            this.updateTableColumns();
            
            // 2. 获取所有表格行元素
            const tbody = document.getElementById('mirrors-tbody');
            const rows = Array.from(tbody.getElementsByTagName('tr'));
            
            // 3. 初始化进度
            let progress = 0;
            this.ui.updateProgress(progress);
            
            // 4. 并发执行所有节点检测
            const promises = this.state.mirrors.map((mirror, index) => {
                return this.api.testMirror(mirror, rows[index]).then(result => {
                    // 更新进度
                    progress += (100 / this.state.mirrors.length);
                    this.ui.updateProgress(progress);
                    return result;
                });
            });

            // 5. 等待所有检测完成
            await Promise.all(promises);
            
            // 6. 按延迟排序
            this.utils.sortByLatency();
            
            // 7. 显示统计信息
            this.ui.showStats();
            
        } catch (error) {
            console.error('Mirrors Checker Error:', error);
            throw error;
        }
    },

    // 添加切换显示的函数
    toggleColumnVisibility(columnName, show) {
        if (columnName in this.config) {
            this.config[columnName] = show;
            // 如果表格已经存在，实时更新显示
            const container = document.getElementById('mirrors-container');
            if (!container.classList.contains('hidden')) {
                this.updateTableColumns();
            }
        }
    },

    // 更新表格列显示
    updateTableColumns() {
        const isMobile = window.innerWidth < 640;
        const thead = document.querySelector('#mirrors-container thead tr');
        const tbody = document.querySelector('#mirrors-container tbody');
        const rows = tbody.getElementsByTagName('tr');

        if (isMobile) {
            // 移动端只显示基础列
            thead.innerHTML = `
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    节点
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    延迟
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    操作
                </th>`;
            
            // 更新每一行只显示基础列
            Array.from(rows).forEach(row => {
                const mirror = this.state.mirrors.find(m => 
                    m.text === row.querySelector('.mirror-name-cell').textContent
                );
                if (mirror) {
                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                            <div class="mirror-name-cell" title="${mirror.text}">
                                <span class="mirror-name">${mirror.text}</span>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                            <span class="mirror-delay">${row.querySelector('.mirror-delay').textContent}</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <button class="select-mirror-btn px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm">
                                选择此节点
                            </button>
                        </td>`;
                }
            });
            return;
        }

        // 更新表头
        this.updateTableHeader(thead);

        // 更新每一行的数据
        Array.from(rows).forEach(row => {
            const mirror = this.state.mirrors.find(m => 
                m.text === row.querySelector('.mirror-name-cell').textContent
            );
            if (mirror) {
                this.updateTableRow(row, mirror);
            }
        });
    },

    // 更新表头
    updateTableHeader(thead) {
        // 保留原有的基础列
        const baseColumns = `
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                节点
            </th>`;

        // 动态添加额外列
        let extraColumns = '';
        if (this.config.showServer) {
            extraColumns += `
                <th class="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    服务商
                </th>`;
        }
        if (this.config.showIP) {
            extraColumns += `
                <th class="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    IP
                </th>`;
        }
        if (this.config.showLocation) {
            extraColumns += `
                <th class="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    地区
                </th>`;
        }
        if (this.config.showSpeed) {
            extraColumns += `
                <th class="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    速度
                </th>`;
        }

        // 添加基础列
        extraColumns += `
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                延迟
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                状态
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                操作
            </th>`;

        thead.innerHTML = baseColumns + extraColumns;
    },

    // 更新表格行
    updateTableRow(row, mirror) {
        // 保留原有的节点名称列
        const nameCell = row.querySelector('.mirror-name-cell').parentElement;
        const delayCell = row.querySelector('.mirror-delay').parentElement;
        const statusCell = row.querySelector('.mirror-status').parentElement;
        const actionCell = row.querySelector('.select-mirror-btn').parentElement;

        // 创建新的行内容
        let newCells = [nameCell];

        // 动态添加额外列
        if (this.config.showServer) {
            newCells.push(this.createCell(mirror.server || '-', 'hidden md:table-cell'));
        }
        if (this.config.showIP) {
            newCells.push(this.createCell(mirror.ip || '-', 'hidden md:table-cell'));
        }
        if (this.config.showLocation) {
            newCells.push(this.createCell(mirror.location || '-', 'hidden md:table-cell'));
        }
        if (this.config.showSpeed) {
            newCells.push(this.createCell(mirror.speed ? `${mirror.speed.toFixed(2)}` : '-', 'hidden md:table-cell'));
        }

        // 添加基础列
        newCells.push(delayCell, statusCell, actionCell);

        // 更新行内容
        row.innerHTML = '';
        newCells.forEach(cell => row.appendChild(cell));
    },

    // 创建表格单元格
    createCell(content, className = '') {
        const td = document.createElement('td');
        td.className = `px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 ${className}`;
        td.textContent = content;
        return td;
    }
};



/**
 *
 * 初始化代码
 *
 */
// 等待 DOM 加载完成,进行初始化
document.addEventListener('DOMContentLoaded', function() {

    // 初始化主题模式
    initTheme();

    // 初始化代理选项
    generateProxyOptions();
    // 初始化选项卡显示
    renderTabContent(currentTab);


    // 绑定选项卡切换事件
    document.querySelectorAll('[data-tab]').forEach(button => {
        button.addEventListener('click', () => {
            currentTab = button.dataset.tab;
            renderTabContent(currentTab);
        });
    });


    const urlInput = document.querySelector('#github-url');
    const downloadButton = document.querySelector('#download-button');

    // 绑定下载按钮事件
    downloadButton.addEventListener('click', handleDirectDownload);
    // 绑定输入框回车事件
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleDirectDownload();
        }
    });

    // 输入框变化监听
    urlInput.addEventListener('input', function() {
        if (this.value.trim()) {
            updateProxyUrl();
        } else {
            // 清空时显示使用说明
            renderTabContent(currentTab);
        }
    });


    // 检测点击事件
    document.addEventListener('click', function(e) {
        // 点击其他区域关闭代理下拉菜单
        const proxySelector = document.getElementById('proxy-selector');
        const proxyDropdown = document.getElementById('proxy-dropdown');
        if (!proxySelector.contains(e.target)) {
            proxyDropdown.classList.add('hidden');
        }
    });


    // 节点检测按钮事件监听
    document.getElementById('check-mirrors-btn').addEventListener('click', async function() {
        try {
            console.log('开始节点检测...');
            const container = document.getElementById('mirrors-container');
            container.classList.remove('hidden');
            
            // 重置状态
            MirrorsChecker.state.stats = { total: 0, success: 0, failed: 0 };
            
            // 开始检测
            console.log('调用 MirrorsChecker.init()...');
            await MirrorsChecker.init();
            console.log('节点检测完成');

            // 检测完成后显示提示
            const notification = document.createElement('div');
            notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-500 z-50';
            notification.textContent = '节点检测完成！';
            document.body.appendChild(notification);

            // 3秒后淡出消失
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 500);
            }, 3000);

        } catch (error) {
            console.error('节点检测失败:', error);
            // 显示详细错误信息
            const errorNotification = document.createElement('div');
            errorNotification.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
            errorNotification.textContent = `节点检测失败: ${error.message}`;
            document.body.appendChild(errorNotification);

            setTimeout(() => {
                errorNotification.style.opacity = '0';
                setTimeout(() => errorNotification.remove(), 500);
            }, 3000);
        }
    });

    // 绑定移动端菜单事件
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileCheckMirrorsBtn = document.getElementById('mobile-check-mirrors-btn');

    if (menuButton && mobileMenu && mobileCheckMirrorsBtn) {
        // 菜单按钮点击事件
        menuButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (mobileMenu.classList.contains('hidden')) {
                // 显示菜单
                mobileMenu.classList.remove('hidden');
                requestAnimationFrame(() => {
                    mobileMenu.classList.add('menu-slide-in');
                });
            } else {
                // 隐藏菜单
                closeMobileMenu();
            }
        });

        // 移动端节点检测按钮点击事件
        mobileCheckMirrorsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 触发桌面端检测按钮的点击事件
            const desktopBtn = document.getElementById('check-mirrors-btn');
            if (desktopBtn) {
                desktopBtn.click();
            }
            
            // 关闭移动端菜单
            closeMobileMenu();
        });

        // 点击页面其他区域关闭菜单
        document.addEventListener('click', function(e) {
            if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                if (!mobileMenu.classList.contains('hidden')) {
                    closeMobileMenu();
                }
            }
        });

        // ESC键关闭菜单
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                closeMobileMenu();
            }
        });

        // 关闭菜单的统一处理函数
        function closeMobileMenu() {
            mobileMenu.classList.add('menu-slide-out');
            
            // 等待动画结束后隐藏菜单
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('menu-slide-out', 'menu-slide-in');
            }, 200); // 与动画时长保持一致
        }
    }
    
    // 确保页面加载时菜单是隐藏的
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
    }

    // 窗口大小变化监听
    window.addEventListener('resize', () => {
        if (MirrorsChecker && !document.getElementById('mirrors-container').classList.contains('hidden')) {
            MirrorsChecker.updateTableColumns();
        }
    });

});
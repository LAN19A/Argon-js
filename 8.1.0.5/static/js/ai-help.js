// 生成唯一用户ID（基于设备和浏览器）
function generateUniqueUserId() {
    // 使用localStorage存储设备ID，确保同一设备生成相同ID
    let deviceId = localStorage.getItem('coze_device_id');

    if (!deviceId) {
        // 生成随机设备ID
        deviceId = 'device_' + Math.random().toString(36).substr(2, 10);
        localStorage.setItem('coze_device_id', deviceId);
    }

    // 结合时间戳确保唯一性
    return `user_${deviceId}_${new Date().getTime()}`;
}

// 聊天记录管理器
class ChatHistoryManager {
    constructor(userId) {
        this.userId = userId;
        this.storageKey = `coze_chat_history_${userId}`;
    }

    // 获取历史记录
    getHistory() {
        const history = localStorage.getItem(this.storageKey);
        return history ? JSON.parse(history) : [];
    }

    // 保存消息
    saveMessage(message) {
        const history = this.getHistory();
        history.push(message);
        localStorage.setItem(this.storageKey, JSON.stringify(history));
    }

    // 清空历史记录
    clearHistory() {
        localStorage.removeItem(this.storageKey);
    }
}

// 生成唯一且固定的设备ID
function getPersistentDeviceId() {
    // 优先使用已存储的设备ID
    let deviceId = localStorage.getItem('coze_device_id');

    if (deviceId) {
        return deviceId;
    }

    // 生成新的设备ID
    // 使用浏览器指纹库（简化版）生成基于浏览器特征的ID
    const browserInfo = [
        navigator.userAgent,
        navigator.platform,
        navigator.language,
        screen.width,
        screen.height,
        screen.colorDepth
    ].join('|');

    // 使用简单哈希算法生成ID（实际生产环境建议使用更安全的哈希函数）
    const hashCode = str => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(36);
    };

    deviceId = `device_${hashCode(browserInfo)}_${new Date().getTime().toString(36)}`;

    // 存储到本地
    localStorage.setItem('coze_device_id', deviceId);

    return deviceId;
}

function getToken() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: DxConfig.api.base+'coze/getSimpleToken',
            data: JSON.stringify({
                // 使用固定的设备ID作为sessionName
                sessionName: getPersistentDeviceId()
            }),
            dataType: 'json',
            contentType: 'application/json',
            success: function (result) {
                if (result.code === 0) {
                    resolve(result.data);
                } else {
                    reject(new Error(`Token获取失败: ${result.msg}`));
                }
            },
            error: function (xhr, status, error) {
                reject(new Error(`网络请求失败: ${status} ${error}`));
            }
        });
    });
}

// 其他代码保持不变...

async function initChatBot() {
    try {
        // 生成唯一用户ID
        const userId = generateUniqueUserId();
        console.log('用户ID:', userId);

        // 创建历史记录管理器
        const historyManager = new ChatHistoryManager(userId);

        // 获取Token
        const token = await getToken();

        // 恢复历史记录
        const history = historyManager.getHistory();
        console.log('恢复历史记录条数:', history.length);

        // 初始化SDK
        const chatClient = new CozeWebSDK.WebChatClient({
            config: {
                bot_id: '7510152149788672012',
            },
            auth: {
                type: 'token',
                token: token,
                onRefreshToken: async () => {
                    return await getToken();
                },
            },
            userInfo: {
                id: userId, // 使用生成的唯一ID
                url: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',
                nickname: '用户' + userId.substr(-5), // 使用ID后5位作为昵称
            },
            ui: {
                base: {
                    icon: 'https://s.pointshow.net/sysPrj/s/img/logo.png',//'./static/images/ai-help.jpg',
                    layout: 'pc',
                    lang: 'zh-CN',
                    zIndex: 9999,
                },
                chatBot: {
                    title: '智能客服',
                    uploadable: true,
                    width: 460
                },
                asstBtn: {
                    isNeed: true,
                },
                footer: {
                    isShow: false,
                    expressionText: '点秀',
                    linkvars: {
                        name: {
                            text: '官方网站',
                            link: 'https://www.pointshow.cn'
                        }
                    }
                }
            },

            // 消息钩子：用于缓存消息
            messageHooks: {
                // 消息发送前
                beforeSend: (message) => {
                    console.log('发送消息:', message);
                    historyManager.saveMessage({
                        type: 'user',
                        content: message,
                        timestamp: new Date().getTime()
                    });
                    return message;
                },

                // 消息接收后
                afterReceive: (message) => {
                    console.log('接收消息:', message);
                    historyManager.saveMessage({
                        type: 'bot',
                        content: message,
                        timestamp: new Date().getTime()
                    });
                    return message;
                }
            }
        });

        // 恢复历史消息到聊天界面
        if (history.length > 0) {
            setTimeout(() => {
                history.forEach(msg => {
                    if (msg.type === 'user') {
                        // 模拟用户发送历史消息
                        chatClient.sendMessage(msg.content);
                    } else {
                        // 模拟机器人回复历史消息
                        const event = new MessageEvent('message', {
                            data: JSON.stringify({
                                type: 'text',
                                content: msg.content
                            })
                        });
                        chatClient._handleMessage(event);
                    }
                });
            }, 1000); // 延迟执行，确保界面已初始化
        }

        return chatClient;

    } catch (error) {
        console.error('初始化失败:', error);
        alert('聊天机器人初始化失败，请刷新页面重试');
        throw error;
    }
}

// 初始化聊天机器人
initChatBot();
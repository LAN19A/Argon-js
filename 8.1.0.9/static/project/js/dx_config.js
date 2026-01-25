window.DxConfig = {
    VERSION:'r-8.1',
    CDN:'CLOUD', // 云:CLOUD     私有化:LOCAL
    ENV:'PROD', //  环境配置 必填项。【DEMO,DEV,TEST,PROD 】 【本地例子，开发，测试，正式】
    isOEM:('SAAS'+'')=='CUSTOMER',
    lang:(!!('zh'+'') ?('zh'+''):'zh'),
    url:{ // 链接
        base:'https://www.pointshow.net/',
        baseText:'www.pointshow.net',
        appDownload:'https://s.pointshow.net/sysPrj/p/app_down/down.html',
        help:'https://help.pointshow.net/#/',
        assets:'https://s.pointshow.net/',
        userAgreement:('https://s.pointshow.net/sysPrj/p/userAgreement/index.html'+''),
        market:!!('https://www.pointshow.net'+'')?('https://www.pointshow.net/#/appMarket'):''
    },
    api:{ // api地址
        base:'https://www.pointshow.net/api/',
        upload:'https://s.pointshow.net/',
        thumbnail:'https://www.pointshow.net/is/',
        websocket:'wss://www.pointshow.net/api/dispatch?t={0}&m={1}',
        ossAli:'https://oss.aliyuncs.com',
        ossHuawei:'https://obs.cn-east-2.myhuaweicloud.com',
        ossQINIU:'https://oss.aliyuncs.com',
        publishLED:'', // 九江附属医院的led屏幕
        parseDouYin:'' // 已废弃 王子做的版本
    },
    app:{ // 应用地址
        weather:'https://s.pointshow.net/sysPrj/c/weather/index.html',
        poster:'https://s.pointshow.net/sysPrj/download/poster.zip',
        richText:'https://s.pointshow.net/sysPrj/download/richText.zip'
    },
    key:{
        BMap:('L2LepQsX6v5uEpk3440SD8xk'+''), // 百度地图
        BHm:('6ce4d26be8d4f4985e6b8cdcf7506f3f'+'')  // 百度统计
    },
    info:{
        company:{
            name:('上海点秀信息技术有限公司'+''),
            mobile:('13651729168'+''),
            saleMobile:('18621269878'+''),
            sales:('陈贤火'+''),
            address:(''+''),
            email:(''+''),
            logo:('./static/project/img/logo.png'+''),
            ICP: ('沪ICP备18022081号'+''),
            PSBICPNAME:('沪公网安备'+''),
            PSBICPVALUE:('31011702006349'+''),
        },
        product:{
            name:('点秀'+'')
        }
    },
    featureDisabled:{
        SMS:('%FEATURE_DISABLED_SMS%'+'')=='true',   // 是否关闭短信
        pay:('%FEATURE_DISABLED_PAY%'+'')=='true',   // 是否关闭支付
        thumbnail:('%FEATURE_DISABLED_THUMBNAIL%'+'')=='true', // 是否关闭缩略图
        map:('%FEATURE_DISABLED_MAP%'+'')=='true',  // 是否关闭地图
        posterMarket:('%FEATURE_DISABLED_POSTER_MARKET%'+'')=='true', // 是否关闭海报市场
        addNewAccount:('%FEATURE_DISABLED_ADD_NEW_ACCOUNT%'+'')=='true',//是否关闭添加新账号
        upgradeMerchant:('%FEATURE_DISABLED_UPGRADE_MERCHANT%'+'')=='true',//是否关闭升级商户
        component:('%FEATURE_DISABLED_COMPONENT%'+'')=='true' ? ['weather_2','office','marketing']:[]
    },
    page:{
        login:{
            show:{
                logo:true,
                register:('SAAS'+'')!='CUSTOMER' && !(('%FEATURE_DISABLED_SMS%'+'')=='true'),
                forgetPassword:!(('%FEATURE_DISABLED_SMS%'+'')=='true'),
                wxScanLogin:!!('wxb47da9cbb8ff68e7'+''),
                version:true,
                company: !!('上海点秀信息技术有限公司'+'')
            },
            text:{
                title:'',
            }
        },
        forgetPassword:{
            show:{
                company: true,
                version:true
            }
        },
        register:{
            show:{
                company: true,
                version:true
            }
        },
        m_home:{
            show:{
                logo:true,
                version:true,
                download:('SAAS'+'')!='CUSTOMER',
                help:('SAAS'+'')!='CUSTOMER',
                support:('SAAS'+'')!='CUSTOMER',
                company: ('%MERCHANT_SHOW_HOME_COMPANY%'+'') != 'false',
                vipVersion:!(('%FEATURE_DISABLED_PAY%'+'')=='true'),
                news: ('dianxiu_prod'+'').indexOf('dianxiu')>-1
            },
            css:{
                logo:{
                    w:120  // w > 80  w < 160   h<64
                }
            }
        },
        mineCenter:{
            show:{
                amendPwd:('true'+'') != 'false',
                unBindWX:!!('wxb47da9cbb8ff68e7'+'')
            }
        },
        app_image_config:{
            show:{
                auth:('%MERCHANT_SHOW_SETTING_AUTH%'+'') != 'false',
            }
        }
    },
    help:{
        show:('SAAS'+'')!='CUSTOMER',
        '110_1_100':'component/html?id=播放配置',
        '100_1_1':'question/controlList',
        '100_1_2':'question/controlList',
        '100_1_3':'start/wall',
        root: 'https://help.pointshow.net/docs/',
        terminal: {
            lpscreen: {
                url: 'help/use/app/lpscreen',
                tip: '联屏使用指南'
            },
            installTVApp:{
                url: 'docs/help/quick/install',
                tip: '电视安装点秀应用的方法'
            },
            screenPoint:{
                url: 'product/pc/terminal/equipment#旋转屏幕',
                tip: '横屏电视机设置成竖屏的方法'
            }
        },
        channel: {
            level: {
                url: 'help/use/sys/priority',
                tip: '排期的优先级说明'
            },
            create:{
                url:'product/pc/schedule/schedule',
                tip:'排期制作使用指南'
            }
        },
        component: {
            html: {
                whiteList: {
                    url: 'product/pc/component/web#白名单',
                    tip: '域名白名单的使用说明'
                },
                networkCheck: {
                    url: 'help/use/assembly/netcheck',
                    tip: '域名网络检查的使用说明'
                },
                autoScroll: {
                    url: 'product/pc/component/web#滚动设置',
                    tip: '过长网页自动翻屏滚动的使用说明'
                }
            },
            douyin: {
                url: 'product/pc/component/DY',
                tip: '抖音的使用说明'
            },
            stream: {
                url: 'help/use/app/streaming',
                tip: '流媒体的使用说明'
            }
        },
        publish: {
            quick: {
                url: 'product/pc/publish/quickrelease',
                tip: '快捷发布的注意事项'
            },
            ogs:{
                url: 'product/pc/publish/ogs',
                tip: '排期关系的使用说明'
            }
        },
        resource: {
            url: 'help/use/resource/media',
            tip: '资源制作及上传的详细使用说明'
        },
        cmd: {
            orientation: {
                url: 'help/use/sys/orientation',
                tip: '设备显示方向说明'
            },
            shutdown: {
                url: 'help/quick/buy',
                tip: '部分设备支持，点击查看支持的设备清单。'
            }
        },
        program:{
            default:{
                url:'product/pc/component/editor',
                tip:'节目制作使用指南'
            },
            poster:{
                url:'product/pc/component/poster',
                tip:'海报制作使用指南'
            }
        }
    }
};

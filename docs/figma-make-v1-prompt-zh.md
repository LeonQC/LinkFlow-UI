# LinkFlow Figma Make 初版 UI 生成提示词（可编辑）

将下面整段提交到 Figma Make：

```text
请为「LinkFlow 智能短链平台」生成可在 Figma 内继续编辑的初版高保真 UI（MVP V1）。

【项目定位】
- 产品：高并发短链 + 实时数据分析 + AI 风控平台
- 用户角色：普通用户（创建和分析短链）、管理员（风控审核和系统监控）
- 目标：先覆盖核心业务闭环，再支持后续扩展

【设计基调】
- 风格：现代、专业、数据产品风格，强调信息密度与可读性
- 关键词：实时感、可靠性、可观测性、低学习成本
- 圆角：10~12
- 栅格：Desktop 12列，Mobile 4列
- 间距系统：8pt
- 阴影：轻量卡片阴影

【颜色与字体（必须建立为可编辑样式/变量）】
- 主色 Primary：#2563EB
- 成功 Success：#10B981
- 警告 Warning：#F59E0B
- 危险 Danger：#EF4444
- 中性色：#0F172A, #334155, #64748B, #CBD5E1, #F1F5F9, #FFFFFF
- 字体：Inter + Noto Sans SC
- 字号层级：12/14/16/20/24/32

【页面范围（同时输出 Desktop 1440 与 Mobile 390）】
1) 登录/注册页
- 登录：邮箱/用户名 + 密码，记住我，忘记密码
- 注册：邮箱、用户名、密码、确认密码
- 右侧展示产品价值点：高并发跳转、实时分析、AI 风险识别

2) 用户端总览 Dashboard（核心首页）
- 顶部：时间窗口切换（15m / 1h / 24h）、创建短链按钮、用户菜单
- KPI 卡片：总点击、活跃用户、实时QPS、风险事件数
- 中区图表：点击趋势（折线）、地域分布（地图/条形）、渠道占比（环图）
- 右侧实时面板：热门短链 Top10、WebSocket 连接状态（已连接/重连中）

3) 短链管理页（Create/List/Edit）
- 筛选区：搜索、状态、渠道、日期范围
- 表格字段：短链、原始URL、渠道、状态、点击量、创建时间、操作
- 新建短链弹窗：long_url、custom_slug、channel、expires_at
- 行内操作：复制短链、查看详情、编辑、停用/删除

4) 短链详情页
- 基本信息卡：slug、short_url、long_url、状态、到期时间
- 数据分析：时间序列、地区分布、渠道分布
- 历史访问日志列表：时间、IP、国家/城市、设备、来源
- AI模块卡片：分类结果、风险评分、推荐标签

5) 风控告警页（管理员）
- 告警列表：风险级别、链接、触发时间、检测来源（HF/GSB）、状态
- 详情抽屉：风险报告、命中规则、历史处置记录
- 审核动作：通过、拦截、加入域名黑名单、加入URL黑名单
- 强调高风险视觉层级（Danger 色 + 标签）

6) 系统监控页（管理员）
- 服务健康卡片：API、Redis、Kafka、RabbitMQ、Flink
- 指标图：延迟、错误率、吞吐量
- Pipeline 状态时间线：normal / degraded / recovered

【组件系统（必须组件化 + Variants）】
- 按钮：Primary / Secondary / Ghost / Danger / Disabled
- 输入组件：Default / Focus / Error / Disabled
- 表格：默认行 / hover / 选中 / 告警行
- 标签：状态标签（active, paused, blocked, expired）
- Toast 与空状态、加载骨架屏、错误状态
- 顶部导航、侧边栏、面包屑、分页器

【交互与动效】
- 页面切换使用轻量过渡（200ms）
- 实时数据模块有轻微脉冲更新动效
- WebSocket 断连时显示横幅告警 + 重连按钮
- 所有弹窗和抽屉支持明确关闭路径

【文案语言】
- 全部使用中文真实业务文案，禁止 Lorem Ipsum
- 文案风格：简洁、运营可读、偏平台管理后台

【可编辑性硬要求】
- 使用 Auto Layout 构建主要布局
- 建立并应用颜色、字体、间距样式（Styles/Variables）
- 组件实例可复用，命名清晰（如 component/button/primary）
- 图层命名语义化（如 page/dashboard/kpi-total-clicks）
- 不要输出位图化文字，不要将核心结构扁平化

【交付组织】
- 一个 Figma 页面内分区展示：
  - 00 Cover
  - 01 Design System
  - 02 User Flow
  - 03 Desktop Screens
  - 04 Mobile Screens
```


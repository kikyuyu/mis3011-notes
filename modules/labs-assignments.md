# 🧪 Lab & 作业考点：实战中的概念印证

> 考试范围明确包含 **assignments 和 class discussions**。Lab 不考操作，但 lab 里反复出现的**概念与坑**就是考题素材。本页把每个 Lab/作业与对应 lecture 的考点挂钩。

## Lab 地图总览

| Lab | 主题 | 核心概念 | 对应模块 |
|---|---|---|---|
| Lab 1 | WorkBuddy 个人主页（AI 协作建站） | 明确指令、禁止条款、事实要人给 | WK8 Prompting |
| Lab 2 | AI-Ready Data（Airbnb 数据） + 与 agent 协作 | 数据清洗、约束一次给全、验收标准 | WK2 数据 / WK8 |
| Lab 3 | Customer Churn（logistic regression） | baseline、AUC、阈值、数据泄漏 | WK3 |
| Lab 6 | Dify 构建 LLM App | foundation model + prompt 完成任务 | WK6 |
| Lab 7 | 第一个 Chatbot（Model API） | LLM 五大局限、system prompt | WK7 |
| Lab 9 | Search Workflow（Tavily） | grounding、搜索调优、publish as tool | WK9 |
| AS1 | Bank Loan Offer（建模型+评估+部署） | 全链路：数据→模型→评估→export | WK2–WK4 |
| 小组项目 | 真实用户 AI 系统 | scoping、评估、交付 | WK1–WK9 综合 |

---

## Lab 1 & 2 · 与 AI Agent 协作干活（你的亲身体会 = 考点）

你的 lab reflection 里提炼出的三条经验，条条都是 WK8 概念的人间版本：

**1. 明确指令 + 显式禁止，直接决定输出质量**
- "do not change the navigation bar or color scheme; only adjust the body layout" —— 对应 WK8 的 **"Say what NOT to do"** 和 safety prompt 的 **"Say what it must NOT do"**。
- What to leave alone matters almost as much as what to change.（不做什么和做什么几乎同样重要）

**2. 事实信息必须由人提供，不能让 AI 自己找**
- 教育背景、公司名这类事实，模型要么搜得慢、要么编造——hallucination 的亲身体验。
- 对应 WK9：*AI is good at structure and expression; factual content still needs a human safeguard.*

**3. 模型选择是 trade-off，效率/质量/价格不可兼得**
- 便宜模型迭代慢、要多轮修正——对应 WK8 hard attributes + benchmark + "Filter by what they can do; choose by how well"。

**4.（Lab 2）约束一次给全 + 要求 AI 报告执行过程**
- 单条指令内含全部约束 + 报告要求 → 错误减少、执行可追溯（traceable）。
- **速度与自主性负相关**：全程零干预省下了交互时间，却增加了执行时间（agent 自己试错路径长 + 便宜模型绕路）。
- **零 bug 的前提是任务边界清晰、验收标准明确**——todo list 拆成可检查的小项，人的角色从"逐步操作"变成"定义要什么 + 验收交付了什么"。这正是 WK2 scoping 和 WK8 prompt loop 的合体。

<div class="exam-card">
<p>Lab reflection 类考点：①"给 AI 下指令时，明确的禁止条款和明确的目标同样重要"（判断：对）。②"让 AI 全权代理一定更快"（判断：错，速度与自主性负相关）。③"任务边界清晰、验收标准明确时才适合完全委托"（判断：对）。④"事实性内容应直接喂给模型，不要让它自己搜"（判断：对）。</p>
</div>

## Lab 3 · Customer Churn Prediction（logistic regression）

Churn_Modelling.csv（10,000 行 × 14 列，来自银行内部数据库）。

- **特征类型**：CRM（CustomerId、Surname、Gender、Age、Geography、Tenure）、Billing（CreditScore 300–850、Balance、EstimatedSalary）、Usage（NumOfProducts 1–4、HasCrCard、IsActiveMember）。
- **数据考量三连**：Data privacy（合规吗）、Data quality（EstimatedSalary 有多准）、Timeliness（数据多旧）。
- 流程对应 WK3：train/test split（80/20）→ 训练 → 用 **AUC** 比较 → 选阈值做决策。
- 特征工程的活教材：NumOfProducts 与 churn 是 fall-rise 非线性关系、Age 是 rise-fall——logistic regression 每个特征只有一个系数（只有单调关系），所以要造 Products_2、Products_3plus、Age_sq 手工特征，AUC 0.78 → 0.846。**"为什么需要特征工程"的标准答案就出自这里**。

## Lab 6 · Build an LLM App with Dify

- 用无代码平台把 sentiment analysis 等任务快速做成应用。
- 概念印证：**foundation model + prompting 取代 task-specific pipeline**；一个模型靠 prompt 切换完成多种任务（对比 WK6 课前"每个任务一个模型"的旧范式）。
- 平台类知识（Dify/Coze/n8n）在招聘信息里反复出现（WK1 P36），知道"low-code 平台 = 快速集成 LLM 能力"即可。

## Lab 7 · Build Your First Chatbot

- 通过 Model API 调 LLM 建 chatbot：api_key + base_url 的配置（WK7）。
- 亲手观察 WK7 五大局限：system prompt 一改行为就变（prompt 即配置）；同一 prompt 两次调用结果不同（采样随机性）；模型不知道你的名字（no memory）；不擅长算数（weak math）。
- **改 system prompt = 调 spec**：这正是 WK8 "the system prompt is the spec" 的前奏。

## Lab 9 · Search Workflow（Tavily + OpenRouter）

- 导入 .ifpkg workflow → 配 Tavily API key → 选模型（z-ai/glm-5.3-flash）→ 跑 "凌晨 1 点便利店" 问题 → 截图 Before。
- 从三处改进（WK9 P38）：search settings（depth/results/domains/time range）、LLM 改写搜索词、LLM system prompt 规定怎么用结果 → 截图 After。
- Publish as Tool（命名 Campus_Life_Search）——workflow 复用为工具，服务 AS2。

<div class="trap-card">
<p>Lab 9 的 Before 失败原因：默认 Basic search + Max Results 3 + 无域名限制 → 搜到 OSU 的结果。改进逻辑 = <b>检索质量取决于查询词、来源限定和结果使用规则三处</b>，不是模型本身的问题。</p>
</div>

## AS1 · Bank Loan Offer（Individual Assignment 1）

数据集 BankLoanOffer.csv + customers_test.csv，任务链：理解数据 → 清洗与特征工程 → 训练模型（logistic regression / neural network）→ 评估（对比 baseline）→ 导出模型（model_nn.json / loan_model_export.zip）→ 部署成静态 web app。

把 AS1 当 WK2–WK4 的综合案例复习：

1. **Scoping**：AI 问题三要素（input=客户特征，output=接受贷款与否 0/1，objective=预测准）。
2. **数据**：tabular 数据、类别特征编码（one-hot）、缺失值处理、leakage 自查。
3. **模型**：logistic regression vs 小 NN——AUC 接近时选谁？（WK4 银行案例：参数少、可解释、易部署 → LR）。
4. **评估**：baseline（zero rule：多数类）、AUC、threshold 按业务成本选。
5. **交付**：export（structure + learned parameters）→ 静态网页 inference（WK4 "from model to app"）。

<div class="mem-card">
<p>AS1 的心法："Build and evaluate whether it works"——不只看模型指标，要和 baseline 比、要能说清为什么选这个模型、为什么选这个阈值。</p>
</div>

## 小组项目 · Group Project（35%）

- 从 **problem** 出发（focused user need），论证 **why AI is appropriate**；再 build & evaluate 一个 working system。
- 交付节奏：Project Plan（不评分）→ Interim（5%）→ Presentation & Live Demo（12%）→ Final Report（18%）。
- 团队四角色映射：**Product Manager/User Analyst**（找用户与真实需求）、**Developer/Tech Lead**（让系统跑起来）、**Data & Eval Lead**（数据从哪来、怎么证明 work）、**UX & Demo Lead**（陌生人能用吗、项目展撑得住吗）。
- 提醒：Make sure TA records your name（参与分需要留名）。

---

## 📝 实战综合自测

1. 【判断】与 agent 协作时，把任务全权委托给 agent 总能节省时间。（答案：错。速度与自主性负相关——省下的交互时间会回到执行时间。）
2. 【判断】在 prompt 中写明"不要改动导航栏和配色"属于 prompting 技巧中的 "say what NOT to do"。（答案：对。）
3. 【选择】适合完全委托给 agent 的任务通常具备：A) 边界模糊 B) 边界清晰、验收标准明确 C) 不需要验收 D) 越大越好（答案：B）
4. 【判断】AS1 中若 logistic regression 与神经网络 AUC 几乎相同，应优先选神经网络因为更先进。（答案：错。选参数少、可解释、易部署的 LR——avoid the state-of-the-art trap。）
5. 【情景】Lab 3 中 Age 与 churn 是"上升到 50–60 岁后下降"的关系，logistic regression 为什么表现受限？怎么办？（参考：LR 每特征一个系数只能表达单调关系；手工造 Age_sq 等非线性特征，或换 NN 自动学。）
6. 【判断】Lab 9 中搜到俄亥俄州立大学的便利店是因为 LLM 太弱，换更强的模型就能解决。（答案：错。问题在检索侧：查询词没消歧、没有限定域名——先修 workflow 再谈模型。）

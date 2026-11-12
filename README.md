# MIS3011 从零开始学习站

> Advanced AI for Business: From Theories to Applications · CUHK-SZ · Fall 2026 · Instructor: Yutong Guo

本站把 MIS3011 全部 lecture（WK1–WK9）与 lab、作业的知识点重新梳理为 **主题模块**：专业术语与关键解释保留英文，详细讲解用中文；每个算法配图示与读图指南；每讲附 ⚠️ 陷阱卡片与 📝 自测题。目标是：**不考 coding、不考繁琐计算，专攻概念理解与读图**。

---

## 📚 课程主题导航

按知识主题组织（不按讲次），点击卡片进入学习。每页左侧有小节导航，可精确定位每个知识点。

<div class="topic-grid">
<a class="topic-card" href="#/modules/wk1-overview">
<div class="tc-emoji">🏠</div>
<div class="tc-title">WK1 · 课程导览</div>
<div class="tc-sub">AI 全景图、课程理念、"coding is no longer the bottleneck"</div>
<span class="tc-tag">概念铺垫</span>
</a>
<a class="topic-card" href="#/modules/wk2-foundations">
<div class="tc-emoji">🧱</div>
<div class="tc-title">WK2 · AI 系统基础</div>
<div class="tc-sub">数据与特征、监督/无监督学习、AI 系统不只是模型</div>
<span class="tc-tag">框架思维</span>
</a>
<a class="topic-card" href="#/modules/wk3-decision-ai">
<div class="tc-emoji">🎯</div>
<div class="tc-title">WK3 · Decision AI</div>
<div class="tc-sub">Baseline、Confusion Matrix、Precision/Recall、ROC/AUC、Data Leakage</div>
<span class="tc-tag">判断题重灾区</span>
</a>
<a class="topic-card" href="#/modules/wk4-neural-networks">
<div class="tc-emoji">🧠</div>
<div class="tc-title">WK4 · 神经网络与深度学习</div>
<div class="tc-sub">Perceptron、Activation、Gradient Descent、Backpropagation、Overfitting</div>
<span class="tc-tag">核心模块</span>
</a>
<a class="topic-card" href="#/modules/wk6-language-ai-1">
<div class="tc-emoji">📝</div>
<div class="tc-title">WK6 · Language AI (1)</div>
<div class="tc-sub">Text→Numbers、Embedding、RNN、Attention、Transformer、BERT</div>
<span class="tc-tag">图示密集</span>
</a>
<a class="topic-card" href="#/modules/wk7-language-ai-2">
<div class="tc-emoji">🤖</div>
<div class="tc-title">WK7 · Language AI (2)</div>
<div class="tc-sub">Next-token Prediction、Pre-training→SFT→RLHF、Sampling & Temperature</div>
<span class="tc-tag">核心模块</span>
</a>
<a class="topic-card" href="#/modules/wk8-building-llm-systems">
<div class="tc-emoji">🛠️</div>
<div class="tc-title">WK8 · Building LLM Systems</div>
<div class="tc-sub">Selecting、Evaluating、Prompting——system prompt 就是一份 spec</div>
<span class="tc-tag">工程思维</span>
</a>
<a class="topic-card" href="#/modules/wk9-grounding-llms">
<div class="tc-emoji">🔎</div>
<div class="tc-title">WK9 · Grounding LLMs</div>
<div class="tc-sub">LLM 知识三局限、RAG 全流程、Retrieval、Reranking</div>
<span class="tc-tag">热点必考</span>
</a>
<a class="topic-card" href="#/modules/labs-assignments">
<div class="tc-emoji">🧪</div>
<div class="tc-title">Lab & 作业考点</div>
<div class="tc-sub">WK2/3/6/7/9 Lab 与 AS1 中沉淀的概念考点</div>
<span class="tc-tag">实战印证</span>
</a>
<a class="topic-card" href="#/modules/exam-sprint">
<div class="tc-emoji">⚡</div>
<div class="tc-title">考前冲刺</div>
<div class="tc-sub">全部陷阱汇总表 + 易混概念对比 + 自测题索引</div>
<span class="tc-tag">考前 1 天必看</span>
</a>
</div>

---

## 🧭 如何使用本站考高分

**学习路径**

- 第 1 遍：按模块顺序读讲解，重点看 **⚠️ 陷阱卡片** 和 🔍 读图指南。
- 第 2 遍：做每讲末尾的 📝 自测题（考试风格：判断 / 选择 / 解释）。
- 考前：过一遍「⚡ 考前冲刺」页的陷阱总表和易混概念对比。

**✍️ 我的标记**

- 选中任意文字 → 弹出工具条 → 选 4 色之一高亮，点击 📝 可附备注（也可之后点高亮补备注）。
- 右下角「✏️ 我的标记」按钮查看全部标记，**按讲次/模块分组**，点击直接跳转到原文位置。
- 标记保存在本机浏览器（localStorage），支持导出 / 导入 JSON 备份。

**📝 考试情报（来自 Syllabus 与课件）**

- Final Exam 占 30%，**closed-book、纸笔考试，不会要求写代码**。
- 范围覆盖 lectures、projects、assignments、class discussions 的所有材料。
- 判断题最爱考：绝对化表述（always/never/only）、因果颠倒、概念张冠李戴。
- 解释/读图题常要求：用一两句话讲清算法思想、参数作用、或图中趋势的含义。

<div class="exam-card">
<p>本课程理念：Teach Less, Learn More; Slide Less, Build More. 考试不考你写了多少代码，考你是否理解 AI 系统"为什么这样工作、什么时候会失效"。</p>
</div>

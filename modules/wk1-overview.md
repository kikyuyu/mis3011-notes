# WK1 · 课程导览 Course Overview

> 对应课件：`MIS3011_26WK1_Course Overview.pdf`（40 页）
> 本讲主要是课程信息，概念考点不多，但"课程理念"类的表述可能出现在判断题里，注意理解，不要死记。

## 1. 课程定位：这门课到底教什么

- **课程名**：Advanced AI for Business: From Theories to Applications
- **核心定位**：business 学生成为 **AI-native talent**——把 AI 当作 workflow design 和 problem-solving 的核心驱动，而不只是学一门技术。
- **广度优先（BREADTH）**：目标是成为 **AI General Practitioner**，能对广泛的商业问题"诊断 + 选工具"，而不是某一算法的专家。
- **课程聚焦两件事**：
  1. **Fundamentals of AI models and techniques**——Decision AI、neural networks、language models、prompt engineering、RAG、agentic workflow、agent engineering、vision AI、transfer learning、multimodal AI。注意 slide 里特意标注：*Models and algorithms become outdated quickly!*（模型和算法很快过时）——所以重点不是背某个具体模型，而是理解框架。
  2. **Framework to build an AI-powered system**——真实 AI 系统包含 data、business logic、evaluation、deployment 等许多非算法组件，涉及 data scientists、AI engineers、business leaders、users 等多方利益相关者。*Framework should work with any new algorithms!*

<div class="exam-card">
<p>考点：这门课强调 "framework 比具体算法更持久"。判断题若说"本课程的重点是掌握最新最先进的算法细节"，应判 <b>错误</b>——重点是理解 AI 系统如何构建、如何评估、何时失效。</p>
</div>

## 2. AI Anxiety：两个必须理解的论点

### 2.1 AI 会抢走工作吗？

- 课件引用 random_walker 的观点：**快速大规模失业的预言已被证明是错的（proven wrong）**。即使在软件工程领域，AI 的作用也是 **shift the human's role, not replace it**（改变人的角色，而非取代）。
- 真正的问题不是"要不要学某个专业"，而是：**Everyone has to work with AI... but how?**

<div class="mem-card">
<p>判断题陷阱：凡是"AI will replace human jobs massively / rapidly"的绝对化表述，按本课程观点应判 <b>错误</b>。</p>
</div>

### 2.2 The bind（困境）

- **AI helps senior people far more than juniors**：有 10 年经验的人能用 AI supervise coding agents，而初学者直接把技能建设外包给 AI，能力反而长不出来。
- 但雇主又期待你能用 AI 完成工作。

<div class="trap-card">
<p>"You can't offload your skill-building to AI" —— 判断题若说"有了 AI 工具，初学者可以跳过基础技能训练"，应判 <b>错误</b>。</p>
</div>

### 2.3 The HOPE（希望）

课程给出的解法：**Use AI to increase, not decrease your cognitive load. Learn deeper, not faster. No learning without the cognitive sweat.**（用 AI 增加而非减少你的认知负荷；学得更深而不是更快；没有认知上的汗水就没有学习。）

### 2.4 Coding is no longer the bottleneck

> *Building got cheap. Knowing what to build and whether what you built works did not.*

- **Before**：code production was the slowest step（写代码是最慢的环节）。
- **Now**：代码文件更容易生成了，瓶颈变成 **problem clarity、human validation、trust、responsibility**。
- AI 不仅产出更多代码，也**增加了**对 decide、measure、delete、harden（决策、度量、删除、加固）的需求。

<div class="mem-card">
<p>一句话记住： coding 不再是瓶颈，"知道要造什么 + 证明造的东西有用"才是。</p>
</div>

## 3. 企业到底要什么（job postings 透露的考点）

课件展示真实招聘信息，这些关键词就是本课程后面各讲的内容预告，也可能直接出现在考试概念题里：

| 企业要求 | 对应课程模块 |
|---|---|
| 有深度学习、RAG、Prompt、知识库学习经历者更佳 | WK4 / WK8 / WK9 |
| 了解 RAG、Agent、MCP、Function Calling 等概念 | WK9+ |
| 使用 Coze、Dify、n8n、LangChain 等平台搭建过 Agent 或工作流 | Lab（Dify） |
| 使用过 Claude Code、Cursor 等 AI 编程工具完成过实际项目 | Lab / 作业 |
| 具备 Python 基础，能独立编写脚本处理数据或调用 API | Lab / 作业 |
| 理解深度学习算法原理，能高效对接技术团队 | WK4 |

## 4. 考核结构（考试情报）

| 项目 | 占比 | 说明 |
|---|---|---|
| Final Exam | 30% | **Closed-book、纸笔、不写代码**；范围含 lectures、projects、assignments、class discussions |
| Group Project | 35% | 5 人一组，从真实用户需求出发构建可用 AI 系统 |
| Individual Assignments ×2 | 20% | 构建 + 评估"它是否真的 work" |
| Participation | 15% | 课堂提问/展示 6% + Lab 提交 9% |

### Group Project 的 "What qualifies / What does not"

- ** qualifies（算数）**：✓ 有真实可触及的 target user；✓ 至少一个 AI capability 真正干活；✓ 别人能用（accessible）；✓ 有 test cases 和 evaluation results。
- **不算数**：✗ 简单 prompt 套个聊天界面（a simple prompt wrapped in a chat interface）；✗ jupyter notebook 或跑不起来的原型；✗ 几个不相关功能堆在一页。

<div class="trap-card">
<p>判断题："一个包装好的 chatbot 界面只要有 AI 回复就算合格的 AI 系统" → <b>错误</b>。课件原话：a simple prompt wrapped in a chat interface 不算。</p>
</div>

## 5. 每节课的固定节奏（3 小时）

1. **Share**（前 10 分钟）：AI news of the week，或展示你自己做的东西。
2. **Understand**（90 分钟）：理论概念。
3. **Build**（60 分钟）：hands-on lab，当天下课前提交到 Blackboard。

## 6. 使用 AI 的政策（可能考概念判断）

- 课程**鼓励** strategic use of AI tools 来 build、code、debug。
- 但 **reflections 和 process accounts 必须自己写**——AI-drafted reflections 读起来彼此惊人地相似。
- 正确姿势：**Start with your own thinking and draft, then use AI to refine, enhance or debug**。
- AI 是加速工具，但若替代 critical thinking 反而会阻碍学习。

---

## 📝 本讲自测

1. 【判断】本课程的重点是让学生掌握当前最新 AI 算法的实现细节，因为算法知识不会过时。（答案：错。课件明确指出 models and algorithms become outdated quickly，重点是 framework。）
2. 【判断】根据课程观点，AI 对资深员工的帮助远大于初级员工，因此初学者应把基础技能训练外包给 AI 以提高效率。（答案：错。前半句对，但结论相反：you can't offload your skill-building to AI。）
3. 【选择】"Coding is no longer the bottleneck" 意味着现在的瓶颈是：A) 写代码速度 B) 明确要造什么并验证它有用 C) 算法选择 D) 数据获取。（答案：B）
4. 【解释】用一句话说明 "Use AI to increase, not decrease your cognitive load" 的含义。（参考：用 AI 逼自己思考得更深，而不是替自己思考。）
5. 【判断】一个只有 prompt + 聊天界面的应用算课程要求的合格 AI 系统。（答案：错。）

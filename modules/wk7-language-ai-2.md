# WK7 · Language AI (2)：生成式语言模型与 LLM 的训练

> 对应课件：`MIS3011_26WK7_Langauge AI (2).pdf`（57 页）
> 关键词：decoder-only、masked self-attention、autoregressive decoding、tokenization、positional encoding、sampling、temperature、pre-training、SFT、RLHF、model API、LLM 五大局限

## 1. 生成式语言模型：Decoder-Only 架构

BERT 是 **encoder-only**（双向理解，能同时条件于过去和未来）；生成式模型走另一半——**I only need the decoder part of Transformer**。

**Decoder block 内部结构**（与 encoder block 对比记忆）：
1. Input sequence → a **masked self-attention layer**（masked：只能 attend 之前的 token，**unidirectional context**，拥有从左往右的写作能力，**不能条件于未来 token**）
2. masked self-attention 输出 → a **FC layer**
3. 一个 Decoder block 的输出 → 下一个 Decoder block
4. 最后一个 Decoder block 的输出 → **a probability distribution**（经 Linear + SoftMax）

## 2. Autoregressive Decoding（自回归解码）

> **Autoregressive**: each prediction depends on all previous predictions.

"To be, or not to be, that" → 预测 is → 拼上再预测 the → … 直到 stop token 或达到最大长度。

<svg viewBox="0 0 470 175" style="max-width:560px;background:#0d1226;border-radius:10px">
  <text x="20" y="28" fill="#8b98b8" font-size="12">#1 "To be, or not to be, that" → 预测下一个 token（概率分布中采样）</text>
  <text x="20" y="58" fill="#dbe4f5" font-size="12">#2 "To be, or not to be, that <tspan fill="#6dd9a4">is</tspan>" → 再预测</text>
  <text x="20" y="88" fill="#dbe4f5" font-size="12">#3 "...that is <tspan fill="#6dd9a4">the</tspan>" → 再预测</text>
  <text x="20" y="118" fill="#dbe4f5" font-size="12">#4 "...that is the <tspan fill="#6dd9a4">question</tspan>" → 重复直到停止条件</text>
  <text x="20" y="152" fill="#f2c56c" font-size="12">关键：LLM 不总是选概率最高的 token（见采样部分）</text>
</svg>

Summary 原文（解释题模板）：GPT works in an **autoregressive decoding** process——starts with an initial prompt；continues to generate the next token based on the **prompt and the previous output tokens**；uses **masked self-attention** to weigh the importance of different tokens；applies **sampling techniques (temperature, top-k, top-p)** to introduce variety；stops when the **stop token** is generated or a **maximum token limit** is reached。

## 3. LLM Inference（解码）完整五步

| 步骤 | 名称 | 做什么 |
|---|---|---|
| 1 | **Tokenization** | 把输入文本切成 tokens（word 或 subword，如 empowers → em, powers）；每个 token 有 unique ID；不同模型有不同 vocabulary 和 tokenizer；**LLM 按 token 计价**（如每百万 output tokens $25） |
| 2 | **Embedding** | Token Embedding（每个 token 取向量）+ **Positional Encoding**（给每个 token 编码位置）→ Final Embedding = token 向量 + position 向量 |
| 3 | **Feed to LLM** | 送入 decoder 栈做 inference |
| 4 | **Output Probabilities** | 最后一个 block 经 final linear layer 算出 **logits**（每个候选 token 作为下一个 token 的合理程度），softmax 变成概率分布 |
| 5 | **Sampling** | 从输出分布中挑出本次输出的 token；参数控制随机性与多样性 |

<div class="exam-card">
<p>五步顺序 + 每步产物：text → <b>tokens</b> → <b>vectors（embedding + positional encoding）</b> → 过 LLM → <b>logits/probability distribution</b> → 采样出 token。顺序题必考。</p>
</div>

### 3.1 Positional Encoding 为什么需要

self-attention 本身**不感知顺序**（它是集合操作），所以必须显式给每个 token 加上位置向量，词序信息才存在。这正是 WK6 说的 "Word order is kept by adding a position vector to each token"。

### 3.2 Sampling 三参数（重点 + 易混）

1. **Greedy decoding**：直接 pick the highest scoring token（永远选概率最高）——确定但单调
2. **Top-k sampling**：只在**概率最高的 k 个** token 里随机选（例 k=2）
3. **Top-p sampling（nucleus sampling）**：按概率从高到低累加，**选累计概率达到 p 的那批** token 再随机选（例 p=0.55 可能剩 3 个）

**Temperature**：缩放 logits（`scaled_logits = logits / temperature`），改变概率分布的尖锐/平缓程度：
- **Temperature = 1**：无效果
- **Temperature < 1**：distribution **sharpening** → 输出更可预测（predictable）
- **Temperature > 1**：distribution **softer/flat** → 输出更随机、更有创意（creative）

<svg viewBox="0 0 470 190" style="max-width:560px;background:#0d1226;border-radius:10px">
  <text x="20" y="24" fill="#8b98b8" font-size="12">温度如何改变采样分布（例：候选 token 原始概率）</text>
  <rect x="40" y="120" width="40" height="40" fill="#4f8cff" opacity="0.4"/><rect x="90" y="140" width="40" height="20" fill="#4f8cff" opacity="0.4"/><rect x="140" y="147" width="40" height="13" fill="#4f8cff" opacity="0.4"/><rect x="190" y="152" width="40" height="8" fill="#4f8cff" opacity="0.4"/><rect x="240" y="155" width="40" height="5" fill="#4f8cff" opacity="0.4"/>
  <text x="40" y="175" fill="#8b98b8" font-size="11">T=1 原始</text>
  <rect x="310" y="100" width="40" height="60" fill="#6dd9a4" opacity="0.5"/><rect x="360" y="148" width="40" height="12" fill="#6dd9a4" opacity="0.5"/><rect x="410" y="155" width="40" height="5" fill="#6dd9a4" opacity="0.5"/>
  <text x="310" y="175" fill="#6dd9a4" font-size="11">T&lt;1 尖锐→可预测</text>
  <text x="20" y="60" fill="#f2c56c" font-size="11">T&gt;1 平缓→随机/创意（平坦化）</text>
</svg>

<div class="trap-card">
<p>① Temperature 改的是<b>分布形状</b>，top-k/top-p 改的是<b>候选集合</b>——三个可以叠加用（如 T=0.8 + top-k=5：先缩 logits，再只在前 5 个里随机）。② "T 越小输出越随机" → 错，正好相反。</p>
</div>

<div class="guide-box">
<p><b>读图指南</b>：给一条概率分布柱状图问 temperature——柱子高矮差距被拉大（最高柱更高、其余更矮）是 T&lt;1；差距被抹平是 T&gt;1。给候选集合问 top-k vs top-p——固定个数 k 个是 top-k；累计概率到 p 为止、个数不固定是 top-p。</p>
</div>

## 4. LLM 是怎么训练出来的：Pre-training → SFT → RLHF

### Stage 1 · Pre-training

- 从 massive、**unlabeled** text data 学习知识，学到的 patterns 和 knowledge 存在 **model parameters** 里。
- 用的学习范式是 **Self-Supervised Learning**（自监督学习）：**No human labels needed; the text itself supplies the label**（下一 token 就是标签）。
- 与 supervised learning 对比：supervised 需要人工给 x 配 label y；self-supervised 的输入 x 自己就能造出 label（x', x''…）。

**两个著名比喻**：
- **Pre-trained Model = "A Zip File of Internet"**——一个有点奇怪和不完美的知识数据库，压缩了约 10TB 互联网文本。
- **"Internet Document Simulator"**——它只会**像互联网一样续写文本**，不知道怎么回答问题。

**Misaligned Objectives（目标错位，必考）**：
- Pre-training objective: "predicting the next token on a webpage from the internet"
- User objective: "following the user's instructions helpfully and safely"
- 两者不一致 → 需要 post-training。

GPT 系列演进（2018–2023）：GPT-1 → GPT-3 数据越来越多，decoder blocks 越来越多（12 → 48 → 96）。

### Stage 2 · Supervised Fine-Tuning (SFT)

- 用 **prompt-completion pairs** 把 base model 适配到具体任务。
- 两种 fine-tuned model：**Instruct model**（具体任务、用户期待直接输出）与 **Chat model**（对话场景、自然有互动感的交流）。
- 但 LLMs sometimes may behave badly → 需要进一步适配。

### Stage 3 · RLHF（Reinforcement Learning from Human Feedback）

> Further fine-tune LLM to align its behavior with **human preferences, values, and safety guidelines**。

三步（顺序必考）：
1. **Collecting human feedback**：对每个 prompt，模型生成多个不同回答，人类标注员按 **helpfulness, harmlessness, honesty, conciseness, relevance** 等标准排序（如 ranking 3 > 2 > 1）
2. **Training a reward model (RM)**：输入 prompt-completion pair，输出 **reward score**——按人类偏好这个 completion 有多好。**The RM is a proxy for human judgment**（奖励模型是人类判断的代理）
3. **Fine-tuning the LLM with RL**：RL 算法更新 LLM 权重，朝着更高 reward 的方向走（iteration 1 reward 0.24 → iteration n reward 2.87）

<div class="mem-card">
<p>三阶段一句话各记：<b>Pre-training</b> = 在互联网文本上预测下一词 → base model；<b>SFT</b> = 用 instruction→response 样例教它听话 → instruction-tuned model；<b>RLHF</b> = 用人类偏好比较对齐行为 → 你聊天用的那个模型。<b>Steps 2 and 3 are post-training</b>：在更小、手工制作的数据集上继续训练。</p>
</div>

## 5. Model API：从 Zip File 到服务

模型训练完，开发者得到的是一个 zip file（~140GB 参数 + ~500 行运行代码）。商业化四步：**① the zip file → ② load it on GPUs → ③ behind a URL → ④ sell access**。

- **Model API = the provider runs steps 2–4**（提供商替你跑 GPU、部署、计费）
- **API key**：认证 token——identify who is making the request、monitor usage、enforce limits and quotas、track for billing
- **base_url**：API 服务所在 endpoint URL

### 5.1 Open vs Closed

| | Closed（e.g., GPT, Claude, Gemini） | Open weights（e.g., DeepSeek, Qwen, Llama） |
|---|---|---|
| Zip file | 保留，只卖 API | 发布，任何人可下载自跑 |
| 获取方式 | 只从开发者或授权方买（✗ 无文件可下载） | 谁都能托管卖（开发者、任何云、第三方、你自己） |

### 5.2 Open-source = free to download, NOT free to run

下载文件免费，但 **GPUs、server（URL 与运维工程师）、keys & billing（访问控制与计费）** 都要钱。三种付费模式：
- **A. Buy tokens**（按 token 付费，provider 跑 2–4）：适合小而零散的使用——**本课程就是这种**
- **B. Rent GPUs**（云 GPU 按小时，自己跑 2–4）：适合稳定重度使用
- **C. Own GPUs**（买硬件，数据不出门）：适合严格数据规则、超重度使用

### 5.3 Pricing

- 每次调用 cost = (input_tokens × input_rate) + (output_tokens × output_rate)
- **Output tokens 比 input tokens 贵 3–8 倍**（选择题考点）
- 价格随模型档位（model tier）差异显著

## 6. LLM 知道什么、不知道什么

**有的知识**（取决于信息在训练数据中的出现频率与一致性）：
- **Common knowledge**：互联网上广泛可得、频繁重复的信息（科学常识、名言、常识推理）
- **Stable factual knowledge**：很少随时间变化的信息（历史日期、科学常数、地理位置）

**没有的知识**：
- **Recent events**：有 **knowledge cut-off date**，训练数据收集之后的事一概不知
- **Niche topics**：公共训练数据中覆盖差的专门领域
- **Private or personal information**：无私有数据、个人邮件、实时对话的访问权

→ **Hallucination（幻觉）**：模型会自信地编造答案。名人他们知道，"我"它不认识。

## 7. LLM ≠ AI Application（五大局限 + ChatGPT 的本质）

**LLM 五大局限（Takeaway，逐条必背）**：
1. **Lack of memory**——无内置记忆，每次 query 都是孤立事件
2. **Knowledge limitation**——知识冻结在 cut-off 时刻，仅限公共数据
3. **Limited context length**——一次能处理的文本有上限
4. **Weak numerical & logical reasoning**——语言模型不知道怎么算，精确数学计算和多步推理常失败（不如计算器）
5. **Uncertainty / randomness**——同样的 prompt 每次答案可能不同（采样导致）

<div class="trap-card">
<p>① "LLM 记得我们之前的对话" → 错，memory 是应用层加的东西（见下），不是 LLM 的内置能力。② "LLM 能像计算器一样做精确数学" → 错。③ "同样的 prompt 应该得到完全相同的回答" → 错（采样随机性，除非 greedy + 其他确定性设置）。</p>
</div>

**ChatGPT 是 GPT 外面包了一层 wrapper 的 AI application**：

- **GPT** = text in, text out（语言模型本体）
- **ChatGPT** = GPT + **Tools**（code interpreter、file upload）+ **Web browsing**（搜索、读网页）+ **Memory**（历史对话、偏好）+ **Multimodal**（图像语音输入、图像输出）+ **Interface**（聊天窗/移动 app——用户看见的部分）

<div class="mem-card">
<p>GPT is a language model. <b>ChatGPT is an AI application built around it.</b> GenAI = 用生成模型做内容的系统；AI application = 模型 + 工具 + 记忆 + 界面。考试问"ChatGPT 与 GPT 的区别"，就答 wrapper 这层。</p>
</div>

<div class="lab-card">
<p><b>WK7 Lab 关联</b>：lab 用 API 构建第一个 chatbot——亲手验证了五大局限：改 system prompt 影响行为（prompt 即配置）、同样 prompt 两次调用结果不同（采样随机性）、模型不知道你是谁（no memory）、不会算（weak math）。这些实验现象都是考点。</p>
</div>

---

## 📝 本讲自测

1. 【判断】Decoder-only 模型的 masked self-attention 允许 token 条件于未来的 token。（答案：错。Unidirectional，只能 attend 之前的 token。）
2. 【选择】Autoregressive decoding 中，第 n 个 token 的预测依赖：A) 仅 prompt B) prompt 和所有已生成的 token C) 固定模板 D) 随机数（答案：B）
3. 【排序】LLM inference 五步：① Sampling ② Tokenization ③ Output probabilities ④ Embedding ⑤ Feed to LLM。（答案：②④⑤③①）
4. 【判断】Temperature = 1 时会把 logits 放大 1 倍，因此输出更随机。（答案：错。除以 1 无效果。）
5. 【选择】想让模型输出更稳定可预测，应设 temperature：A) 2.0 B) 1.0 C) 0.3 D) 不变（答案：C。T<1 分布更尖锐。）
6. 【解释】什么是 misaligned objectives？为什么需要 SFT 和 RLHF？（参考：预训练目标是预测网页下一词，用户目标是 helpful & safe 地遵循指令；两者错位，需要 post-training 对齐。）
7. 【排序】RLHF 三步：① Fine-tune with RL ② Collect human feedback ③ Train reward model。（答案：②③①）
8. 【判断】Reward model 直接替代人类逐条评审，因此它输出的是客观真理。（答案：错。RM is a proxy for human judgment——人类判断的代理。）
9. 【选择】Open-weight 模型意味着：A) 免费使用 B) 免费下载但运行要成本 C) 只能研究不能商用 D) 不需要 GPU（答案：B）
10. 【多选】LLM 的局限包括：A) 无内置记忆 B) 知识有 cut-off C) context length 有限 D) 数学推理强 E) 输出有随机性（答案：ABCE）
11. 【判断】ChatGPT 就是一个 LLM。（答案：错。GPT 是 LLM；ChatGPT 是围绕它构建的 AI application，带工具、浏览、记忆、多模态和界面。）

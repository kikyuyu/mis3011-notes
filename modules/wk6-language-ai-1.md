# WK6 · Language AI (1)：Text 如何变成 Numbers

> 对应课件：`MIS3011_26WK6_Langauge AI (1).pdf`（50 页）
> 关键词：NLP 任务、BoW、TF-IDF、one-hot、word embedding、Word2Vec、RNN、self-attention、Transformer、BERT
> 参考教材：Alammar & Grootendorst, *Hands-On Large Language Models* (O'Reilly, 2024), Ch.1

Recap（前两周 vs 本周的分水岭）：之前是 predictive/decision AI——**tabular data only**、supervised learning、task-specific AI；从今天开始处理文本这种 **unstructured data**。

## 1. Language AI 的典型任务（任务-输入输出配对）

| 任务 | 做什么 | 输入 → 输出 |
|---|---|---|
| **Sentiment analysis** | 判断文本情感倾向 | 评论/微博/邮件/电话记录 → positive/negative/neutral 概率 |
| **Toxicity & safety classification** | 识别针对特定身份的威胁、侮辱、脏话 | 帖子/评论 → 每个属性的 0–1 概率分数 |
| **Named entity recognition (NER)** | 抽取预定义类别的实体 | 文档 → PERSON, ORG, GPE, QUAN… |
| **Machine translation** | 自动翻译 | 一种语言 → 另一种语言 |
| **Content generation** | 预测下一个词 | "CUHKSZ is located at" → 续写 |
| **Summarization** | 缩短文本突出要点 | 文章 → 摘要；分 **extractive**（抽取式）与 **abstractive**（生成式）两种 |

<div class="mem-card">
<p>今天的 chatbot 几乎什么都能做，是因为它被 <b>foundation model</b> 驱动：pre-trained on broad data、adaptable to many tasks、used through <b>prompting, context retrieval, or finetuning</b>。而过去的做法是每个任务训一个 task-specific model（一个模型做情感、一个做翻译、一个做摘要）。</p>
</div>

**NLP vs Language AI**：NLP（Natural Language Processing）是这个领域的传统名字，本课程叫 Language AI——同一个领域。

## 2. NLP 技术史：三条路线

1. **Symbolic NLP（符号 NLP）**：rule-based system, based on pre-defined rules and scripts（预定义规则）。局限：*can only respond to patterns they've been explicitly programmed, lacking the flexibility*（只能响应显式编程过的模式，缺乏灵活性）。
2. **Statistical NLP（统计 NLP）**：data-driven，用统计方法。
3. **Neural NLP（神经 NLP）**：如今 neural models 在所有 language AI 任务上达到 state-of-the-art。2013 年是分水岭：**Word2Vec**。

## 3. Statistical NLP：Document-Term Matrix 表示法

**核心思想**：one row per document, one column per word（每篇文档一行，每个词一列）。几个关键术语：

- **Tokenization（分词）**：splitting text into units called **tokens**（把文本切成 token）
- **Vocabulary（词表）**：corpus（语料库）中所有 unique tokens 的列表
- **Vocab size（词表大小）**：unique tokens 的数量
- **BoW（Bag-of-Words，词袋）**：for each document, count how many times each vocabulary word appears（数每个词出现几次）

<svg viewBox="0 0 470 170" style="max-width:560px;background:#0d1226;border-radius:10px">
  <text x="15" y="22" fill="#8b98b8" font-size="12">BoW：出现次数即向量</text>
  <text x="15" y="50" fill="#dbe4f5" font-size="12">D0 "I eat an apple every day" → [1,1,1,1,1,1,0,0,0,0,0,0,0]</text>
  <text x="15" y="72" fill="#dbe4f5" font-size="12">D1 "I eat an orange every day" → [1,1,1,0,1,1,1,0,0,0,0,0,0]</text>
  <text x="15" y="94" fill="#dbe4f5" font-size="12">D2 "I like driving my car to work" → [1,0,0,0,0,0,0,1,1,1,1,1,1]</text>
  <text x="15" y="128" fill="#f2c56c" font-size="12">词表：[I, eat, an, apple, every, day, orange, like, driving, my, car, to, work]</text>
  <text x="15" y="152" fill="#8b98b8" font-size="12">问题：出现频率高 = 重要吗？</text>
</svg>

### TF-IDF

回答"frequency ≠ importance"的问题：
- **TF (Term Frequency)**：the fraction of terms in document（词在文档内的占比）
- **IDF (Inverse Document Frequency)**：a measure of how rare a term is across the documents in the corpus（词在整个语料中有多稀有）——**越稀有的词 IDF 越高**
- TF-IDF = TF × IDF，给 BoW 加权

表示方法的演化链（要会默写）：
**Vocabulary → 每个词 one-hot → 句子内各词 one-hot 向量求和 = BoW 表示 → 用 TF-IDF 分数加权 = TF-IDF 表示**

## 4. One-hot / BoW 的四大局限（必背）

1. **No semantic meaning（无语义）**："apple" 和 "orange" 的距离与 "apple" 和 "car" 的距离一样远——cosine similarity 全为 0
2. **Sparsity（稀疏）**：向量里绝大多数元素是 0（每个向量只有一个 '1'）
3. **High-dimensionality（高维）**：每个词需要 vocab size 维的向量；词表 50,000 词就是 50,000 维
4. **Loss of sequence（丢失语序）**："The dog bit the man." 和 "The man bit the dog." 的 BoW 表示完全相同

<div class="exam-card">
<p>四大局限是判断/选择题的常考原文：语义缺失、稀疏、高维、丢语序。给场景选"哪条局限被触发"——新词表巨大 → 高维；"猫追狗"和"狗追猫"分不清 → 丢语序。</p>
</div>

## 5. Neural NLP：Word Embedding（词嵌入）

- 定义：**dense vector representations of words in a continuous, lower-dimensional space**（连续低维空间中的稠密向量）。
- 是 today's language AI / LLMs 的 central 基础。

embedding 空间的性质：
- 语义相近的词向量相近（woman/girl 相似，man/boy 相似，king/queen 共享 royalty 维度）
- 可以做**向量运算**：king − man + woman ≈ queen（这是解释题/选择题的标志性例子）

### Word2Vec（Google, 2013）

- 核心思想（语言学假设）：*words that share similar contexts (neighbors) share similar meanings*——看一个词周围有什么（looking at a word's surroundings）。
- 模型：一个 **shallow neural network（1 hidden layer）**；训练目标是 *given a center word, predict surrounding words*（给中心词预测上下文词）。
- **隐藏层的权重就是最终的 Word Embeddings**。
- 著名版本：在 Google News（1.5GB，100 billion words）上训练，3 million words × 300 维。

为什么这样能捕捉相似性（P28 关键机制）：dog 和 cat 常出现在相同上下文（"The __ is playing"、"I fed my __"）→ 模型被迫为它们预测相似的输出概率 → 网络把它们的 input weights（embeddings）调整到数学上相似。

<div class="guide-box">
<p><b>读图指南</b>：看到 Word2Vec 结构图（one-hot 输入 → 隐层 → softmax 输出），记住三点：输入是 one-hot（词表长度）；隐层把 10000 维压到 300 维；输出是"哪些词会出现在附近"的概率。<b>隐层权重矩阵 = 词嵌入表</b>——行是每个词的向量（300 个数），列是隐层神经元（每列持有词表中每个词的权重）。</p>
</div>

### Embedding 应用到 NLP 任务

"You love Taylor Swift" → 4 个 token → Embedding layer → 4 × 300-D 的 embedding 序列 → 接下游网络 → label（positive/negative）。

**Word Embedding is the foundation for language AI systems or NLP models!**

### Word2Vec 够好吗？两个局限

1. **One word, one vector**：多义词只有一个向量（所有义项的加权平均）。"bank" 在 "river bank" 和 "bank account" 中向量相同。向量最终靠近金融义还是河流义，取决于**训练语料中哪种用法更常见**。
2. **Out-of-Vocabulary (OOV)**：Word2Vec 用 word-level tokenization，新词（新造词、术语、专有名词、拼错词）无法处理；训练语料再大也永远有没见过的词。**今天的 LLM 把词切成更小的 pieces（tokens），新词也能处理**。

<div class="trap-card">
<p>"Word2Vec 中 bank 的向量由上下文动态决定" → 错。Word2Vec 一个词一个固定向量（static, context-independent）；动态上下文向量是 Transformer 的 self-attention 干的事。这正是 P41 raw embeddings 与 contextual embeddings 的对比考点。</p>
</div>

## 6. Sequence Modelling：为什么 FC 网络不行

把 4×300-D 喂给全连接网络的两种笨办法：
1. **Averaging**：4 个 300-D 求平均 → 固定长度 300-D；局限：**loses the order**（丢语序）
2. **Concatenation**：拼成 1200-D；保留语序但**句子长度可变**，FC 层要求输入维度固定

序列数据的特征（sequential data）：**Order matters, temporal relationships, varying length**——如时间序列、自然语言、语音、音乐、视频帧。专门的序列模型：**RNN、LSTM、GRU、Transformer**。

序列任务的四种输入输出形态（会认图）：

| 形态 | 名字 | 例子 |
|---|---|---|
| Many → one | sequence2vector | 情感分析 |
| Many → many（等长） | seq2seq | 词性标注 |
| One → many | vector2sequence | 图片配字幕 |
| Many → many（不等长） | seq2seq | 机器翻译 |

**序列模型需要的三样东西**：① handle varying-length sequences ② maintain information about **order** ③ track **long-term dependencies**（长期依赖）。

## 7. RNN 及其三大局限

**RNN = Neural network with memory**：有一个 hidden state（"记忆"）hₜ，处理序列的每一步都更新它。

<svg viewBox="0 0 470 130" style="max-width:560px;background:#0d1226;border-radius:10px">
  <rect x="20" y="45" width="80" height="40" rx="8" fill="#131a30" stroke="#4f8cff" stroke-width="1.5"/>
  <text x="42" y="70" fill="#dbe4f5" font-size="13">x₁ "You"</text>
  <rect x="130" y="45" width="80" height="40" rx="8" fill="#131a30" stroke="#9b8cff" stroke-width="1.5"/>
  <text x="150" y="70" fill="#dbe4f5" font-size="13">RNN h₁</text>
  <rect x="240" y="45" width="80" height="40" rx="8" fill="#131a30" stroke="#9b8cff" stroke-width="1.5"/>
  <text x="260" y="70" fill="#dbe4f5" font-size="13">RNN h₂</text>
  <rect x="350" y="45" width="80" height="40" rx="8" fill="#131a30" stroke="#6dd9a4" stroke-width="1.5"/>
  <text x="368" y="70" fill="#dbe4f5" font-size="13">label</text>
  <line x1="100" y1="65" x2="130" y2="65" stroke="#2a3454" stroke-width="2"/>
  <line x1="210" y1="65" x2="240" y2="65" stroke="#2a3454" stroke-width="2"/>
  <line x1="320" y1="65" x2="350" y2="65" stroke="#2a3454" stroke-width="2"/>
  <path d="M170,45 C170,15 260,15 260,45" fill="none" stroke="#f2c56c" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="168" y="14" fill="#f2c56c" font-size="11">h（记忆）逐级传递</text>
  <text x="20" y="110" fill="#8b98b8" font-size="11">一次只读一个词，hₜ = 到目前为止读过的全部内容的压缩</text>
</svg>

**RNN 三大局限**：
1. **Encoding bottleneck（编码瓶颈）**：step t 之前读过的所有内容都被压进一个 fixed-size hidden state hₜ
2. **Slow, no parallelization**：一次读一个词，训练无法并行
3. **Not long memory**：早期词从"摘要"中逐渐消失（早期词 fade）。Gated RNNs（**LSTM、GRU**）能记更久，但依然一次读一个词

<div class="mem-card">
<p>RNN 的病根一句话：<b>所有历史都要挤过一个固定大小的 h</b>。Transformer 的解法：每个词直接看所有词，不再挤一个瓶颈。</p>
</div>

## 8. Self-Attention（2017, Attention Is All You Need）

Transformer 的核心：*"self-attention layer"*——relating every word in the input sequence to every other word；**整个序列同时（in parallel）处理**。

直觉：*let the model decide which parts of the input are most relevant to each token*（让每个 token 自己决定输入的哪些部分与它最相关）。例："The animal didn't cross the street because it was too tired" 里，理解 "it" 时模型重点关注 "animal"。

**Raw embeddings vs Contextual embeddings**（核心对比，必考）：

| Raw embeddings | Contextual embeddings |
|---|---|
| static, **context-independent** | dynamic, **context-dependent** |
| "apple" 在两句中向量相同 | "apple" 在 "my favorite fruit is apple" 与 "my favorite brand is apple" 中向量不同 |

技术上，self-attention 生成 **attention scores** 和 contextual embeddings：
- Contextual(apple in S1) = attention(apple,my)·value(my) + attention(apple,favorite)·value(favorite) + … + attention(apple,apple)·value(apple)
- 每个 token 的 embedding 被变换成三个向量：**Query (Q)、Key (K)、Value (V)**（三个可学习权重矩阵 WQ、WK、WV）
- 流程：**Q = X·WQ，K = X·WK，V = X·WV → attention scores S（Q 与 K 的匹配度）→ 输出 Z = S·V（weighted sum，加权求和）**

<div class="guide-box">
<p><b>读图指南</b>：self-attention 计算图读法：输入 embeddings X 分别乘三个权重矩阵得到 Q/K/V；Q·K 得到 attention scores（谁该关注谁）；scores 加权 V 求和得到 contextual embeddings。答题关键词：Q 提问、K 被检索、V 被汇总。</p>
</div>

## 9. Transformer 架构与 BERT

**Transformer Encoder 块**（BERT 用）：
1. Input sequence → a **self-attention layer**
2. self-attention 输出 → a **fully-connected feed-forward NN**
3. 一个 Encoder block 的输出 → 下一个 Encoder

**Encoder-Decoder 架构**：
- **Encoding module**：a stack of encoder blocks——**同时处理整个输入序列**，学习输入的表示
- **Decoding module**：a stack of decoder blocks——**一次生成一个元素**（WK7 细讲）
- 输入：a sequence of embeddings in；输出：a sequence of embeddings out

**BERT 与 GPT 是最具代表性的 LLM，都基于 Transformer**；BERT 是 **encoder-only**。

### 为什么 Transformer 如此强大（4 条，解释题素材）

1. **Parallel computation**：同时处理输入序列；词序靠给每个 token 加 position vector 保持（WK7 详述）
2. **Contextual understanding via attention**：动态上下文表示，同一个词在不同上下文含义不同
3. **No single bottleneck**：每个词直接看所有其他词，不再经过一个 hidden state
4. **(Encoder) Bi-directional context**：处理**双向**上下文，而非只看前面的信息
5. **Versatility**：适配任何能表示为序列的数据

<div class="lab-card">
<p><b>WK6 Lab 关联</b>：lab 用 Dify 构建 LLM App——把 sentiment analysis 等任务做成无代码应用，亲身体会 "foundation model + prompting" 如何取代 task-specific pipeline。考试不用会操作 Dify，但"low-code 平台调用 LLM 完成任务"这个架构认知要形成。</p>
</div>

---

## 📝 本讲自测

1. 【判断】BoW 表示能区分 "The dog bit the man" 和 "The man bit the dog"。（答案：错。Loss of sequence。）
2. 【选择】TF-IDF 中 IDF 衡量的是：A) 词在文档内的频率 B) 词在整个语料中的稀有程度 C) 词的长度 D) 词的词性（答案：B）
3. 【判断】Word2Vec 的训练目标是"给上下文词预测中心词"，隐层权重即词嵌入。（答案：课件版本为"given a center word, predict surrounding words"——注意若题目反过来说"given surrounding words predict the center word"（即 skip-gram vs CBOW 的混淆）要留意课件采用的是哪个表述；本课程表述：predict surrounding words given a center word。）
4. 【解释】为什么 king − man + woman ≈ queen 能说明 embedding 有语义？（参考：向量维度编码了语义特征，语义关系以线性代数形式存在。）
5. 【选择】"river bank" 和 "bank account" 中 bank 向量相同，这反映了 Word2Vec 的：A) OOV 问题 B) 一词一向量（multi-sense 混合）问题 C) 稀疏问题 D) 高维问题（答案：B）
6. 【判断】RNN 的训练可以像 Transformer 一样并行。（答案：错。RNN 一次读一个词，no parallelization。）
7. 【选择】Transformer 中 Q/K/V 三个矩阵的作用，最准确的说法是：A) 三个不同的模型 B) 同一 embedding 的三种线性变换，分别用于查询、匹配、汇总 C) 三个损失函数 D) 三个词表（答案：B）
8. 【判断】BERT 只使用 Transformer 的 decoder 部分。（答案：错。BERT 是 encoder-only。）
9. 【解释】用两句话对比 RNN 与 Transformer 处理 "it" 指代问题的方式。（参考：RNN 把历史压进 h，早期信息会 fade；Transformer 让 it 直接 attend 到 animal，双向上下文同时处理。）
10. 【判断】Transformer 的强大之处在于双向编码器可以条件于过去和未来。（答案：对——课件 P51 原话：Processes bi-directional context rather than just preceding information。注意这是 encoder 的性质。）

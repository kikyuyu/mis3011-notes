# ✅ 知识点总清单（逐讲 checklist）

> 用法：每复习完一项打勾（可在页面上直接用"我的标记"高亮未掌握项）。按讲次组织，考试范围全覆盖。

## WK1 · 课程导览

- [ ] AI system vs AI model：model 只是 system 的一个组件
- [ ] State-of-the-art 陷阱：SOTA ≠ 适合你的数据/便宜/快
- [ ] Heuristic → 简单 ML → 复杂模型，每阶段方案是下一阶段的 baseline
- [ ] "AI helps senior people far more than juniors" 与 the bind
- [ ] Coding is no longer the bottleneck：瓶颈是 problem clarity、validation、trust、responsibility
- [ ] Group project 的 qualifies / does-not-qualify 清单

## WK2 · AI 系统基础

- [ ] AI 系统的组件与四大视角（purpose/data/output+action/operation）
- [ ] 理解 AI 模型的四个维度（capability/modality/learning method/model type）
- [ ] Lifecycle 六阶段 + 广告案例的"送回"逻辑
- [ ] 何时用 AI 的 9 个信号 + 骰子/币价/Airbnb 州分类等反例
- [ ] Framing AI problems 三要素：input / output / learning objective
- [ ] 三大任务类型：classification / regression / generation
- [ ] 系统 = deterministic software + multiple AI models + human judgment
- [ ] Custom AI vs cloud-based AI；model hubs（HF/ModelScope）vs cloud providers
- [ ] 数据五步：collection → labeling → preparation → reduction → augmentation
- [ ] 数据来源 8 种（public/internal/scraping/API/IoT/crowdsourcing/synthetic/transactional）
- [ ] 著名数据集：ImageNet/Common Crawl/Wikipedia/YouTube-8M
- [ ] 标注 workflow 四步 + human annotation 四缺点
- [ ] 清洗：deletion vs imputation；outlier 三危害
- [ ] Feature engineering（manual）vs representation learning（automated）
- [ ] 变换：binning / one-hot（dummy trap）/ log / min-max / z-score
- [ ] F-test vs Chi-squared；stratified vs clustering-based sampling
- [ ] 数据增强手段与"训练前问 5 个问题"

## WK3 · Decision AI

- [ ] Linear regression：最小二乘、SSE、residual
- [ ] R² 与 Adjusted R² 定义
- [ ] 80/20 split；train R² 高 ≠ test R² 高；out-of-sample R² 可为负
- [ ] Logistic regression：输出概率；Z>0 → P>0.5；系数符号解读
- [ ] 阈值 t 与 FP/FN 的关系；三场景选阈值（预算/竞争/测试期）
- [ ] Confusion matrix 四格；阈值大→FN 高，阈值小→FP 高
- [ ] Accuracy 公式 + 类别不平衡误导 + "performance on EACH class"
- [ ] Precision = TP/(TP+FP)；Recall = TP/(TP+FN)；trade-off；随阈值变化方向
- [ ] ROC：TPR vs FPR、每点一个阈值、左上完美、对角线随机
- [ ] AUC 含义与 0.775 判读
- [ ] 三种 baseline：zero rule / simple heuristic / existing solution
- [ ] 四句顺序口诀：baseline → metric → threshold(from cost) → leakage check
- [ ] Data leakage 定义 + CT 扫描案例；三大成因（预处理泄漏/预测时不可得的特征/test 集选择）

## WK4 · 神经网络与 DL

- [ ] 人工神经元三步骤；perceptron 方程 z = b + Σwx
- [ ] 感知机局限：linearly separable；输出二元
- [ ] 四种激活函数认图 + sigmoid=LR
- [ ] 全连接前馈网络四性质；CNN/RNN/Transformer 架构变化
- [ ] 输出层激活选择：二分类→sigmoid
- [ ] Forward propagation 流程
- [ ] 训练三步：forward → loss → backward；repeat until loss minimal
- [ ] Loss：MSE（回归）vs cross-entropy（分类）
- [ ] Gradient descent 更新规则；梯度=偏导；斜率大步大
- [ ] Learning rate 太大/太小/adaptive；lab 中 0.001 的教训
- [ ] Backprop 算梯度、GD 更新权重；SGD/batch size/epoch 计算（64000/128/3）
- [ ] Overfitting（train 低 test 高=死记硬背）vs Underfitting（都高=没学明白）
- [ ] Dropout 与 Early Stopping 各自对应哪种成因
- [ ] Hyperparameter tuning 四路径；**用 validation set 调，test set 只报结果**
- [ ] LR vs NN 对比表（AUC 0.845/0.852；参数 9/121）
- [ ] DL 定义：>3 层；DL⊂NN 关系
- [ ] DL 四大成本（compute/data/time/interpretability）+ GPT-3 训练时间例
- [ ] DL 值得的条件四条；export/deploy/inference 定义
- [ ] Agent as builder vs worker 判据

## WK6 · Language AI (1)

- [ ] 六大 NLP 任务与输入输出配对（sentiment/toxicity/NER/MT/generation/summarization）
- [ ] Foundation model 三特征 vs task-specific model
- [ ] NLP 三阶段：symbolic → statistical → neural；Word2Vec 2013
- [ ] Tokenization/vocabulary/BoW；TF-IDF（TF×IDF）
- [ ] one-hot/BoW 四大局限：无语义、稀疏、高维、丢语序
- [ ] Embedding 定义（dense, continuous, lower-dimensional）；king−man+woman≈queen
- [ ] Word2Vec：浅层网络、给中心词预测上下文、隐层权重=嵌入
- [ ] Word2Vec 两局限：一词一向量、OOV
- [ ] FC 处理序列两笨法（averaging 丢序、concat 变长）；序列模型四形态
- [ ] 序列模型三需求；RNN 三大局限（bottleneck/串行/遗忘）；LSTM/GRU 缓解但不根治
- [ ] Self-attention：每词看每词、并行；raw vs contextual embeddings
- [ ] Q/K/V 三分工；Z = S·V
- [ ] Encoder block 结构；BERT encoder-only 双向；Transformer 强大 4+1 条

## WK7 · Language AI (2)

- [ ] Decoder-only：masked self-attention（单向）；decoder block 结构
- [ ] Autoregressive 定义与生成循环
- [ ] Inference 五步顺序与产物
- [ ] Tokenization（subword、unique ID、按 token 计价）
- [ ] Embedding = token + positional encoding
- [ ] Logits → softmax → 概率分布
- [ ] Sampling：greedy / top-k / top-p；temperature 三档效果（=1 无效、<1 尖锐、>1 平缓）
- [ ] Pre-training：self-supervised（无需人工标签）、zip file of internet、document simulator
- [ ] Misaligned objectives
- [ ] SFT：prompt-completion pairs；instruct model vs chat model
- [ ] RLHF 三步：collect feedback → reward model → RL fine-tune；RM 是 human judgment 的 proxy
- [ ] Model API 四步（zip→GPU→URL→sell）；API key 四作用
- [ ] Closed vs open weights；open-source ≠ free to run；三种付费模式
- [ ] 计费公式；output tokens 贵 3–8 倍
- [ ] LLM 有的知识（common/stable）vs 没有的知识（recent/niche/private）→ hallucination
- [ ] LLM 五大局限（memory/cut-off/context/math/randomness）
- [ ] GPT vs ChatGPT：wrapper（tools/browsing/memory/multimodal/interface）

## WK8 · Building LLM Systems

- [ ] 模型选择四步迭代 workflow；filter by can do, choose by how well
- [ ] Hard attributes 字段；benchmark 与 leaderboard；data contamination
- [ ] LLM 评估为什么难（expensive/sensitive/subjective/misleading 对应关系）
- [ ] 评估三时机；eval pipeline 三步
- [ ] 四类评估标准（domain-specific/generation/instruction-following/cost&latency）
- [ ] Test case 三要素 + normal/tough/edge 三 case 三来源
- [ ] 三方法×两方式矩阵；computation/human/AI judge 各自局限
- [ ] AI judge：构建（formatter→judge→parser）、model bias 三条、多 judge 编排
- [ ] System/user/assistant 三角色
- [ ] 校准 system prompt 五要素；too specific / just right / too vague
- [ ] In-context learning（no gradient updates）；zero-shot vs few-shot（3–5 个够）
- [ ] CoT / self-consistency / least-to-most 配对
- [ ] 四技巧 + 四个坏 prompt（vague/overloaded/contradictory/lost in the middle）
- [ ] 2025–26 三变化（spec/schema+tools/test every change）；prompt loop
- [ ] Workflow vs Agent 的 prompt 写法；"model decides more → prompt limits more"
- [ ] Skill 定义；context engineering 定义
- [ ] 三种攻击（jailbreak/prompt leaking/info extraction）+ 四条防御
- [ ] Prompting good for / not good for 表

## WK9 · Grounding LLMs

- [ ] 知识三局限（real-time/private/personal）；grounding 定义与 How
- [ ] 六测试五大失败模式；四种数据供给方式匹配
- [ ] Prompt stuffing 适用与局限（成本/速度/无出处）
- [ ] Tool calling 机制（模型不执行）；三术语三名；五步流程
- [ ] 三种工具分类；web search workflow 与四类改进
- [ ] RAG 定义（reader vs memorizer）；Why RAG
- [ ] 两阶段流程（indexing 五步 / retrieval+generation 六步）
- [ ] Parse（表格转 Markdown）；chunk 四策略（fixed/sentence/overlap 10–20%/parent-child）
- [ ] Embed（同模型、小角度=相似）；vector search（Top K + score threshold）
- [ ] Hybrid search 公式与动机；Rerank 两阶段（粗排+精排）；query transformation（rewriting/multi-query）
- [ ] Augment prompt 范式（ONLY context + cite + I don't know）
- [ ] When to use RAG 条件；does well vs struggles
- [ ] 两种 failure mode 定位；四指标（context recall/precision, faithfulness, answer relevancy）
- [ ] Database 适用（lists/counts/filters）；SQL 工作流；四方式对比总表

## Lab & 作业

- [ ] Lab1/2 三条协作经验（禁止条款/事实人给/trade-off；约束一次给全/速度与自主性负相关/边界清晰才全委托）
- [ ] Lab3 churn 数据与特征工程动因；Lab6 Dify；Lab7 五大局限实证；Lab9 三处改进
- [ ] AS1 全链路与"为何选 LR"；小组项目四角色与交付

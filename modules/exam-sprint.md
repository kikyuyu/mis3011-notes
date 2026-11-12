# ⚡ 考前冲刺：陷阱总表 + 易混概念对比

> 考前 1–2 天只看这一页。左边是判断题最爱埋的雷，右边是易混概念的快辨。

## 一、⚠️ 陷阱总表（绝对化 / 因果颠倒 / 张冠李戴）

| # | 错误表述（判错） | 正确说法 |
|---|---|---|
| 1 | AI system = AI model，模型是系统最重要的部分 | Model is **only one component**（还有 data/interface/evaluation/monitoring/users） |
| 2 | 本课程重点是掌握最新算法的实现细节 | Models/algorithms outdated quickly；重点是 **framework** |
| 3 | AI 将快速大规模取代人类工作 | 预言已被证伪；是 **shift the role, not replace** |
| 4 | 初学者可以把技能建设外包给 AI | You **can't offload your skill-building** to AI |
| 5 | 一个 prompt 套聊天界面就是合格的 AI 系统 | A simple prompt wrapped in a chat interface **不算**（group project 原文） |
| 6 | 训练 R² 高保证测试 R² 高 | High train R² **doesn't guarantee** high test R² |
| 7 | R² 不可能为负 | Out-of-sample R² **can be negative**（SSE>SST） |
| 8 | 类别不平衡时 accuracy 仍然可靠 | Accuracy is **misleading** for imbalanced data——问 "performance on EACH class" |
| 9 | 阈值应默认用 0.5 | **Threshold from cost, not from 0.5** |
| 10 | 存在让 precision 和 recall 同时最高的阈值 | 两者是 **trade-off**，此消彼长 |
| 11 | 在 train/test split 前用全量均值做标准化没问题 | 泄漏！先 split，统计量**只来自 train** |
| 12 | Data leakage 是代码 bug | 是"预测时不可得的信息"进了训练特征——先回到 data step |
| 13 | 感知机/单层 sigmoid 神经元可拟合任意复杂函数 | 只能 **linearly separable**；非线性靠多层+非线性激活 |
| 14 | ReLU 是线性激活、只能画直线 | 课件归为非线性；linear activation 才是直线的元凶 |
| 15 | Backpropagation 和 gradient descent 是一回事 | **BP 算梯度，GD 更新权重** |
| 16 | Learning rate 越大训练越好 | 太大 overshoot；**a poor set of hyperparameters might render your model useless** |
| 17 | 用 test set 调超参数 | 用 **validation set** 调；test 只报最终成绩 |
| 18 | 所有神经网络都是深度学习 | DL = **>3 层**；all DL are NN, not all NN are DL |
| 19 | 深度模型 AUC 略高就该选深度模型 | 差距小、参数少、可解释、易部署 → 选简单模型（银行案例） |
| 20 | BoW 能区分"狗咬人"和"人咬狗" | 丢语序（loss of sequence） |
| 21 | Word2Vec 中 bank 的向量随上下文变化 | **One word one vector**（static）；动态上下文向量是 Transformer 的 |
| 22 | RNN 可以并行训练 | 一次一词，**no parallelization** |
| 23 | Few-shot / in-context learning 会更新模型参数 | **No gradient updates**——纯 prompt 层面 |
| 24 | 示例越多越好 | **3–5 个 usually enough** |
| 25 | Temperature 越小输出越随机 | 相反：T<1 分布更**尖锐**更可预测 |
| 26 | 推理模型对所有厂商都不再需要 sampling 参数 | 因模型而异（DeepSeek 忽略/Claude 拒收/Gemini 可配建议默认） |
| 27 | Pre-training 需要人工标注标签 | **Self-supervised**：文本自己供标签 |
| 28 | 公开 benchmark 最高的模型最适合我的应用 | Public scores **filter out bad models, won't find the best for you**（+ contamination） |
| 29 | AI judge 完全客观无偏见 | Self-preference / position bias / 偏好更长回答；同一输入可给不同分 |
| 30 | Workflow 的逻辑由模型控制 | **Workflow: logic by code; Agent: logic by model**（说反即错） |
| 31 | 模型自主权越大 prompt 越简短 | **The more the model decides, the more the prompt has to limit** |
| 32 | Tool calling 时模型自己执行工具 | 模型只**决定**调什么、传什么参；应用侧执行 |
| 33 | calculator 属于 knowledge augmentation 工具 | 属于 **capability extension**（补模型短板） |
| 34 | RAG 适合做"一共几家"的计数题 | 检索不保证完整 → **database** 干这个 |
| 35 | RAG 答错了就乱改系统 | 先定位 **retrieval failure 还是 generation failure**，再修对应侧 |
| 36 | 四种 grounding 方式只能选一种 | **Real systems combine them; picked by the question** |
| 37 | 固定长度分块不会切断句子 | Fixed-size 会把词切成两半（"Ho"+"urs"） |
| 38 | ChatGPT 就是一个 LLM | GPT 是 LLM；ChatGPT 是包了一层 **wrapper** 的应用 |
| 39 | LLM 记得对话历史所以不需要 memory 功能 | LLM **无内置记忆**；记忆是应用层加的 |
| 40 | 输出 token 与输入 token 同价 | Output tokens 贵 **3–8 倍** |

## 二、易混概念快辨（3 秒反应）

| 易混对 | 一句话区分 |
|---|---|
| Precision vs Recall | P=报的里面多真（准）；R=真的里面抓到几成（全） |
| Overfitting vs Underfitting | 过拟合=train 低 test 高（死记硬背）；欠拟合=都高（没学明白） |
| Normalization vs Standardization | Min-max 压到 [0,1]；Z-score 化成"距均值几个标准差"，无固定界 |
| Stratified vs Clustering sampling | 分层=事先知道组；聚类抽样=组靠数据模式现发现 |
| Feature engineering vs Representation learning | 前者人工造特征；后者模型自动学（CNN） |
| F-test vs Chi-squared | F 测数值特征与 Y 关系；卡方测类别特征与 Y 依赖 |
| MSE vs Cross-entropy | 回归用 MSE；分类用交叉熵 |
| Dropout vs Early stopping | 前者治"网络太复杂"；后者治"训练太过" |
| Batch size vs Epoch | batch size=更新一次看多少样本；epoch=全部数据看几遍 |
| Zero-shot vs Few-shot | 0 个示例 vs 3–5 个示例（都不更新参数） |
| Instruct model vs Chat model | 任务直出 vs 对话互动（SFT 的两种产物） |
| Token vs Tokenization | token 是切出来的单位；tokenization 是切这个动作 |
| Greedy vs Top-k vs Top-p | 全选最高；前 k 个里随机；累计到 p 的集合里随机 |
| Encoder vs Decoder | BERT=encoder-only 双向理解；GPT=decoder-only 单向生成 |
| Raw vs Contextual embedding | 一词一向量 vs 随上下文重建 |
| Benchmark vs Leaderboard | 标准化考试 vs 跨模型排名榜 |
| Pointwise vs Pairwise | 单独打分 vs 两两比较 |
| Retrieval failure vs Generation failure | 没找到对的文档 vs 找到了但答错 |
| Context Recall vs Context Precision | 该抓的抓到几成 vs 抓到的几成有用 |
| Faithfulness vs Answer Relevancy | 答案有 context 支撑吗 vs 答案答了问题吗 |
| Prompt vs Skill vs Context engineering | 用一次 vs 打包复用 vs 决定每次调用模型看到什么 |
| Jailbreaking vs Prompt leaking vs Info extraction | 让模型干坏事 vs 套 system prompt vs 套训练数据/上下文 |
| Prompt stuffing vs RAG vs Database | 塞 prompt（少量稳定）vs 私有文档语义检索 vs 结构化计数筛选 |
| Vector search vs Keyword search vs Hybrid | 语义相似 vs 精确匹配 vs α·向量+(1−α)·关键词 |
| Open weights vs Closed | 文件可下载自跑 vs 只有 API |
| Agent as builder vs worker | 要验证一致性的→builder；开放创意的→worker |

## 三、必背原文口诀（可能原样考）

1. **Baseline before metric. Metric before threshold. Threshold from cost, not from 0.5. Leakage check before test score.**（WK3）
2. **A neuron is a regression; a network is a stack of them with bends in between.**（WK4）
3. **Backprop computes gradients → Gradient Descent updates weights.**（WK4）
4. **Choose hyperparameters on validation set. Report performance on test set.**（WK4）
5. **An AI model is only one component of an AI system.**（WK2）
6. **Words that share similar contexts share similar meanings.**（WK6）
7. **All deep learning systems are made of neural networks; not all neural networks are deep learning models.**（WK4）
8. **A prompt is a spec. Version it; test every change.**（WK8）
9. **Workflow: logic is controlled by code. Agent: logic is controlled by model.**（WK8）
10. **The more the model decides, the more the prompt has to limit.**（WK8）
11. **The model does not run any tools — it decides which tool to call; your application runs it.**（WK9）
12. **Retrieval helps only if it retrieves the right things.**（WK9）
13. **Find out which stage failed (retrieval or generation) before you fix anything.**（WK9）
14. **Open source = free to download, not free to run.**（WK7）
15. **Public scores filter out bad models, but won't help you find the best for your application.**（WK8）
16. **GPT is a language model. ChatGPT is an AI application built around it.**（WK7/8）

## 四、读图题答题模板

| 图类型 | 三句话模板 |
|---|---|
| ROC 曲线 | ① 越靠左上角越好（左上=完美分类）② 对角线=随机猜（AUC 0.5）③ 该模型 AUC=x，区分能力[弱/ decent /强] |
| Loss 曲线（双曲线） | ① train 持续降、test 先降后升 = 过拟合 ② 升点之后是过拟合区间 ③ 对策：early stopping / dropout |
| LR 曲线震荡/缓慢 | ① 震荡 = learning rate 太大 ② 收敛极慢 = 太小 ③ 合适应平滑下降；可用 Adam 自适应 |
| 混淆矩阵 | ① 定位 TP/FP/FN/TN ② 算 P=TP/(TP+FP)、R=TP/(TP+FN) ③ 结合阈值说 FP/FN 变化方向 |
| 激活函数曲线 | ① S 形夹 0–1 = sigmoid（输出层二分类）② 负半轴归零 = ReLU（隐层）③ 斜直线 = linear ④ 阶梯 = threshold |
| 数据分布图 | ① 词表大 → 高维 ② "猫咬狗/狗咬猫"同向量 → 丢语序 ③ 苹果-橘子距离=苹果-车 → 无语义 |
| RAG pipeline 图 | ① 两阶段：offline indexing（load→parse→chunk→embed→vector DB）+ online（query→embed→search→rerank→augment→generate）② query 与 chunk 用同一 embedding model ③ 每个 chunk 一个向量 |
| RLHF 流程图 | ① 人类排序 → ② 训 reward model（human judgment 的 proxy）→ ③ RL 微调 LLM 朝高 reward |

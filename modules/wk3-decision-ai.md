# WK3 · Decision AI：Baselines, Metrics, and Data Leakage

> 对应课件：`MIS3011_26WK3_Decision AI_Systems.pdf`（44 页）
> 关键词：linear/logistic regression、threshold、confusion matrix、precision/recall、ROC/AUC、baseline、data leakage
> 本讲是**判断题与选择题的绝对重灾区**，每个概念都要会。

## 1. 为什么从 Regression 开始（避开 state-of-the-art 陷阱）

- **State-of-the-art 的含义**：it performs better than existing models on some existing and static datasets（在现有静态数据集上比已有模型好）。它**不意味着**：足够快/足够便宜、在你的数据上更好。
- 简单模型的三大优点：① easier to deploy ② easier to understand and debug（可以逐步加复杂组件）③ serve as a **baseline**（复杂模型要和它比）。

<div class="mem-card">
<p>Avoid the state-of-the-art trap: <b>start with the simpler model</b>. 模型开发的两个阶段：Phase 1 用最简单的 heuristic（规则），Phase 2 用最简单的 ML 模型（regression、k-NN、gradient-boosted tree）。每个阶段的方案是下一阶段的 baseline。</p>
</div>

> *"If you think that machine learning will give you a 100% boost, then a heuristic will get you 50% of the way there."* — Martin Zinkevich, Rules of Machine Learning

**为什么学 regression 对理解 DL 重要**：Neural networks = stacking many regression-like layers；同样的优化原则——minimize loss or error between actual Y and predicted Y（最小化真实值与预测值之间的误差）。

业务场景配对（选择题可能考"哪个场景用哪个模型"）：

| 模型 | 业务应用 |
|---|---|
| Linear regression | 房价预测、销售预测（Walmart/Amazon）、股价建模 |
| Logistic regression | 信用卡欺诈检测、客户流失预测、垃圾邮件过滤 |

## 2. Linear Regression（回归）

- 定义：a statistical method that models the relationship between a dependent variable and one or more independent variables by **fitting a straight line (or hyperplane) that minimizes squared errors**。
- 预测**连续值**（continuous outcomes：prices, sales, temperatures）；假设 **linear relationship**（x 每变一单位，y 变固定量）。

核心术语：
- **Residual（残差）** 𝜀 = 实际值 y − 预测值 ŷ
- **SSE（Sum of Squared Errors）**：模型未能解释的方差总量，回归要选让 SSE 最小的线
- **OLS（Ordinary Least Squares，普通最小二乘法）**：选出最佳拟合线的方法

**R² (R-squared)**：the proportion of the variation in the dependent variable explained by the model（被模型解释的因变量变异比例），范围 0–1，越高越好。
**Adjusted R-squared**：考虑预测变量个数后的修正版，提供更准确的解释/预测力度量。

### Train vs Test（考试高频）

- **Train R²**：模型在构建它的数据（training data）上的表现。
- 真实世界表现看 **test data**；训练前先划分数据，通常 **80% train / 20% test**。
- *When we talk about "model performance," we're referring to **test performance** — as long as the test set was genuinely never seen.*

<div class="trap-card">
<p>三个必背结论：<br>① High train R² <b>doesn't guarantee</b> high test R²（训练好 ≠ 测试好）。<br>② <b>Out-of-sample R² can be negative!</b>（当 SSE > SST 时）——R² 为负不是错误，是模型比"直接猜均值"还差。<br>③ 课件实例：加更多变量 train R² 单调上升（0.44→0.83），但 test R² 先升后降甚至变负（-0.08）——变量不是越多越好。</p>
</div>

## 3. Logistic Regression（分类）

- 场景：Y 是 0/1 的二元变量。Linear regression 会输出 -0.2 或 1.5，对 yes/no 决策**无意义**。
- Logistic regression **输出概率（0 到 1 之间）**，再走一个阈值做决策：P ≥ t → 预测 1（churn / 采取行动）；P < t → 预测 0。

理解 logistic function（S 形曲线）：

<svg viewBox="0 0 460 240" style="max-width:520px;background:#0d1226;border-radius:10px">
  <line x1="50" y1="200" x2="430" y2="200" stroke="#2a3454" stroke-width="1.5"/>
  <line x1="50" y1="30" x2="50" y2="200" stroke="#2a3454" stroke-width="1.5"/>
  <path d="M50,196 C180,194 200,40 430,36" fill="none" stroke="#4f8cff" stroke-width="3"/>
  <line x1="50" y1="118" x2="430" y2="118" stroke="#56ccf2" stroke-dasharray="5,5" stroke-width="1.5"/>
  <circle cx="240" cy="118" r="4" fill="#56ccf2"/>
  <text x="414" y="216" fill="#8b98b8" font-size="12">Z</text>
  <text x="20" y="40" fill="#8b98b8" font-size="12">1.0</text>
  <text x="20" y="122" fill="#8b98b8" font-size="12">0.5</text>
  <text x="20" y="204" fill="#8b98b8" font-size="12">0</text>
  <text x="150" y="60" fill="#f2c56c" font-size="12">Z &gt; 0 → P(y=1) &gt; 0.5</text>
  <text x="120" y="190" fill="#f27d7d" font-size="12">Z &lt; 0 → P(y=1) &lt; 0.5</text>
  <text x="255" y="110" fill="#56ccf2" font-size="12">Z = 0 → P = 0.5</text>
</svg>

- Z > 0 → P(y=1) > 0.5；Z < 0 → P(y=1) < 0.5；Z = 0 → P = 0.5
- Z 越大 → 概率越接近 1；Z 越小 → 越接近 0；**输出永远在 0 和 1 之间**。

Churn 案例模型：`Logit = −1.006 + 0.754 × Age − 1.087 × IsActiveMember`（Age 已标准化，1 单位 ≈ 10.5 岁）。解读：Age 系数为正 → 越老 churn 风险**越高**；IsActiveMember 系数为负 → 活跃客户 churn 风险**更低**。系数符号 = 影响方向，考试解释题常考。

## 4. Threshold（阈值）选择

模型给的是概率，业务要的是 YES/NO 决策，中间靠 **threshold t** 连接。不同 t 改变的是**错误的类型**：

- **t = 0.2（低）**：广撒网，抓出尽可能多的潜在 churner，但误报多
- **t = 0.7（高）**：只抓最确定的高危客户，省预算，但会漏人
- **t = 0.5**：标准做法

课件三场景（考试可能换个背景重考）：

| 场景 | 选 t | 理由 |
|---|---|---|
| A. 预算有限（只能联系 100 人） | **HIGH (0.7)** | 聚焦最确定的案例，减少浪费 |
| B. 竞争压力（对手促销挖墙脚） | **LOW (0.2)** | 撒大网保护市场份额 |
| C. 上线第一个月（测试期） | **MEDIUM (0.5)** | 先收集数据以后再优化 |

<div class="trap-card">
<p>阈值不是天然的 0.5！<b>Threshold from cost, not from 0.5</b>（由 FP/FN 的业务代价决定，不由默认决定）。这是判断题超高频陷阱。</p>
</div>

## 5. Confusion Matrix（混淆矩阵）

比较实际结果 vs 预测结果。四个格子（必须默画）：

|  | 预测 = 0（stay） | 预测 = 1（churn） |
|---|---|---|
| **实际 = 0** | **TN** 真阴性 | **FP** 假阳性 |
| **实际 = 1** | **FN** 假阴性 | **TP** 真阳性 |

- **FP**：预测 churn 但实际留下 → 给本来忠诚的客户发折扣，浪费预算
- **FN**：预测留下但实际 churn → 失去本可挽留的高价值客户
- **阈值越大 → FN 越高**（抓得少漏得多）；**阈值越小 → FP 越高**（抓得多误报多）

课件三组数字（threshold 0.2 / 0.5 / 0.7 下）会随 t 变化，但不同模型/阈值间**难以直接比较**（这是引入 precision/recall/ROC 的动机）。

<div class="guide-box">
<p><b>读图指南</b>：看到混淆矩阵，先定位"实际=1"那一行——TP 在右（预测对）、FN 在左（漏了）；再看"实际=0"行——FP 在右（误报）、TN 在左。判断阈值高低：预测=1 的列越宽（FP+TP 越大），阈值越低。</p>
</div>

## 6. Accuracy 及其局限

- **Accuracy = (TP+TN) / 总样本数**。例：(70+10)/99 = 0.81。
- **致命局限：misleading for imbalanced data（类别不平衡时严重误导）**。课件例子：stay:churn = 74:25，模型在 stayed 上 70/74=0.95（极好），在 churned 上只有 10/25=0.4（差），但总体 accuracy 81% 看起来"不错"。

> Lesson: When IT says "81% accurate," always ask: **"What's the performance on EACH class?"**

## 7. Precision & Recall（只关注正类）

| 指标 | 公式 | 中文含义 | 例 |
|---|---|---|---|
| **Precision** | TP/(TP+FP) | 所有被预测为 churner 的人里，真的 churn 的比例 | 10/14 = 0.71 |
| **Recall（= TPR）** | TP/(TP+FN) | 所有真 churner 里，被 AI 抓住的比例 | 10/25 = 0.40 |

- 局限：只关注 positive class；precision 和 recall **存在 trade-off**；都**依赖阈值**。

<div class="mem-card">
<p><b>Precision = 抓得准不准（报的里面多少是真的）；Recall = 抓得全不全（真的里面抓到多少）</b>。一句话：Precision 问"信吗"，Recall 问"漏吗"。</p>
</div>

阈值如何影响 trade-off（课件 P34 三组数要能读）：
- t=0.2 → Precision 0.44 / Recall 0.64（资源充足、可以忍受误报时用）
- t=0.5 → Precision 0.71 / Recall 0.40（FP 与 FN 代价相当时用）
- t=0.7 → Precision 0.89 / Recall 0.32（预算紧、必须减少浪费时用）

<div class="trap-card">
<p>阈值升高：Precision 升、Recall 降；阈值降低：Precision 降、Recall 升。<b>不存在某个阈值让两者同时最高</b>（trade-off 是判断题常考点）。</p>
</div>

## 8. ROC 曲线与 AUC（跨阈值比较一个数）

- **ROC (Receiver Operator Characteristic) Curve**：y 轴 **TPR = TP/(TP+FN)**（就是 recall），x 轴 **FPR = FP/(TN+FP)**。**每个 (FPR, TPR) 点 = 一个阈值设置**。
- 左上角 (TPR=1, FPR=0) = perfect classification；**对角线 = random guessing（随机猜）**，TPR = FPR，AUC = 0.5。

<svg viewBox="0 0 340 320" style="max-width:360px;background:#0d1226;border-radius:10px;float:right;margin:0 0 12px 16px">
  <line x1="50" y1="20" x2="50" y2="270" stroke="#2a3454" stroke-width="1.5"/>
  <line x1="50" y1="270" x2="310" y2="270" stroke="#2a3454" stroke-width="1.5"/>
  <line x1="50" y1="270" x2="310" y2="20" stroke="#5a6684" stroke-dasharray="6,5" stroke-width="1.5"/>
  <path d="M50,270 C100,268 110,60 310,22" fill="rgba(79,140,255,.12)" stroke="#4f8cff" stroke-width="3"/>
  <text x="14" y="30" fill="#8b98b8" font-size="12" transform="rotate(-90 20 60)">TPR</text>
  <text x="290" y="290" fill="#8b98b8" font-size="12">FPR</text>
  <text x="58" y="40" fill="#6dd9a4" font-size="12">左上 = 完美分类</text>
  <text x="190" y="200" fill="#8b98b8" font-size="12">对角线 = 随机猜</text>
  <text x="80" y="250" fill="#f2c56c" font-size="12">AUC = 曲线下面积</text>
  <circle cx="120" cy="180" r="4" fill="#56ccf2"/>
  <text x="130" y="185" fill="#56ccf2" font-size="11">某个阈值 t</text>
</svg>

- **AUC（Area Under the ROC Curve）**：ROC 曲线下面积。AUC 越高 → 区分两类的能力越强、模型越强。课件例：AUC = 0.775 → decent model。
- 用途：**ROC + AUC 可以在一个数上比较多个模型**（弥补 confusion matrix 难跨模型比较的缺点）。

<div class="guide-box">
<p><b>读图指南</b>：ROC 图读三点：① 曲线越靠<b>左上角</b>模型越好；② 曲线在对角线附近 → 模型约等于随机猜；③ AUC 就是曲线下面积，0.5=随机，1.0=完美，0.7-0.8=decent。给一张 ROC 图让你解释，就从这三点答。</p>
</div>

## 9. Baseline（评估分数的参照系）

> *Evaluation metrics, by themselves, mean little. Evaluation results become meaningful only when you have clear baselines.*

三种 baseline：
1. **Zero rule**——always predict the most common class。No model at all（根本不是模型）。
2. **Simple heuristic**——一条能写在餐巾纸上的业务规则。
3. **Existing solution**——团队今天用的东西（spreadsheet、rule engine、某个人）。

Churn 案例：数据 10,000 人，20.4% churn。"永远预测 stay"的模型 accuracy = 80.35%，但 **catches zero churners，recall = 0，AUC = 0.5**。

<div class="exam-card">
<p><b>Pick the baseline BEFORE you train.</b> 顺序口诀（Key Takeaways 原文）：<br>① Baseline before metric.<br>② Metric before threshold.<br>③ Threshold from cost, not from 0.5.<br>④ Leakage check before test score.<br>这四句可能原样出现在判断/选择题里。</p>
</div>

## 10. Data Leakage（数据泄漏，必考大题）

**定义**：When a form of the label 'leaks' into the set of features used in model training, and this same information is **not available during inference**（标签信息泄漏进训练特征，而预测时拿不到这条信息）。

课件经典案例：预测 CT 扫描是否显示肺癌。医院 A 中，医生怀疑癌症的病人会被送去**更高级的扫描仪**——模型学到的其实是"认出哪台机器拍的"，在医院 B（随机分配机器）表现就差。模型学到的是**数据生成过程的伪相关**，不是医学特征。

**三大常见成因**：
1. **Split 之前做 scaling / 填充缺失值**——mean/median/variance 用了全量数据。正确做法：**Split first**，然后用 train split 的统计量去 scale/填充所有 split。
2. **预测时根本拿不到的特征**——数据生成过程泄漏。如 churn 表里 IsActiveMember=0，是"离开前记录的"还是"因为离开才标 0"？You have to know how the data was made.
3. **基于 test set 做任何选择**——每次看了测试结果再改 feature、threshold、hyperparameter，test set 就已经影响了模型（leak runs through you）。

<div class="trap-card">
<p>① 泄漏不是"代码 bug"，而是<b>信息在预测时不可用</b>。② 发现泄漏 → 送你回到 step 2（data engineering），不是原地修补。③ "在 train/test split 之后统一用全量均值做标准化"仍算泄漏——统计量必须只来自 train。</p>
</div>

<div class="mem-card">
<p>泄漏检测口诀：<b>"预测那一刻，模型手里真的有这个特征吗？"</b> 没有 → 泄漏。再加一句：所有预处理统计量只能向 train 要。</p>
</div>

---

## 📝 本讲自测

1. 【判断】训练集 R² 高就保证测试集 R² 也高。（答案：错。High train R² doesn't guarantee high test R²。）
2. 【判断】Out-of-sample R² 不可能为负。（答案：错。SSE > SST 时可以为负。）
3. 【计算·简单】给定混淆矩阵：TN=70, FP=4, FN=15, TP=10。求 Accuracy、Precision、Recall。（答案：Accuracy=(70+10)/99≈0.81；Precision=10/(10+4)≈0.71；Recall=10/(10+15)=0.40。公式记牢：P 的分母看"预测列"，R 的分母看"实际行"。）
4. 【判断】类别不平衡时 accuracy 仍然是一个可靠的模型质量指标。（答案：错。Misleading for imbalanced data。）
5. 【选择】ROC 曲线对角线代表：A) 完美分类 B) 随机猜测 C) 最差模型 D) 阈值 0.5（答案：B）
6. 【判断】因为 0.5 是标准阈值，所以业务中应默认使用 t=0.5。（答案：错。Threshold from cost, not from 0.5。）
7. 【解释】用一句话解释 data leakage，并举一个课件中的例子。（参考：预测时用不到的标签信息混进了训练特征；例：医院按病情轻重分配扫描仪，模型学到"认机器"而非"认癌症"。）
8. 【选择】防止 preprocessing 泄漏的正确顺序是：A) 先 fillna 再 split B) 先 split，用 train 的统计量处理所有 split C) 先 split，各 split 用自己的统计量 D) 无所谓（答案：B）
9. 【判断】"永远预测多数类"是一个合法的 baseline。（答案：对。Zero rule baseline，accuracy 可能很高但 recall=0。）

# WK4 · 神经网络与深度学习 Neural Networks and Deep Learning

> 对应课件：`MIS3011_26WK4_Neural_Networks_and_DL.pdf`（60 页）
> 关键词：perceptron、activation function、forward propagation、loss、gradient descent、learning rate、backpropagation、SGD、overfitting、deep learning
> 上一讲用手工特征（Products_2、Age_sq…）把 AUC 从 0.78 推到 0.846——本讲的问题：**Can a model find these patterns by itself?**

## 1. 从生物神经元到人工神经元

生物神经元三步：① 从其他神经元接收信息 → ② 在细胞体通过电压变化聚合信息 → ③ 电压超过阈值就发出信号。

人工神经元一一对应：① 接收输入 x → ② 用 **weighted sum（加权和）** 聚合 → ③ 加权和超过阈值就输出 1，否则 0。

Hot Dog detector 例子：输入是"有番茄酱(1)、有芥末(1)、没面包(0)"，权重 w 表示**每个输入的重要性**，weighted sum Σwᵢxᵢ 与阈值比较。

**Perceptron（感知机）** 的完整方程：`z = b + Σᵢ wᵢxᵢ`，再经激活函数 `ŷ = g(z)`。其中 w 和 b 合称模型的 **parameters（参数）**。

<div class="mem-card">
<p>感知机的加权和 <b>looks like a linear regression</b>！神经网络的每个神经元本质上就是一个小回归 + 一个激活函数（"弯曲"）。Key takeaway 原文：<b>A neuron is a regression; a network is a stack of them with bends in between.</b></p>
</div>

### 感知机的局限

- 只能解决 **linearly separable problems（线性可分问题）**；输出是二元的（0/1）。
- 上周的 logistic regression 有同样的限制：只能画**直线边界**——所以才需要手工造新特征。

<div class="trap-card">
<p>判断题："感知机可以拟合任意复杂的非线性函数" → 错。单个感知机只能做线性划分；非线性能力来自<b>多层结构 + 非线性激活函数</b>。</p>
</div>

## 2. Activation Functions（激活函数）

为什么需要非线性激活：linear activation g(z)=z 只能处理直线边界；**non-linear activations can help approximate arbitrarily complex functions（非线性激活让网络逼近任意复杂函数）**。

四种常见激活函数（要会认图、会配对）：

| 激活函数 | 公式 | 性质 |
|---|---|---|
| Linear | g(z) = z | linear，只能直线边界 |
| **Sigmoid** | g(z) = 1/(1+e⁻ᶻ) | non-linear，输出 0–1，**恰好就是 logistic regression** |
| **ReLU** | g(z) = max(0, z) | non-linear（课件标注），最常用的隐层激活 |
| Threshold | z>0 → 1，否则 0 | 感知机原始形式，non-linear |

<svg viewBox="0 0 460 190" style="max-width:560px;background:#0d1226;border-radius:10px">
  <text x="20" y="24" fill="#8b98b8" font-size="12">Sigmoid：S 形，输出 0~1</text>
  <line x1="40" y1="150" x2="210" y2="150" stroke="#2a3454"/><line x1="125" y1="30" x2="125" y2="150" stroke="#2a3454"/>
  <path d="M45,148 C90,146 100,35 205,32" fill="none" stroke="#4f8cff" stroke-width="2.5"/>
  <text x="245" y="24" fill="#8b98b8" font-size="12">ReLU：负数全归零</text>
  <line x1="345" y1="150" x2="345" y2="30" stroke="#2a3454"/><line x1="265" y1="150" x2="440" y2="150" stroke="#2a3454"/>
  <path d="M265,150 L345,150 L440,32" fill="none" stroke="#6dd9a4" stroke-width="2.5"/>
  <text x="350" y="168" fill="#6dd9a4" font-size="11">z &lt; 0 → 0</text>
</svg>

<div class="guide-box">
<p><b>读图指南</b>：给一条曲线认激活函数——平滑 S 形夹在 0 和 1 之间是 sigmoid；负半轴贴着 0、正半轴是 45° 直线是 ReLU；一条斜直线是 linear；阶梯跳变是 threshold。二分类输出层用 sigmoid（输出概率），隐层常用 ReLU。</p>
</div>

**Sigmoid 神经元 = logistic regression**：Logit = −1.006 + 0.754×Age − 1.087×IsActiveMember，P(churn) = sigmoid(Logit)。换成神经元语言：inputs Age/IsActiveMember，weights 0.754/−1.087，bias −1.006，activation sigmoid，output P(churn)。**神经网络就是把很多这样的神经元分层连接起来。**

## 3. 神经网络结构与 Forward Propagation

**Fully-connected feed-forward NN（全连接前馈网络）** 四条性质：
1. 每层每个神经元接收**前一层所有神经元**的输入
2. 信息只**向前**流动
3. 每条连接有自己的 learnable weight
4. 每个神经元有 bias term

非线性激活让网络能 **approximate any continuous function（万能逼近）**。

其他架构（判断题可能考"能不能"）：
- 可以不全连接 → **CNNs**（partially connected）
- 信息可以不前馈 → **RNNs**（cycle within the neuron）
- 架构可以组合 → **Transformer** = fully-connected layers + attention layers

**Forward propagation（前向传播）**：输入 × 权重 + bias → 加权和 z → 激活函数 → 输出逐层向前传。ReLU 隐层：`aᵢ = max(0, bᵢ + Σⱼ wᵢⱼxⱼ)`；输出层（二分类）：`ŷ = sigmoid(z)`。

Hot dog detector 网络：2 输入（ketchup/mustard 体积）→ 隐层1 三个 ReLU 神经元 → 隐层2 两个 ReLU 神经元 → 输出 1 个 sigmoid 神经元（二分类 → **输出层选 sigmoid**）。

<div class="exam-card">
<p>输出层激活怎么选：<b>二分类 → sigmoid</b>（输出 0–1 概率）；回归任务 → linear。考试给网络结构图让你选输出激活，就按任务类型答。</p>
</div>

## 4. 神经网络如何学习：三步循环

模型训练 = 重复直到 loss 最小：

1. **Forward pass（前向传播）**：用当前权重做预测
2. **Compare with true values**：计算 **loss**
3. **Backward pass（反向传播）**：更新权重

### 4.1 Loss Function（损失函数）

- 又称 **objective function / cost function**，衡量一组权重 W 的好坏（cost 越低越好）。
- **Empirical loss** = 整个训练数据集上的总损失。
- 两种 loss（选择题高频）：
  - **Quadratic loss（MSE, mean squared error）**：回归问题更好；为什么要平方？——消除正负误差抵消、放大大的误差
  - **Cross-entropy loss**：**适合分类问题的神经网络**；logistic regression 最小化的就是它

<div class="trap-card">
<p>配对陷阱：回归 → quadratic/MSE；分类 → cross-entropy。"cross-entropy 适合回归任务"→ 错。</p>
</div>

### 4.2 Gradient Descent（梯度下降）

- 目标：找让 loss C 最小的 w\* 和 b\*（loss 是 w、b 的函数）。
- **Gradient（梯度）** = loss 函数对每个参数的偏导数 ∂C/∂w。
- 更新规则：`w₁ = w₀ − η·∂C/∂w`，其中 **η（eta）= learning rate（学习率）**。

更新方向直觉：
- 导数为负 → 增大 w；导数为正 → 减小 w（都是往 loss 变小的方向走）
- 斜率大（steeper）→ 离最小值远 → 走大步；斜率小（flatter）→ 接近最小值 → 走小步避免 overshoot

<svg viewBox="0 0 440 210" style="max-width:520px;background:#0d1226;border-radius:10px">
  <path d="M30,40 Q200,260 410,45" fill="none" stroke="#2a3454" stroke-width="2.5"/>
  <line x1="95" y1="158" x2="163" y2="158" stroke="#f2c56c" stroke-width="3"/>
  <polygon points="163,158 152,152 152,164" fill="#f2c56c"/>
  <text x="88" y="176" fill="#f2c56c" font-size="12">w₀</text>
  <circle cx="220" cy="166" r="5" fill="#6dd9a4"/>
  <text x="206" y="190" fill="#6dd9a4" font-size="12">w* 最小值</text>
  <text x="60" y="30" fill="#8b98b8" font-size="12">斜率大 → 大步走 η·∂C/∂w 大</text>
  <text x="230" y="120" fill="#8b98b8" font-size="12">斜率小 → 小步走</text>
  <text x="300" y="60" fill="#4f8cff" font-size="12">w₁ = w₀ − η·∂C/∂w</text>
</svg>

### 4.3 Learning Rate（学习率）——每一步迈多大

- **Too large**：overshoots the bottom（一步跨过谷底，来回震荡甚至发散）
- **Too small**：更新很多次还离谷底很远（收敛慢）
- 实践中用 **adaptive learning rate**（如 Adam）：loss landscape 陡的地方小步、平的地方大步
- Lab 证据：LR 0.01 → val accuracy 0.857 / val AUC 0.867；LR 0.001 → 0.7935 / 0.750，且**网络干脆不预测任何人离开**。结论：**a poor set of hyperparameters might render your model useless**（糟糕的 hyperparameter 能让模型完全没用）。

<div class="guide-box">
<p><b>读图指南</b>：给 loss 曲线认学习率——曲线来回震荡不下降 = LR 太大；曲线下降极慢、几百轮还没到底 = LR 太小；先快后慢平稳收敛 = 合适。解释题答："学习率决定每步更新幅度，太大震荡发散、太小收敛缓慢，实践中用 adaptive optimizer（如 Adam）自动调节。"</p>
</div>

### 4.4 两大难题与解法

**Problem 1：权重太多（可能 >1M），ordinary gradient descent 根本跑不动**（它每轮要看全部 n 个样本、算平均梯度再更新）。
- **Solution 1：Backpropagation（反向传播）**——高效计算每个权重该怎么调；**Backprop computes gradients → Gradient Descent updates weights**（两者分工是选择题考点）。
- **Solution 2：SGD（stochastic variant of gradient descent）**——把数据切成小 **batches**，每处理完一个 batch 更新一次权重，全部 batch 过一遍 = **1 epoch**。
  - **Batch size**：模型每处理多少个样本才更新一次参数
  - **Epoch 数**：模型把全部训练数据看了多少遍
  - 例：N=64000，batch size=128，epoch=3 → 每 epoch 500 个 batch；每个数据点被看了 3 次；权重总共更新 1500 次。

**Problem 2：Overfitting（过拟合）**——见第 6 节。

## 5. 训练神经网络的核心心智模型（Takeaway）

- What we **ACTUALLY care about**：loss on new data（**generalization** 泛化能力）
- What we **DIRECTLY optimize**：loss on training data
- 这两者之间的差距就是过拟合问题存在的根源。

## 6. Overfitting 与 Regularization

| | Train loss | Test loss | 中文比喻 |
|---|---|---|---|
| **Overfitting 过拟合** | 低 | 高 | 死记硬背（记住了训练集，不会举一反三） |
| **Underfitting 欠拟合** | 高 | 高 | 没学明白（模型太简单，训练集都没学好） |

过拟合的两大成因与对应 regularization：

**成因 1：网络"太复杂"**（hidden layers 太多、每层的 neurons 太多）→ **Dropout**：训练时随机把部分节点置 0，迫使网络不依赖少数几个节点。
**成因 2：训练"太充分"**（迭代次数太多）→ **Early Stopping**：在 unseen data 的 loss 上升之前就停。

<svg viewBox="0 0 460 220" style="max-width:540px;background:#0d1226;border-radius:10px">
  <line x1="45" y1="190" x2="440" y2="190" stroke="#2a3454"/>
  <line x1="45" y1="190" x2="45" y2="20" stroke="#2a3454"/>
  <text x="430" y="208" fill="#8b98b8" font-size="12">迭代次数</text>
  <text x="10" y="30" fill="#8b98b8" font-size="12">loss</text>
  <path d="M50,60 C120,120 200,170 420,182" fill="none" stroke="#6dd9a4" stroke-width="2.5"/>
  <path d="M50,55 C130,58 220,80 290,150 C330,196 390,206 430,210" fill="none" stroke="#f27d7d" stroke-width="2.5"/>
  <text x="330" y="70" fill="#6dd9a4" font-size="12">train loss ↓</text>
  <text x="300" y="160" fill="#f27d7d" font-size="12">test loss 先降后升 ↑</text>
  <line x1="292" y1="20" x2="292" y2="190" stroke="#f2c56c" stroke-dasharray="5,5" stroke-width="1.5"/>
  <text x="240" y="35" fill="#f2c56c" font-size="12">early stopping 在这里停</text>
</svg>

<div class="guide-box">
<p><b>读图指南</b>：给两条 loss 曲线判断过拟合——train loss 持续下降、test loss 降到某点后回升，交叉点之后就是过拟合区间，early stopping 应停在 test loss 最低处附近。能默画这张图就掌握了过拟合的全部考点。</p>
</div>

<div class="trap-card">
<p>① Dropout 只在<b>训练时</b>随机丢节点，不是测试时。② Early stopping 靠观察 <b>unseen/test data 的 loss</b> 决定何时停。③ Underfitting 是 train loss 高 + test loss 高——不是"train 好 test 差"。</p>
</div>

## 7. Hyperparameter Tuning（超参数调优）

Lab 中的网络：input 11 features → 2 hidden layers × 6 neurons（ReLU）→ output 1 neuron（sigmoid）；SGD、LR 0.01、binary cross-entropy、batch size 32、100 epochs。结果：NN Test AUC 0.852 vs 上周 logistic regression 0.845——**略胜，且不需要手工特征**（0 vs 3），代价是 121 vs 9 个参数。

**怎么定超参数**（四条路径）：
1. **Rules of Thumb**：LR 从 0.001 或 0.01（Adam）、0.01–0.1（SGD）开始；batch size 32/64/128；隐层 1–2 层起步（复杂问题 3–5）；神经元数常取 (input+output)/2；epochs 训练到 test loss 不再改善
2. **Grid search**：系统地试所有组合，能找到最佳但耗时
3. **Random search**：更快，但可能错过最优
4. **Transfer from similar problems**：借相似任务/论文的超参数

<div class="exam-card">
<p>Hyperparameter tuning 用<b>哪个数据集</b>？——<b>Validation set（单独划分出来的验证集）</b>！报告最终性能才用 test set。<b>Choose hyperparameters on validation set. Report performance on test set.</b>（Key takeaway 原文）</p>
</div>

## 8. 从 Neural Network 到 Deep Learning

- **Deep learning 的定义**：a neural network that has **more than three layers**；"Deep" 指**层的深度**（hidden layers 的数量）。
- **NN 与 DL 的关系**：All deep learning systems are made of neural networks; **not all neural networks are deep learning models**（判断题高频）。
- 更深的架构 error rate 更低，因为 deeper layers can capture more complex patterns（深层能捕捉更复杂的模式）。

**为什么 DL 重要**：
1. 手工特征 time consuming、brittle、not scalable；深度网络直接学习 information hierarchies，捕捉 intricate patterns——对 **unstructured data（images, texts, audios, videos）** 至关重要
2. 为海量数据设计；数据集越大，性能还能继续提升

**DL 总是第一选择吗？No — it costs more。** 四大成本：

| 成本 | 说明 |
|---|---|
| **Compute** | 训练要高端 GPU + 大量内存。GPT-3 用 1 张 V100 要约 355 年；用 1024 张 A100 要约 34 天 |
| **Data** | 需要海量 labeled data |
| **Time** | 模型越复杂训练越久 |
| **Interpretability** | 缺乏可解释性与透明度 |

### When the added cost pays off（解释题模板）

银行 churn 案例选 **logistic regression**：性能差距小（AUC 0.845 vs 0.852）、只有 9 个参数、营销团队能看懂每个客户为什么被标记。

**DL 值得付出的四个条件**（同时满足越多越好）：
1. The features are **hard to design by hand**——images, text, audio, video
2. You have **a lot of data**——hundreds of thousands of examples
3. Your use case **demands significant improvement** over your simple model
4. You can **afford the compute**, and **accuracy matters more than transparency**

## 9. From Model to App（模型如何到达用户）

- **Development（一次性）**：data → preprocessing → training → the chosen model → **export**
- **Inference（每次使用）**：a customer → the same preprocessing → inference → the app → the user
- **Export = the model's structure + its learned parameters**；**Deploy** 是个宽泛词，意为让模型跑起来、可被访问；生成预测的过程叫 **inference**。

**App 设计原则——为使用者而设计**：用户是 marketing analyst（不是 data scientist），决策是"给谁打、打多少"，需要看的是**排序列表、打 N 个电话能抓住多少、为什么这个客户被标记**；不需要看 AUC、loss curves、121 parameters。

<div class="lab-card">
<p><b>WK4 Lab 关联</b>：用 NN 重做 churn 预测并对比上周 logistic regression：Test AUC 0.852 vs 0.845；400 个电话能抓住 243 vs 238 个流失者；手工特征 0 vs 3；参数量 121 vs 9。结论："神经网络略胜且不需要手工特征"。这个对比表（P44）本身就是考试读图/解释题的绝佳素材。</p>
</div>

## 10. TED 分享：Agent as Builder vs Agent as Worker（Andrew Ng, 2022 讲、2026 年读）

| 任务 | 让 agent 直接当工人？ | 更好的做法 |
|---|---|---|
| Pizza 需求预测 | No | Agent 搭预测模型，用历史销售测试，交付成 app |
| 布料质检 | No | Agent 搭小 CNN + 质检 app |
| 从热点生成 T 恤设计灵感 | **Yes** | Agent 直接生成创意，人来挑选 |

规律：**需要验证、需要一致性的任务 → agent as builder**；**开放式创意任务 → agent as worker**。判据是任务是否需要"build a system and prove it works"。

---

## 📝 本讲自测

1. 【判断】单个感知机可以解决任意复杂的分类问题。（答案：错。只能解决 linearly separable 问题。）
2. 【选择】二分类神经网络的输出层应该用：A) ReLU B) Sigmoid C) Linear D) Threshold（答案：B。输出 0–1 概率。）
3. 【判断】ReLU 是线性激活函数，因此只能处理直线边界。（答案：错。课件把 ReLU 归为 non-linear，且"只能直线边界"是 linear activation 的局限。）
4. 【选择】Backpropagation 和 Gradient Descent 的分工是：A) 都更新权重 B) BP 算梯度、GD 更新权重 C) GD 算梯度、BP 更新权重 D) 无区别（答案：B）
5. 【判断】Learning rate 越大，模型训练一定越快越好。（答案：错。太大 overshoot，可能让模型完全没用。）
6. 【解释】看 train loss 持续下降、test loss 先降后升的图，说明什么？该怎么办？（参考：过拟合；用 early stopping 在 test loss 回升前停止，或用 dropout 正则化。）
7. 【选择】Hyperparameter tuning 应该在哪个数据集上做？A) Train B) Test C) Validation D) 全量数据（答案：C）
8. 【判断】所有神经网络都是深度学习模型。（答案：错。All DL are NN; not all NN are DL——DL 要求超过三层。）
9. 【选择】Epoch = 3、batch size = 128、N = 64000，权重总共更新多少次？A) 3 B) 384 C) 1500 D) 64000（答案：C。64000/128=500 batch/epoch × 3 = 1500。）
10. 【判断】银行 churn 案例最后选了神经网络，因为它 AUC 明显更高且参数更少。（答案：错。性能差距很小，LR 参数 9 vs 121 更少、可解释性更强，所以选 LR。）

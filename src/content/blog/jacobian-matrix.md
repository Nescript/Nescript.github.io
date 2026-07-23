---
title: "雅可比矩阵和非线性映射和线性映射"
date: 2026-02-13
description: "雅可比矩阵的几何与物理意义，以及向量值函数的全微分形式。"
draft: false
---

参考视频：[理解导数、积分与雅可比矩阵之间的关系！](https://www.bilibili.com/video/BV1EDDuYtEZf)

一个非线性映射在某一点附近很像一个线性映射。

如一个一般的函数 $$f(x) = x^2$$

如果我们关注函数在点 $3$ 附近的映射情况，会发现这个非线性映射很接近一个线性缩放：邻近的点之间的距离变为原来的 $3$ 倍。

这个线性缩放可以用一个矩阵表示（用矩阵表示线性变换只需要给出新的基）：

$$(3)$$

这个矩阵对应了函数 $f(x)$ 在点 $3$ 处的雅可比矩阵，矩阵中的数字就是导数。

这个导数依赖于点的位置。

总结来看，雅可比矩阵就是一个：研究一个特定多维函数在某点附近近似的线性映射。

---

现在我有一个函数 $f$，输出是一个二元向量 $P$，输入也是一个二元向量 $q$，那么这个东西怎么对 $dP$ 全微分？

当你的函数 $f$ 的输入和输出都是二元向量时，这实际上是一个**向量值函数**（Vector-valued function），或者称为**向量场**。

在这种情况下，我们不再讨论单一的“全微分”，而是讨论由偏导数组成的**雅可比矩阵（Jacobian Matrix）**。

---

## 1. 定义与表示

设输入向量为 $\mathbf{q} = \begin{bmatrix} q_1 \\ q_2 \end{bmatrix}$，输出向量为 $\mathbf{P} = \begin{bmatrix} P_1 \\ P_2 \end{bmatrix}$。

函数关系为：

$$\mathbf{P} = f(\mathbf{q}) = \begin{bmatrix} f_1(q_1, q_2) \\ f_2(q_1, q_2) \end{bmatrix}$$

这里的 $P_1$ 和 $P_2$ 分别是关于 $q_1, q_2$ 的多元函数。

## 2. 全微分的形式

对 $\mathbf{P}$ 求全微分 $d\mathbf{P}$，本质上是对其每一个分量分别求全微分：

- $dP_1 = \frac{\partial f_1}{\partial q_1}dq_1 + \frac{\partial f_1}{\partial q_2}dq_2$
- $dP_2 = \frac{\partial f_2}{\partial q_1}dq_1 + \frac{\partial f_2}{\partial q_2}dq_2$

使用矩阵形式表达，这就是最简洁的**全微分公式**：

$$d\mathbf{P} = \mathbf{J} \cdot d\mathbf{q}$$

其中 $\mathbf{J}$ 就是 **Jacobian 矩阵**：

$$\mathbf{J} = \begin{bmatrix} \frac{\partial P_1}{\partial q_1} & \frac{\partial P_1}{\partial q_2} \\ \frac{\partial P_2}{\partial q_1} & \frac{\partial P_2}{\partial q_2} \end{bmatrix}$$

---

## 3. 这里的物理/几何含义

- **$d\mathbf{q}$**：输入空间的微小变化量（位移）。
- **$\mathbf{J}$**：线性变换矩阵，它描述了函数在某一点附近的“局部线性化”特征。
- **$d\mathbf{P}$**：输出空间对应的微小响应。

> **注意：** 只有当所有的偏导数都存在且连续时，这个全微分关系才成立。如果 $\mathbf{J}$ 的行列式（即 Jacobian 行列式）不为零，说明这个变换在局部是可逆的。

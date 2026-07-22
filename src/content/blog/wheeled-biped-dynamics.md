---
title: "轮腿机器人动力学推导与建模"
date: 2026-02-13
description: "将轮腿机器人解耦为轮组、摆杆与机体三个部分，采用 Newton-Euler 隔离体法推导系统的非线性动力学方程与状态空间表达。"
tags: ["Robotics", "Control", "Dynamics", "Math"]
---

本推导将机器人视作三个部分：**轮组**、**摆杆**和**机体**。通过隔离体法（Newton-Euler 法）分别建立各部分的平动受力平衡与转动定律，并最终消元整理得到系统的动力学方程。

---

## 1. 对轮组

对于轮组，存在水平方向受力平衡和转动定律。

### 水平方向受力平衡：
$$N_{f}-N=m_{w}\ddot{x}$$

其中：
- $N_{f}$ 是轮子所受静摩擦力（驱动力）
- $N$ 是轮子对摆杆的力的水平分量
- $m_{w}$ 是轮组质量
- $\ddot{x}$ 是轮子位移对时间的二阶导，也就是加速度

### 转动定律：
$$I_{w}\dot{\omega}=T-N_f R$$

其中：
- $I_w$ 是轮组的转动惯量
- $\dot{\omega}$ 是轮组旋转角速度对时间的导，也就是角加速度。有 $\dot{\omega}=\frac{\ddot{x}}{R}$
- $T$ 是我们控制的轮组输出力矩
- $R$ 是轮组半径

上面两个式子可以得到关于 $\ddot{x}$ 的表达式：
$$\ddot{x}=\frac{T-NR}{\frac{I_w}{R}+m_w R}$$

---

## 2. 对摆杆

摆杆有水平方向和竖直方向（倾倒）的受力平衡以及转动定律。

### 水平方向受力平衡：
$$N-N_{\mathrm{M}}=m_{\mathrm{p}}\left(\ddot{x}+\frac{\partial^{2}}{\partial t^{2}}(L \sin \theta)\right)$$

其中：
- $N_{\mathrm{M}}$ 是摆杆对机体力的水平分量
- $m_\mathrm{p}$ 是摆杆的质量
- $\ddot{x}+\frac{\partial^{2}}{\partial t^{2}}(L \sin \theta)$ 实际是将 $x+L\sin\theta$（摆杆的位移等于轮子的位移加上相对位移）对时间求二阶导，得到了摆杆的加速度

### 竖直方向受力平衡：
$$P-P_{\mathrm{M}}-m_{\mathrm{p}} g=m_{\mathrm{p}} \frac{\partial^{2}}{\partial t^{2}}(L \cos \theta)$$

> **勘误说明：** 原文作 $P-P_{\mathrm{M}}-m_{\mathrm{p}} g=m_{\mathrm{p}} \frac{\partial^{2}}{\partial t^{2}}(L \cos \theta)$，但其给出的求导后形式表明应为 $\cos\theta$。

其中：
- $P$ 是驱动轮对摆杆力（沿杆的）的竖直分量
- $P_{\mathrm{M}}$ 是摆杆对机体力的竖直分量
- $m_\mathrm{p}$ 是摆杆的质量
- $\frac{\partial^{2}}{\partial t^{2}}(L \cos \theta)$ 是摆杆竖直方向的位移对时间求二阶导，即竖直方向加速度

### 转动定律：
$$I_{\mathrm{p}}\ddot{\theta}=(PL+P_{\mathrm{M}}L_{\mathrm{M}})\sin\theta-(NL+N_{\mathrm{M}}L_{\mathrm{M}})\cos\theta-T+T_{\mathrm{p}}$$

即：
$$I_{\mathrm{p}}\ddot{\theta}=PL\sin\theta+P_{\mathrm{M}}L_{\mathrm{M}}\sin\theta-NL\cos\theta-N_{\mathrm{M}}L_{\mathrm{M}}\cos\theta-T+T_{\mathrm{p}}$$

其中：
- $L_{\mathrm{M}}$ 是摆杆重心到机体转轴的距离
- $L$ 是摆杆重心到轮组轮轴的距离 
- $T_\mathrm{p}$ 是髋关节转矩

本式即对摆杆两端所受的力（轮对摆杆的力，机体对摆杆的力）分别计算力矩，加上两个电机的力矩得到系统总的力矩。

---

## 3. 对机体

机体同样具有水平方向和竖直方向（倾倒）的受力平衡以及转动定律。

### 水平方向受力平衡：
$$N_{\mathrm{M}}=M(\ddot{x}_{\mathrm{b}}+l\varphi^2\sin\varphi-l\ddot{\varphi}\cos\varphi)$$

> **勘误说明：** 原文作 $N_{\mathrm{M}}=M(\ddot{\theta}_{\mathrm{b}}+l\varphi^2\sin\varphi-l\ddot{\varphi}\cos\varphi)$，考虑实际物理含义，认为 $\ddot{\theta}_{\mathrm{b}}$ 应作 $\ddot{x}_{\mathrm{b}}$。

其中：
- $N_{\mathrm{M}}$ 是摆杆对机体力的水平分量
- $M$ 是机体的质量
- $\theta$ 是摆杆与竖直方向的夹角
- $\varphi$ 是机体与水平的夹角
- $x_{\mathrm{b}}$ 是腿部机构转轴的位移
- $l$ 是机体重心到腿部机构转轴的距离
- $\ddot{x}_{\mathrm{b}}+l\varphi^2\sin\varphi-l\ddot{\varphi}\cos\varphi$ 是 $x_{\mathrm{b}}-l\sin\varphi$ 对时间求二阶导，也就是通过腿部机构转轴的位移 $x_{\mathrm{b}}$ 和机体重心相对的位移 $-l\sin\varphi$ 得到机体水平方向位移，进而得出机体水平方向的加速度

### 竖直方向受力平衡：
$$P_{\mathrm{M}}-Mg=M\frac{\partial^{2}}{\partial t^{2}}\left((L + L_{\mathrm{M}})\cos\theta+l\cos \varphi \right)$$

> **勘误说明：** 原文作 $P_{\mathrm{M}}-Mg=M\frac{\partial^{2}}{\partial t^{2}}\left((L + L_{\mathrm{M}})\cos\theta+l\cos \theta \right)$，但依物理意义，认为 $l\cos \theta$ 应作 $l\cos \varphi$。

其中：
- $P_{\mathrm{M}}$ 是摆杆对机体力的竖直方向分量
- $L_{\mathrm{M}}$ 是摆杆重心到机体转轴的距离
- $L$ 是摆杆重心到轮组轮轴的距离 
- $\frac{\partial^{2}}{\partial t^{2}}\left((L + L_{\mathrm{M}})\cos\theta+l\cos \varphi \right)$ 是将机体重心竖直方向位置表达式 $\left((L + L_{\mathrm{M}})\cos\theta+l\cos \varphi \right)$ 对时间求二阶导得到竖直方向加速度

### 转动定律：
$$I_{\mathrm{M}}\ddot{\varphi}=T_{\mathrm{p}}+N_{\mathrm{M}}l\cos\varphi+P_{\mathrm{M}}l\sin\varphi$$

其中：
- $I_{\mathrm{M}}$ 是机体绕质心的转动惯量
- $T_{\mathrm{P}}$ 是髋关节电机转矩
- $N_{\mathrm{M}}$ 是摆杆对机体力的水平方向分量
- $P_{\mathrm{M}}$ 是摆杆对机体力的竖直方向分量

---

## 4. 结合与消元

通过以上对轮组、摆杆、机体三部分的受力分析与转动定律推导，我们可以消除内力分量（$N, P, N_{\mathrm{M}}, P_{\mathrm{M}}$），建立系统的动力学方程。

### 摆杆加速度项展开：
对摆杆在水平与竖直方向的加速度表达式求导展开：

- 水平方向：
  $$\frac{\partial^{2}}{\partial t^{2}}(L \sin \theta) = L \ddot{\theta} \cos \theta - L \dot{\theta}^2 \sin \theta$$
- 竖直方向：
  $$\frac{\partial^{2}}{\partial t^{2}}(L \cos \theta) = -L \ddot{\theta} \sin \theta - L \dot{\theta}^2 \cos \theta$$

代入摆杆受力方程：
$$N - N_{\mathrm{M}} = m_{\mathrm{p}} \left( \ddot{x} + L \ddot{\theta} \cos \theta - L \dot{\theta}^2 \sin \theta \right)$$
$$P - P_{\mathrm{M}} - m_{\mathrm{p}} g = m_{\mathrm{p}} \left( -L \ddot{\theta} \sin \theta - L \dot{\theta}^2 \cos \theta \right)$$

### 机体加速度项展开：
对机体竖直方向的加速度表达式求导展开：
$$\frac{\partial^{2}}{\partial t^{2}}\left((L + L_{\mathrm{M}})\cos\theta + l\cos \varphi \right) = -(L + L_{\mathrm{M}})(\ddot{\theta}\sin\theta + \dot{\theta}^2\cos\theta) - l(\ddot{\varphi}\sin\varphi + \dot{\varphi}^2\cos\varphi)$$

代入机体竖直方向平衡方程：
$$P_{\mathrm{M}} = Mg - M \left[ (L + L_{\mathrm{M}})(\ddot{\theta}\sin\theta + \dot{\theta}^2\cos\theta) + l(\ddot{\varphi}\sin\varphi + \dot{\varphi}^2\cos\varphi) \right]$$

### 系统状态方程合成：
消去所有内部约束力后，可得到关于广义坐标 $\boldsymbol{q} = [x, \theta, \varphi]^T$ 的三阶耦合非线性微分方程组：

$$\boldsymbol{M}(\boldsymbol{q})\ddot{\boldsymbol{q}} + \boldsymbol{C}(\boldsymbol{q}, \dot{\boldsymbol{q}})\dot{\boldsymbol{q}} + \boldsymbol{G}(\boldsymbol{q}) = \boldsymbol{B} \boldsymbol{\tau}$$

其中：
- $\boldsymbol{q} = \begin{bmatrix} x \\ \theta \\ \varphi \end{bmatrix}$ 为系统的广义坐标列向量，分别代表**轮组位移**、**摆杆倾角**与**机体倾角**
- $\boldsymbol{\tau} = \begin{bmatrix} T \\ T_{\mathrm{p}} \end{bmatrix}$ 为控制输入列向量，分别代表**轮组驱动力矩**与**髋关节电机力矩**
- $\boldsymbol{M}(\boldsymbol{q})$ 为系统的对称正定质量/惯性矩阵
- $\boldsymbol{C}(\boldsymbol{q}, \dot{\boldsymbol{q}})$ 为科里奥利力（Coriolis）及离心力矩阵
- $\boldsymbol{G}(\boldsymbol{q})$ 为重力项矩阵
- $\boldsymbol{B}$ 为映射控制输入到广义力的输入矩阵

---

## 5. 总结

该推导采用**隔离体法（Newton-Euler 法）**，将三体机器人解耦为轮组、摆杆与机体三个子系统，系统地整理了各部分的作用力与反作用力关系。

在小角度假设（$\sin\theta \approx \theta, \cos\theta \approx 1$）与低速运行条件（忽略高阶项 $\dot{\theta}^2, \dot{\varphi}^2$）下，可将非线性系统方程在平衡点附近进行线性化，得到状态空间形式：

$$\dot{\boldsymbol{X}} = \boldsymbol{A}\boldsymbol{X} + \boldsymbol{B}_{\mathrm{sys}}\boldsymbol{U}$$

其中状态向量为 $\boldsymbol{X} = [x, \dot{x}, \theta, \dot{\theta}, \varphi, \dot{\varphi}]^T$，控制向量为 $\boldsymbol{U} = [T, T_{\mathrm{p}}]^T$，为后续基于 LQR 或 MPC 控制器的设计奠定了数学与物理基础。

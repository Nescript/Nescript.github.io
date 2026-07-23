---
title: "旋转的甜甜圈"
date: 2025-12-28
description: "线性代数和 OpenCV"
draft: false
---

> 这是我参与 DynamicX 视觉组考核的一次作业。实际完成的时间应该比 12 月更早些。

## 1. 甜甜圈方程

圆环由两部分组成：

首先我们绘制 xy 平面上的一个圆，参数方程为：

$$
\vec{p}_{circle} = \begin{bmatrix} R_2 + R_1\cos\theta \\ R_1\sin\theta \\ 0 \end{bmatrix}
$$

我们通过下列矩阵描述圆绕 y 轴的旋转：

$$
R_y(\phi) = \begin{bmatrix}
\cos\phi & 0 & \sin\phi \\
0 & 1 & 0 \\
-\sin\phi & 0 & \cos\phi
\end{bmatrix}
$$

进一步将矩阵应用在小圆上可得到甜甜圈：

$$
\begin{bmatrix} x \\ y \\ z \end{bmatrix} = R_y(\phi) \begin{bmatrix} R_2 + R_1\cos\theta \\ R_1\sin\theta \\ 0 \end{bmatrix}
$$

综上就得到了甜甜圈的参数方程：

$$
\begin{cases}
x = (R_2 + R_1\cos\theta)\cos\phi \\
y = (R_2 + R_1\cos\theta)\sin\phi \\
z = R_1\sin\theta
\end{cases}
$$

---

## 2. 让甜甜圈转起来

上面我们通过一个绕 y 轴的旋转矩阵得到了甜甜圈的形状，进一步想让甜甜圈转起来，则要对甜甜圈方程应用旋转矩阵。

### 2.1 绕 X 轴旋转矩阵

$$
R_x(A) = \begin{bmatrix}
1 & 0 & 0 \\
0 & \cos A & -\sin A \\
0 & \sin A & \cos A
\end{bmatrix}
$$

**代码实现：**

```cpp
Mat getRotationMatrixX(float angle) {
    Mat R = Mat::eye(3, 3, CV_32F);
    float c = std::cos(angle);
    float s = std::sin(angle);
    R.at<float>(1, 1) = c;
    R.at<float>(1, 2) = -s;
    R.at<float>(2, 1) = s;
    R.at<float>(2, 2) = c;
    return R;
}
```

### 2.2 绕 Z 轴旋转矩阵

$$
R_z(B) = \begin{bmatrix}
\cos B & -\sin B & 0 \\
\sin B & \cos B & 0 \\
0 & 0 & 1
\end{bmatrix}
$$

**代码实现：**

```cpp
Mat getRotationMatrixZ(float angle) {
    Mat R = Mat::eye(3, 3, CV_32F);
    float c = std::cos(angle);
    float s = std::sin(angle);
    R.at<float>(0, 0) = c;
    R.at<float>(0, 1) = -s;
    R.at<float>(1, 0) = s;
    R.at<float>(1, 1) = c;
    return R;
}
```

---

## 3. 透视投影

### 3.1 透视投影公式

将 3D 坐标 $(x, y, z)$ 投影到屏幕上 $(x_p, y_p)$：

$$
\begin{cases}
x_{screen} = \frac{WIDTH}{2} + \frac{K_1 \cdot x}{z} \\
y_{screen} = \frac{HEIGHT}{2} - \frac{K_1 \cdot y}{z}
\end{cases}
$$

其中：

- **K₁**：焦距，计算公式：

$$
K_1 = \frac{WIDTH \cdot K_2 \cdot 3}{8 \cdot (R_1 + R_2)}
$$

- **K₂**：相机到物体的距离
- **z**：旋转后的 z 坐标 + K₂

### 3.2 代码实现

```cpp
float z = rotated_point.at<float>(2, 0) + K2;
float ooz = 1.0f / z;
int xp = (int)(WIDTH / 2 + K1 * ooz * x);
int yp = (int)(HEIGHT / 2 - K1 * ooz * y);
```

---

## 4. 光照

### 4.1 Lambertian 反射定律

表面亮度取决于法向量与光源方向的夹角：

$$
L = \vec{n} \cdot \vec{l} = |\vec{n}| \cdot |\vec{l}| \cdot \cos\alpha
$$

其中：

- **$\vec{n}$**：旋转后的表面法向量
- **$\vec{l}$**：光源方向
- **$\alpha$**：夹角

### 4.2 光照强度计算

**光源方向：** $\vec{l} = [0, 1, -1]$（与博客所选相同）

**代码实现：**

```cpp
Mat light_dir = (Mat_<float>(3, 1) << 0, 1, -1);
normalize(light_dir, light_dir);
float L = rotated_normal.dot(light_dir);
```

### 4.3 背面剔除

$$
\text{如果 } L > 0 \text{ 说明表面朝向光源，绘制}
$$

$$
\text{如果 } L \leq 0 \text{ 说明表面背向光源，不绘制}
$$

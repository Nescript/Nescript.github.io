---
title: "C++实现3D甜甜圈渲染"
date: 2025-12-28
description: "甜甜圈参数方程推导、3D旋转矩阵变换、透视投影与Lambertian光照渲染的实现及知识归纳。"
draft: false
---

> 这是我参与 DynamicX 视觉组考核的一次作业。实际完成的时间应该比12月更早些

### 一、甜甜圈方程

圆环由两部分组成：
首先我们绘制xy平面上的一个圆，参数方程为：
   $$
   \vec{p}_{circle} = \begin{bmatrix} R_2 + R_1\cos\theta \\ R_1\sin\theta \\ 0 \end{bmatrix}
   $$

我们通过下列矩阵描述圆绕 y 轴的旋转
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

### 二、让甜甜圈转起来

上面我们通过一个绕y轴的旋转矩阵得到了甜甜圈的形状，进一步想让甜甜圈转起来，则要对甜甜圈方程应用旋转矩阵

#### 绕 X 轴旋转矩阵

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
#### 绕 Z 轴旋转矩阵

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

### 三、透视投影

#### 1. 透视投影公式

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

#### 2. 代码实现

```cpp
float z = rotated_point.at<float>(2, 0) + K2;
float ooz = 1.0f / z;
int xp = (int)(WIDTH / 2 + K1 * ooz * x);
int yp = (int)(HEIGHT / 2 - K1 * ooz * y);
```


---

### 四、光照

#### 1. Lambertian 反射定律

表面亮度取决于法向量与光源方向的夹角：

$$
L = \vec{n} \cdot \vec{l} = |\vec{n}| \cdot |\vec{l}| \cdot \cos\alpha
$$

其中：
- **$\vec{n}$**：旋转后的表面法向量
- **$\vec{l}$**：光源方向
- **$\alpha$**：夹角

#### 2. 光照强度计算

**光源方向：** $\vec{l} = [0, 1, -1]$（与博客所选相同）

**代码实现：**
```cpp
Mat light_dir = (Mat_<float>(3, 1) << 0, 1, -1);
normalize(light_dir, light_dir);
float L = rotated_normal.dot(light_dir);
```

#### 3. 背面剔除

$$
\text{如果 } L > 0 \text{ 说明表面朝向光源，绘制}
$$

$$
\text{如果 } L \leq 0 \text{ 说明表面背向光源，不绘制}
$$
---


## 知识归纳

本次学习的重点在于线性代数基础在计算机视觉中的应用，特别是不同类型的 2D 图像变换和 3D 刚体旋转。

#### 1. 仿射变换 (Affine Transformation)
*   **定义：** 仿射变换是一种编码了平移、缩放、旋转和剪切（shear）的复合变换。
*   **特性：** 仿射变换最重要的特性是它**保持平行线的性质**，即变换后的平行线依然平行。
*   **矩阵表示：** 在 OpenCV 中，仿射变换通常由一个 $2 \times 3$ 矩阵表示。
*   **限制：** 仿射变换无法将一个正方形变换为任意的四边形。

#### 2. 投影变换 / 单应性 (Projective Transformation / Homography)
*   **定义：** 投影变换（或称为 Homography）是一个 $3 \times 3$ 矩阵，用于将一个图像中的点映射到另一个图像中的对应点。
*   **关系：** 仿射变换是投影变换的一种特殊情况。
*   **透视关系：** 广义上，将 3D 空间映射到 2D 图像的针孔相机模型也被称为“透视投影变换”。
*   **求解：** 求解一个 Homography 矩阵至少需要 **4 对**（且无三点共线）对应的定点才能唯一确定。

#### 3. 欧拉角与刚体旋转 (Euler Angles & Rotation)
*   **定义：** 欧拉角是描述刚体在三维空间取向（姿态）的方法，通过三个有次序的旋转角度来设定。
*   **矩阵关系：** 任何关于刚体旋转的旋转矩阵都是由三个基本旋转矩阵（绕 $x$、$y$、$z$ 轴的旋转）复合而成的。

---

## 与本讲有关的 OpenCV 函数

| OpenCV 函数 | 类别 | 描述 | 应用案例 |
| :--- | :--- | :--- | :--- |
| `getAffineTransform()` | 仿射 | 根据 3 对对应点计算 $2 \times 3$ 的仿射变换矩阵。 | 将一个三角形区域精确地映射到另一个三角形区域。 |
| `getPerspectiveTransform()` | 投影 | 根据 **4 对** 对应点计算 $3 \times 3$ 的投影变换（Homography）矩阵。 | 用于简单的图像校正或已知 4 角点的透视矫正。 |
| `findHomography()` | 投影 | 使用 4 对或 **更多** 对应点（通常是自动检测的低置信度点集）计算 Homography 矩阵。 | **全景图拼接**。 |
| `warpPerspective()` | 投影 | 应用计算出的 Homography 矩阵，对图像进行透视变换。 | 用于校正拍摄倾斜的文档照片，使其看起来是从正面拍摄的。 |

---

### 三、 对思考问题的回答

**思考问题：** 为什么在 `warp-one-triangle-to-another` 的案例中只利用了三对对应点，而不是 Homography 所需的四对？

**回答：**

因为该案例使用的是 `getAffineTransform()` 函数，该函数计算的是**仿射变换**，而非更通用的**投影变换（Homography）**。

1.  **仿射变换所需的点数：** 仿射变换矩阵（$2 \times 3$）只需要最少 **3 对** 不共线的对应点就可以唯一确定。
2.  **投影变换所需的点数：** 投影变换矩阵（$3 \times 3$）需要最少 **4 对** 不共线或不三点共线的对应点才能确定。

由于三角形恰好由三点构成，因此使用仿射变换足以将一个三角形区域无透视地映射到另一个三角形区域。

---

## 心得体会

这一次的学习使用了 NotebookLM，在其帮助下我复习了线性代数并深入理解了甜甜圈的原理。我对之前ros中使用的tf库，以及相关的欧拉角和四元数有了更深的理解。

总结这几次的学习，先前的知识集中在传统视觉识别上，我认为可以应用于设计特定的识别算法，在rm上即是自瞄的识别部分。

而本讲对线性代数的应用，我认为则是自瞄后的计算部分，即我锁定了目标的像素位置，还要进一步去计算目标的三维位置关系，这里就涉及今天的仿射变换和投影变换等线性代数内容。

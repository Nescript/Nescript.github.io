---
title: "从学习XML开始编写xacro和urdf"
date: 2026-01-08
description: "ROS 中 URDF 机器人描述文件、Xacro 宏定义、XML 语法基础与 Gazebo 仿真配置全指南。"
draft: false
---

# 1. XML

XML 是一种用来传输和存储数据的标记语言。
在 ROS 中，XML 用来：

- 书写机器人统一描述文件 URDF，以及进一步的 Xacro
- 实现进程间通信（XML-RPC）。在 `rm_control` 的代码中可以看见不少 XML 的身影，之后再来补充其用意

XML 语法的核心是树结构，以下面的 URDF 文件为例：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<robot name="myfirst">
  <link name="base_link">
    <visual>
      <geometry>
        <cylinder length="0.6" radius="0.2"/>
      </geometry>
    </visual>
  </link>
  <link name="link1">
    ...
  </link>
</robot>
```

`robot` 是根，随后有 `base_link` 和 `link` 两个分叉，分叉往后又有别的枝叶。
这里引出**元素**和**属性**的概念：

- 以上面的文件为例，`robot`, `link`, `visual` 等就是元素。元素指的是从（且包括）开始标签直到（且包括）结束标签的部分。一个元素可以包含：
  - 其他元素
  - 文本
  - 属性
  - 或混合以上所有…
- 在元素后面的，如 `name`, `radius` 是属性。属性的数值一定要用双引号围着，不同的属性用空格分隔

进一步看该文档的整体结构，最开始的 `<?xml version="1.0" encoding="UTF-8"?>` **声明**了文件的 XML 版本和所使用的编码，这是可选的。
下一行就是文件的**根元素**，说明了本文档描述了一个机器人。元素的属性 `name` 说明了机器人名称。
需要明确的是，正如一棵树只有一个根，一个 XML 文件需要一个包裹一切（除了声明）的**根元素**，它是**所有其他元素的父元素**。

所有的 XML 元素一般都有一个**关闭标签**。以 `visual` 为例：有代表开始的 `<visual>`，以及代表结束的 `</visual>`。
但 XML 也允许单标签的使用，写法如下：

```xml
<elementName attribute="value" />
```

现在我们回到 XML 的目的，用来存储和传输数据，通过以上的学习，可以尝试用一个 XML 文件来描述一个图书馆的数据：

首先我们需要一个根元素，想必就是 `library` 了：

```xml
<library>
</library>
```

里面需要一些书：

```xml
<library>
  <book name="Harry Potter">
  </book>
  <book name="Learning XML">
  </book>
</library>
```

我还想记录书的作者，出版年份等信息：

```xml
<library>
  <book name="Harry Potter">
    <author>J K. Rowling</author>
    <year>2005</year>
    <price>29.99</price>
  </book>
  <book name="Learning XML">
    <author>Erik T. Ray</author>
    <year>2003</year>
    <price>39.95</price>
  </book>
</library>
```

很好，就是如此，我们得到了一个形式良好的 XML 文件，记录了图书馆的数据。
请记住以下书写形式良好的 XML 文件的要求：

- XML 文档必须有一个根元素
- XML 元素都必须有一个关闭标签
- XML 标签对大小写敏感
- XML 元素必须被正确的嵌套
- XML 属性值必须加引号

---

# 2. URDF

- [官方 URDF 文档](https://docs.ros.org/en/rolling/Tutorials/Intermediate/URDF/URDF-Main.html)
- [翻译 URDF 文档](http://fishros.org/doc/ros2/humble/Tutorials/Intermediate/URDF/Building-a-Visual-Robot-Model-with-URDF-from-Scratch.html) (虽然上述文档是 ROS 2 的，但它们在 ROS 1 中同样适用)
- **[URDF XML 规范总览主页 (ROS Wiki)](https://wiki.ros.org/urdf/XML)**：该页面列出了构成机器人模型的所有核心 XML 元素。
- [古月居的一篇记录帖](http://dev.guyuehome.com/detail?id=1825483221320433665)
- [Xacro 文档](https://wiki.ros.org/xacro)

要写一个机器人，主要是以下的流程：

- 创建一个根元素 `<robot>`
- 为机器人创建很多 `link`：`base_link` 一般作为车的底盘，接着轮子是一个 `link`，云台是一个 `link`…类比人体，link 就是大腿、小腿之类的部位
- 接着为机器人创建关节 `joint`，joint 会连接两个 link，就像膝盖连接着大腿和小腿
- 为 joint 创建 `transmission`，这是控制器控制机器人的关键
- 还有一个 Gazebo 拓展标签

## 2.1 根元素 `<robot>`

根元素包裹着其他所有元素，有一个 `name` 属性，代表我们机器人的名字。
值得注意的是，如果要用 Xacro，则需要加上 `xmlns:xacro="http://www.ros.org/wiki/xacro"` 这一属性。
综上，根元素的一个例子是：

```xml
<robot name="my_robot" xmlns:xacro="http://www.ros.org/wiki/xacro">

</robot>
```

## 2.2 刚体 `<link>`

描述具有惯性、视觉特征和碰撞属性的刚体（由这句话我们可以知道 link 元素内部就是这几个东西），如下图所示：

![link 结构示意](/images/posts/xml-xacro-urdf/Pasted_image_20260107171650.png)

这里给出一个 link 的例子：

```xml
<link name="gimbal">
  <inertial>
    <origin xyz="0.0 0.0 0.0" rpy="0.0 0.0 0.0"/>
    <mass value="0.1"/>
    <inertia ixx="0.0000175" ixy="0.0" ixz="0.0" iyy="0.0000175" iyz="0.0" izz="0.00002"/>
  </inertial>
  <visual name="">
    <origin xyz="0.0 0.0 0.0" rpy="0.0 0.0 0.0"/>
    <geometry>
      <cylinder length="${gimbal_height}" radius="${gimbal_radius}"/>
    </geometry>
    <material name="white"/>
  </visual>
  <collision>
    <origin xyz="0.0 0.0 0.0" rpy="0.0 0.0 0.0"/>
    <geometry>
      <cylinder length="${gimbal_height}" radius="${gimbal_radius}"/>
    </geometry>
  </collision>
</link>
```

### 2.2.1 惯性 `<inertial>`

本元素描述了物体的物理属性：
- `<origin>` 描述了物体质心相对于这个 link 坐标系的偏移，我们一般创建的都是标准的几何体，质心就在原点，所以全填 0 就好
- `<mass>` 描述了物体的质量，urdf 中所有的数值单位都是国际单位，这里为 kg
- `<inertia>` 3x3 转动惯量矩阵，我这次是让 AI 生一份填进去。以下引用嗣音的笔记内容：

> 我对这个没什么研究，只是平时都将 ixx、iyy、izz 设置为 0.1 或者 0.001，如果仿真模型加载到 gazebo 里后原地乱飞就得想想这个是不是设置太小了。

### 2.2.2 视觉 `<visual>`

本元素描述了物体的视觉属性：
- `<origin>` 描述了**视觉几何元素的坐标系相对于这个 link 坐标系的位姿**，这个一般也全填写 0。刚开始尝试时我选择修改并统一 visual 和 collision 元素的 origin 元素来修改物体位置，但是这样并不是好的实现，应当在 joint 的 origin 元素里定义
- `<geometry>` 描述了这物体看起来是个什么形状，有几个可选标签：
  - `box`（立方体）
  - `cylinder`（圆柱）
  - `sphere`（球体）
  - `mesh`（自定义文件）

几何形状的具体参数在属性里给出：

```xml
<cylinder length="${gimbal_height}" radius="${gimbal_radius}"/>
```

这里使用了一点 Xacro。

- `<material>` 描述了物体的外观材料
在 URDF 前半部分我们可以统一定义各种颜色，如：

```xml
<material name="white">
  <color rgba="1.0 1.0 1.0 1.0"/>
</material>
```

`<material>` 元素设置属性 `name="white"`，在 Gazebo 以及 RViz 里这看起来就是白色的了。也可以从文件加载材质。

### 2.2.3 碰撞箱 `<collision>`

- `<origin>` 描述了碰撞箱几何元素的坐标系相对于这个 link 坐标系的位姿，这个一般也全填写 0。
- `<geometry>` 描述了这物体碰撞箱是个什么形状，设置的与 visual 一样即可。

我们可以通过此项来设置安全区，假设有个机器人头部是半球形，我们希望整个区域都不能靠近，那么可以把碰撞箱设置得更大，如设置为一个长方体。

## 2.3 关节 `<joint>`

`joint` 是链接 link 的关节，如下图所示，joint 描述了连接的 link 分别是谁，link 旋转的方向以及最为关键的，被相连的 link 之间的坐标变换。

![joint 结构示意](/images/posts/xml-xacro-urdf/Pasted_image_20260107180616.png)

以下给出一个 joint 例子：

```xml
<joint name="gimbal_joint" type="revolute">
  <origin xyz="0.0 0.0 0.1" rpy="0.0 0.0 0.0"/>
  <parent link="base_link"/>
  <child link="gimbal"/>
  <axis xyz="0.0 0.0 1.0"/>
  <limit lower="-1.57" upper="1.57" effort="10.0" velocity="1.0"/>
</joint>
```

### 2.3.1 属性 `type`

指定关节类型，常用的有：
- `revolute`：旋转关节，旋转范围受限制（带有 `limit` 标签）
- `continuous`：连续旋转关节，无旋转限制（如轮子）
- `prismatic`：滑动关节，平移运动
- `fixed`：固定关节，不可移动

### 2.3.2 子元素

- `<origin>`：定义子 link 坐标系相对于父 link 坐标系的位姿变化
- `<parent>`：指定父级 link 的名称
- `<child>`：指定子级 link 的名称
- `<axis>`：指定旋转或移动的轴线矢量，如 `xyz="0 0 1"` 表示绕 Z 轴旋转
- `<limit>`：设置运动极限，包括 `lower`（最小角度/位移）、`upper`（最大角度/位移）、`effort`（最大力/力矩）和 `velocity`（最大速度）

---

# 3. Xacro

Xacro（XML Macros）是 URDF 的扩展，允许使用变量、宏定义以及简单的数学运算，大大精简了复杂的 URDF 文件。

## 3.1 变量声明与引用

使用 `<xacro:property>` 定义常量变量：

```xml
<xacro:property name="M_PI" value="3.1415926535897931" />
<xacro:property name="wheel_radius" value="0.05" />
```

在属性中通过 `${var}` 进行引用：

```xml
<cylinder radius="${wheel_radius}" length="0.02"/>
```

## 3.2 宏定义与调用

使用 `<xacro:macro>` 封装可重用的模块（例如重复创建多个轮子）：

```xml
<xacro:macro name="wheel" params="prefix reflect">
  <link name="${prefix}_wheel">
    <visual>
      <geometry>
        <cylinder radius="${wheel_radius}" length="0.02"/>
      </geometry>
    </visual>
  </link>
  <joint name="${prefix}_wheel_joint" type="continuous">
    <parent link="base_link"/>
    <child link="${prefix}_wheel"/>
    <origin xyz="0 ${reflect * 0.1} 0" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
  </joint>
</xacro:macro>

<!-- 实例化左右轮 -->
<xacro:wheel prefix="left" reflect="1" />
<xacro:wheel prefix="right" reflect="-1" />
```

---

# 4. Gazebo 仿真配置

要将 URDF / Xacro 模型加载到 Gazebo 仿真环境中，还需要加入 `<gazebo>` 拓展标签：

1. **摩擦力与刚度参数**：针对每个 `<link>` 设置 `<gazebo reference="link_name">`
2. **gazebo_ros_control 插件**：加载控制插件以接入 ROS 控制器框架

```xml
<gazebo>
  <plugin name="gazebo_ros_control" filename="libgazebo_ros_control.so">
    <robotNamespace>/my_robot</robotNamespace>
  </plugin>
</gazebo>
```

---
title: Mathematics, Robotics & Shiki Syntax Highlighting Showcase
date: 2026-07-23
description: Demonstrating seamless KaTeX formula rendering and Shiki dual-theme code highlighting with an interactive Table of Contents.
tags: ["Math", "KaTeX", "Shiki", "Robotics", "C++"]
categories: ["Tech"]
draft: false
---

This post showcases how mathematical equations and code syntax highlighting are rendered seamlessly within the blog's minimalist aesthetic.

## 1. Mathematical Formulas with KaTeX

KaTeX allows inline math such as $E = mc^2$ or $\vec{F} = m \vec{a}$ as well as block-level LaTeX display equations.

### Euler's Identity

Inline equation: $e^{i\pi} + 1 = 0$ is considered one of the most beautiful formulas in mathematics.

### Kinematics Matrix & Rigid Transformation

In robotics, rigid body transformations in 3D space are represented using homogeneous transformation matrices $T \in \text{SE}(3)$:

$$
T = \begin{bmatrix} 
R & \mathbf{p} \\ 
0_{1 \times 3} & 1 
\end{bmatrix} = \begin{bmatrix} 
r_{11} & r_{12} & r_{13} & p_x \\ 
r_{21} & r_{22} & r_{23} & p_y \\ 
r_{31} & r_{32} & r_{33} & p_z \\ 
0 & 0 & 0 & 1 
\end{bmatrix}
$$

### Normal Distribution Probability Density Function

$$
f(x \mid \mu, \sigma^2) = \frac{1}{\sqrt{2\pi\sigma^2}} \exp\left( -\frac{(x - \mu)^2}{2\sigma^2} \right)
$$

---

## 2. Code Block Syntax Highlighting (Shiki)

The Shiki code highlighter is configured with custom dark/light themes that match the site palette.

### Modern C++ Robotics Trajectory Interpolator

```cpp
#include <iostream>
#include <vector>
#include <cmath>

struct Point3D {
    double x{0.0};
    double y{0.0};
    double z{0.0};
};

// Compute Euclidean Distance between two 3D Waypoints
double calculateDistance(const Point3D& p1, const Point3D& p2) {
    double dx = p2.x - p1.x;
    double dy = p2.y - p1.y;
    double dz = p2.z - p1.z;
    return std::sqrt(dx * dx + dy * dy + dz * dz);
}

int main() {
    Point3D start{0.0, 0.0, 0.0};
    Point3D goal{3.0, 4.0, 12.0};
    
    std::cout << "Trajectory Distance: " << calculateDistance(start, goal) << " meters\n";
    return 0;
}
```

### TypeScript React Component Example

```typescript
import React, { useState } from 'react';

interface CounterProps {
  initialCount?: number;
}

export const MinimalCounter: React.FC<CounterProps> = ({ initialCount = 0 }) => {
  const [count, setCount] = useState<number>(initialCount);

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
      <span className="font-mono text-lg font-medium">{count}</span>
      <button 
        onClick={() => setCount(c => c + 1)}
        className="px-3 py-1 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded text-sm hover:opacity-90"
      >
        Increment
      </button>
    </div>
  );
};
```

---

## 3. Summary & Conclusion

All math formulas, code blocks, and headings integrate harmoniously with the dark/light mode toggle and interactive Table of Contents.

# 3D 滚动小球

一款基于 Three.js 和 Cannon-es 物理引擎的 3D 滚动小球游戏。

[English](./README.md) | [中文](./README_zh.md)

## 功能特性

- **真实物理模拟**：基于 Cannon-es 物理引擎，包含重力、摩擦力和碰撞
- **动态纹理着色器**：自定义 ShaderMaterial 实现速度驱动的视觉效果
  - 颜色随速度变化（青色 → 橙红色）
  - 流动条纹随速度加快
  - 动态光照和发光效果
- **交互控制**：
  - WASD / 方向键移动
  - 空格键暂停/继续
  - 鼠标拖拽旋转视角
  - 滚轮缩放
  - 支持移动端触摸控制
- **碰撞系统**：8个彩色小球，碰撞时遵循牛顿运动定律
- **环境效果**：
  - 高速移动产生火花粒子
  - 随时间随机生成装饰物
  - 第三人称摄像机跟随

## 快速开始

### 环境要求

- Node.js 18+ 和 npm

### 安装

```bash
# 克隆仓库
git clone <仓库地址>
cd 3d-ball-rolling

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build
```

### 操作说明

| 按键 | 动作 |
|------|------|
| W / ↑ | 向前移动 |
| S / ↓ | 向后移动 |
| A / ← | 向左移动 |
| D / → | 向右移动 |
| 空格 | 暂停/继续 |
| 鼠标拖拽 | 旋转视角 |
| 滚轮 | 缩放 |

## 项目结构

```
3d-ball-rolling/
├── index.html          # 入口HTML
├── package.json        # 依赖配置
├── vite.config.js      # Vite配置
├── src/
│   └── main-fixed.js   # 游戏主逻辑（整合所有功能）
├── dist/               # 生产构建输出
└── public/             # 静态资源
```

## 技术细节

### 物理参数

| 参数 | 值 |
|------|-----|
| 重力加速度 | -9.82 m/s² |
| 玩家小球质量 | 5 kg |
| 障碍小球质量 | 8 kg |
| 球-球弹性系数 | 0.4 |
| 线性阻尼 | 0.1 / 0.5 |

### 着色器 Uniform

自定义 ShaderMaterial 使用以下 uniform：
- `uSpeed`: 当前小球速度 (0-20+ m/s)
- `uTime`: 运行时间（驱动动画效果）
- `uLightPos`: 光源位置
- `uCameraPos`: 摄像机位置（边缘光计算）

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 许可证

MIT License - 详见 [LICENSE](LICENSE)

## 致谢

- [Three.js](https://threejs.org/) - 3D 渲染引擎
- [Cannon-es](https://github.com/cannonjs/cannon-es) - 物理引擎
- [Vite](https://vitejs.dev/) - 构建工具

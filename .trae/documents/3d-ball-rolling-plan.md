# 3D 滚动小球项目技术方案与开发计划

## 项目状态：✅ 已完成

本项目已实现完整的3D滚动小球功能，符合GitHub开源发布规范。

---

## 一、技术栈选择

| 技术 | 选型 | 理由 |
|------|------|------|
| 3D渲染 | Three.js | 成熟稳定，社区活跃，API友好，适合快速搭建3D场景 |
| 物理引擎 | Cannon-es | Cannon.js的现代ES模块版本，轻量高效，API清晰，适合浏览器环境 |
| 构建工具 | Vite | 原生ESM支持，启动快，热更新，零配置开箱即用 |
| 前端语言 | Vanilla JavaScript | 无框架依赖，轻量化，性能优异 |
| 样式 | TailwindCSS 3 | 原子化CSS，快速构建UI，无需配置 |

---

## 二、项目文件结构（GitHub发布规范）

```
3d-ball-rolling/
├── index.html              # 入口HTML文件
├── package.json            # 项目依赖配置
├── vite.config.js          # Vite配置
├── tailwind.config.js      # TailwindCSS配置
├── postcss.config.js       # PostCSS配置
├── .gitignore              # Git忽略文件
├── LICENSE                 # MIT开源许可证
├── README.md               # 英文说明文档
├── README_zh.md            # 中文说明文档
├── src/
│   └── main.js             # ✅ 唯一主入口文件（整合所有核心功能）
├── dist/                   # 生产构建输出（自动生成）
└── public/                 # 静态资源
    └── favicon.ico
```

### 核心文件说明

**src/main.js** - 项目唯一主入口文件，整合了以下所有功能：
- 物理世界初始化（Cannon-es）
- 3D场景搭建（Three.js）
- 自定义着色器材质（速度动态纹理）
- 小球物理体创建与同步
- 环境随机变化机制
- 用户交互控制
- 碰撞小球系统（牛顿定律）
- 暂停/恢复功能
- UI界面更新
- 动画循环

### 清理前的冗余文件（已删除）

这些文件的功能已整合到 src/main.js 中：
- `src/ball.js` - 已整合
- `src/controls.js` - 已整合
- `src/environment.js` - 已整合
- `src/main.js` - 重命名为 src/main.js
- `src/physics.js` - 已整合
- `src/scene.js` - 已整合
- `src/simple-test.js` - 测试文件已删除
- `src/ui.js` - 已整合

---

## 三、物理世界搭建（已完成）

### 3.1 物理引擎初始化

```javascript
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)
world.broadphase = new CANNON.NaiveBroadphase()
world.solver.iterations = 10
```

### 3.2 关键参数

| 参数 | 值 | 说明 |
|------|-----|------|
| 重力 | -9.82 m/s² | 真实地球重力加速度 |
| 玩家小球质量 | 5 kg | 适中质量保证滚动感 |
| 静态小球质量 | 8 kg | 碰撞时遵循牛顿定律 |
| 线性阻尼 | 0.1 / 0.5 | 模拟空气阻力 |
| 角阻尼 | 0.1 / 0.5 | 模拟滚动摩擦 |
| 球-球碰撞系数 | 0.4 | 自然弹跳效果 |
| 求解器迭代 | 10次 | 足够精度 |

---

## 四、玩家小球着色器（已完成）

### 4.1 Uniform变量

| Uniform | 类型 | 说明 |
|---------|------|------|
| uSpeed | float | 小球当前速度 |
| uTime | float | 运行时间（驱动条纹流动） |
| uLightPos | vec3 | 光源位置 |
| uCameraPos | vec3 | 摄像机位置（实时更新） |

### 4.2 速度驱动效果

| 效果 | 低速时 | 高速时 |
|------|--------|--------|
| 基础颜色 | 青色 (0.25, 0.65, 0.85) | 橙红色 (0.9, 0.4, 0.2) |
| 条纹密度 | 12 | 20 |
| 条纹流动速度 | 0 | 与速度成正比 |
| 边缘光强度 | 0.3 | 0.7 |
| 发光强度 | 0 | 0.15 |

---

## 五、交互与反馈（已完成）

### 5.1 键盘控制

| 按键 | 动作 |
|------|------|
| W / ↑ | 向前施力 |
| S / ↓ | 向后施力 |
| A / ← | 向左施力 |
| D / → | 向右施力 |
| 空格键 | 暂停/继续 |

### 5.2 其他控制

- 鼠标拖拽：旋转视角
- 滚轮：缩放
- 触摸滑动：移动端控制

---

## 六、碰撞小球系统（已完成）

### 6.1 牛顿定律实现

| 特性 | 实现方式 |
|------|----------|
| 动量守恒 | 碰撞时传递动量 m1*v1 + m2*v2 = const |
| 质量差异 | 玩家5kg vs 小球8kg |
| 弹性碰撞 | 反弹系数0.4 |
| 阻尼效果 | 线性阻尼0.5让小球逐渐停止 |

### 6.2 小球属性

- 数量：8个
- 半径：0.8 ~ 2.0（随机）
- 颜色：6种随机颜色

---

## 七、开发计划

### ✅ Phase 1-6: 全部已完成

所有功能开发已完成，包括：
- 物理模拟
- 自定义着色器
- 交互控制
- 碰撞系统
- UI界面
- 环境效果

---

## 八、依赖清单

```json
{
  "dependencies": {
    "three": "^0.160.0",
    "cannon-es": "^0.20.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

---

## 九、启动方式

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build
```

---

## 十、GitHub发布检查清单

### 必需文件
- ✅ README.md（英文）
- ✅ README_zh.md（中文）
- ✅ LICENSE（MIT许可证）
- ✅ .gitignore
- ✅ package.json
- ✅ src/main.js（主入口）
- ✅ index.html（入口HTML）

### 推荐文件
- ✅ vite.config.js
- ✅ .trae/documents/3d-ball-rolling-plan.md（开发文档）

---

**项目完成日期**：2026-05-17

**最后更新**：2026-05-17

**主要交付物**：
- 完整的3D滚动小球游戏
- 真实物理模拟（Cannon-es）
- 速度驱动动态纹理着色器
- 可碰撞的静态小球（牛顿定律）
- 键盘/触摸交互控制
- 空格键暂停/恢复功能
- 第三人称摄像机跟随
- 实时UI显示

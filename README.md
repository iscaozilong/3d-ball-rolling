# 3D Rolling Ball

A physics-based 3D rolling ball game built with Three.js and Cannon-es.

[English](./README.md) | [中文](./README_zh.md)

## Features

- **Realistic Physics**: Powered by Cannon-es physics engine with gravity, friction, and collision
- **Dynamic Textures**: Custom ShaderMaterial with velocity-driven visual effects
  - Color changes based on speed (cyan → orange-red)
  - Flowing stripe patterns that accelerate with movement
  - Dynamic lighting and glow effects
- **Interactive Controls**:
  - WASD / Arrow keys to move
  - Space to pause/resume
  - Mouse drag to rotate camera
  - Mouse wheel to zoom
  - Touch support for mobile devices
- **Collision System**: 8 colored balls that follow Newton's laws of motion when hit
- **Environment Effects**:
  - Spark particles at high speeds
  - Random decorations spawn over time
  - Third-person camera follow

## Screenshots

```
[Game screenshot placeholder]
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd 3d-ball-rolling

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Controls

| Key | Action |
|-----|--------|
| W / ↑ | Move forward |
| S / ↓ | Move backward |
| A / ← | Move left |
| D / → | Move right |
| Space | Pause / Resume |
| Mouse drag | Rotate camera |
| Scroll | Zoom in/out |

## Project Structure

```
3d-ball-rolling/
├── index.html          # Entry HTML
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── src/
│   └── main-fixed.js   # Main game logic (all-in-one)
├── dist/               # Production build output
└── public/             # Static assets
```

## Technical Details

### Physics

| Parameter | Value |
|-----------|-------|
| Gravity | -9.82 m/s² |
| Player ball mass | 5 kg |
| Obstacle ball mass | 8 kg |
| Ball-ball restitution | 0.4 |
| Linear damping | 0.1 / 0.5 |

### Shader Effects

The custom ShaderMaterial uses the following uniforms:
- `uSpeed`: Current ball velocity (0-20+ m/s)
- `uTime`: Running time for animated effects
- `uLightPos`: Light source position
- `uCameraPos`: Camera position for rim lighting

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- [Three.js](https://threejs.org/) - 3D rendering
- [Cannon-es](https://github.com/cannonjs/cannon-es) - Physics engine
- [Vite](https://vitejs.dev/) - Build tool

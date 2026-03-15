# shashidev.me

An interactive desktop OS-like portfolio website built with modern web technologies. This project demonstrates a unique, immersive user experience with a desktop interface featuring draggable windows, custom cursors, right-click context menus, and more.

## Tech Stack

- **Runtime & Package Manager**: [Bun](https://bun.sh/) — fast JavaScript runtime and package manager
- **Build Tool**: [Vite](https://vitejs.dev/) — next-generation frontend build tool
- **Framework**: [Svelte 5](https://svelte.dev/) — lightweight, reactive UI framework with runes
- **Server**: [nginx](https://nginx.org/) — high-performance reverse proxy and web server
- **Containerization**: [Docker](https://www.docker.com/) — isolated, reproducible deployments

## Features (Planned)

- Custom cursor effects
- Draggable windows with resizing
- Right-click context menus
- Loading screen with animations
- Desktop icons and app launcher
- Responsive desktop OS-like interface
- Dark theme with professional styling

## Prerequisites

- [Bun](https://bun.sh/) — download and install the latest version
- Docker (optional, for containerized builds)
- Git (for cloning the repository)

## Local Development

### Clone and Install

```bash
git clone https://github.com/shashikundur1/portfolio.git
cd portfolio
bun install
```

### Start Development Server

```bash
bun run dev
```

The dev server will start on `http://localhost:5175` with hot module reloading (HMR) enabled. Edit files in `src/` to see changes instantly.

### Build for Production

```bash
bun run build
```

This generates optimized static assets in the `dist/` directory. The build process:

1. Uses Vite to bundle and minify your Svelte components
2. Applies tree-shaking and code splitting
3. Outputs production-ready HTML, CSS, and JavaScript

## Docker

### Build the Docker Image

The Dockerfile uses a multi-stage build to keep image size minimal:

```bash
docker build -t portfolio:latest .
```

**Stage 1 (Build)**: Uses `oven/bun:1-alpine` to install dependencies and build the project.

**Stage 2 (Production)**: Uses `nginx:1.28-alpine` to serve the built assets. The nginx container:
- Runs as non-root user (security best practice)
- Listens on port 8080 (non-privileged)
- Includes a `/health` endpoint for health checks
- Implements graceful shutdown with SIGQUIT
- Adds security headers (CSP, X-Content-Type-Options, etc.)

### Run Locally

```bash
docker run -d -p 8080:8080 portfolio:latest
```

Access the site at `http://localhost:8080`.

## Deployment Architecture

This project uses a **blue-green zero-downtime deployment** pattern with GitHub Actions, GHCR, and a DigitalOcean droplet.

### Deployment Flow

```
1. Push to main branch
      ↓
2. GitHub Actions: Build & Push Image
   - Build Docker image using buildx
   - Push image to GHCR with `:latest` and `:${sha}` tags
   - Use GitHub Actions cache for faster builds
      ↓
3. GitHub Actions: Zero-Downtime Deploy
   - SSH into droplet
   - Determine live slot (blue or green)
   - Pull new image to standby slot
   - Start new container on standby port
   - Health check (15 attempts, 2s interval)
   - If healthy: reload nginx, switch traffic
   - If unhealthy: rollback immediately
      ↓
4. GitHub Actions: Cleanup
   - Remove dangling Docker images
   - Keep only 3 most recent images
   - Prune build cache
```

### Key Components

**GitHub Actions (CI/CD)**
- **Build Job**: Compiles image and pushes to GHCR (ghcr.io/shashikundur1/portfolio)
- **Deploy Job**: Orchestrates blue-green swap via SSH
- **Cleanup Job**: Manages disk space on droplet

**Blue-Green Swap**
- Two container slots (blue, green) running on ports 8080 and 8081
- At any time, only one is live (serving traffic via nginx)
- New deployments start in the standby slot
- After health check passes, traffic switches to new slot
- Old container stops and is removed

**Health Checks**
- Deployed containers expose `/health` endpoint
- GitHub Actions probes health before traffic switch (15 retries × 2s = 30s total)
- Dockerfile includes built-in health check (30s interval)
- Failed health check triggers automatic rollback

**nginx Reverse Proxy**
- Hosted on the droplet (host OS, not containerized)
- Listens on ports 80 (HTTP) and 443 (HTTPS)
- Terminates SSL/TLS (Let's Encrypt certificates)
- Routes traffic to backend container (blue or green)
- Applies security headers (HSTS, CSP, etc.)
- Gzip compression enabled
- 1-year cache for immutable assets

**Rollback**
- If health check fails: container is stopped and removed, traffic unchanged
- If nginx config validation fails: old container is restored, nginx reloaded
- Original live container continues serving requests during any failure

## Project Structure

```
portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml                 # CI/CD pipeline (build, deploy, cleanup)
├── src/
│   ├── main.js                        # Entry point, mounts Svelte app
│   ├── App.svelte                     # Root component
│   ├── apps/
│   │   ├── Experience/                # Experience app placeholder
│   │   ├── Internet/                  # Internet app placeholder
│   │   └── Projects/                  # Projects app placeholder
│   └── lib/
│       ├── components/
│       │   ├── Cursor/                # Custom cursor component
│       │   ├── Desktop/               # Desktop container component
│       │   ├── Loading/               # Loading screen component
│       │   └── Window/                # Draggable window component
│       ├── stores/                    # Svelte stores (reactive state)
│       ├── styles/
│       │   ├── global.css             # Global styles
│       │   └── theme.css              # Theme variables and colors
│       └── utils/                     # Utility functions and helpers
├── public/                            # Static assets (favicon, etc.)
├── .dockerignore                      # Files to exclude from Docker image
├── .editorconfig                      # Editor formatting rules
├── .gitignore                         # Files to exclude from git
├── Dockerfile                         # Multi-stage Docker build
├── index.html                         # HTML entry point
├── jsconfig.json                      # JavaScript config with path aliases
├── nginx-app.conf                     # nginx config for app container
├── nginx.conf                         # Reverse proxy config (host)
├── package.json                       # Dependencies and scripts
├── svelte.config.js                   # Svelte compiler options (runes enabled)
├── vite.config.js                     # Vite build configuration
├── bun.lock                           # Lockfile for Bun
└── README.md                          # This file
```

## Environment Variables & Secrets

The GitHub Actions workflow requires the following secrets configured in your repository settings (`Settings > Secrets and variables > Actions`):

| Secret | Purpose | Example |
|--------|---------|---------|
| `DROPLET_IP` | IP address of your DigitalOcean droplet (or server) | `203.0.113.42` |
| `DROPLET_USER` | SSH user for the droplet (usually `root` or your deploy user) | `deploy` |
| `DROPLET_SSH_KEY` | Private SSH key for authentication | (PEM-formatted private key) |
| `GH_PAT` | GitHub Personal Access Token for pulling from GHCR | (token with `read:packages` scope) |

### Setup Instructions

1. Generate an SSH key (or use existing):
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/portfolio_deploy
   ```

2. Add the public key to your droplet:
   ```bash
   ssh-copy-id -i ~/.ssh/portfolio_deploy.pub root@your-droplet-ip
   ```

3. Create a GitHub Personal Access Token:
   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Create token with `read:packages` scope
   - Copy token value

4. Add secrets to repository:
   - `DROPLET_IP`: Your droplet's IP address
   - `DROPLET_USER`: SSH user (usually `root`)
   - `DROPLET_SSH_KEY`: Contents of private key file (e.g., `~/.ssh/portfolio_deploy`)
   - `GH_PAT`: GitHub Personal Access Token

### First-Time Droplet Setup

Before the first deploy, ensure your droplet has:

1. Docker installed:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
   ```

2. SSL certificates (using Let's Encrypt):
   ```bash
   apt-get install -y certbot python3-certbot-nginx
   certbot certonly --standalone -d shashidev.me -d www.shashidev.me
   ```

3. nginx installed (the deploy workflow handles this automatically on first run)

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this code for personal or commercial purposes. If you fork or use this project, attribution is appreciated but not required.

---

Built with clarity and quality. For questions or contributions, please open an issue or submit a pull request.

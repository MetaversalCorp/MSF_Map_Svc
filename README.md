# MSF Map Service

**Metaverse spatial fabric map service** — A Node.js service that provides capabilities for reading and editing metaverse spatial fabrics. Part of the [Open Metaverse Browser](https://omb.metaverse-standards.org/) ecosystem.

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

---

## Table of Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Installation](#installation)
  - [Linux](#installation-linux)
  - [Windows](#installation-windows)
  - [VPS on Linux](#installation-vps-on-linux)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

MSF Map Service is a backend service that:

- Exposes **REST** and **Socket.IO** APIs for metaverse map operations
- Stores spatial fabric data in **MySQL** or **SQL Server**
- Serves a web-based **Scene Assembler** editor for building 3D scenes from GLB/GLTF models
- Integrates with **Metaversal Fabric** for multi-user access in a Metaverse Browser (VR/AR)

---

## Requirements

- **Node.js** (LTS recommended)
- **Database**: MySQL or SQL Server
- **SSL certificate** (Let's Encrypt or existing trusted certificate)
- **RP1 CompanyId** from [RP1 Developer Center](https://dev.rp1.com) (Requires Developer Account registration and creation of a company. Free.)

---

## Quick Start

```bash
git clone --recurse-submodules https://github.com/MetaversalCorp/MSF_Map_Svc.git
cd MSF_Map_Svc
npm install
```

Then choose your platform and database:

- **Linux + MySQL**: `npm run build:linux:mysql`
- **Linux + SQL Server**: `npm run build:linux:mssql`
- **Windows + MySQL**: `npm run build:win:mysql`
- **Windows + SQL Server**: `npm run build:win:mssql`

After build, configure `dist/settings.json`, run `npm run install:svc` and `npm run install:sample` in `dist/`, then `npm run dev` to test.

---

## Installation

### Installation: Linux

> These are preliminary instructions with limited testing. See the [Open Metaverse Browser Wiki](https://omb.metaverse-standards.org/install/linux) for updates.

#### 1. Setup

1. Clone the repository:
   ```bash
   git clone --recurse-submodules https://github.com/MetaversalCorp/MSF_Map_Svc.git
   cd MSF_Map_Svc
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build for your database:
   ```bash
   npm run build:linux:mysql
   # or
   npm run build:linux:mssql
   ```

#### 2. Create Server

1. Change to the `dist` folder:
   ```bash
   cd dist
   npm install
   ```

2. **Obtain an SSL certificate** (e.g., Let's Encrypt with certbot):
   ```bash
   sudo apt install -y snapd
   sudo snap install core && sudo snap refresh core
   sudo snap install --classic certbot
   sudo ln -sf /snap/bin/certbot /usr/bin/certbot
   sudo certbot certonly --standalone -d example.xyz.com
   sudo ln -sf /etc/letsencrypt/live/example.xyz.com/fullchain.pem ~/MSF_Map_Svc/dist/ssl/server.cert
   sudo ln -sf /etc/letsencrypt/live/example.xyz.com/privkey.pem ~/MSF_Map_Svc/dist/ssl/server.key
   ```

3. **Configure `settings.json`** in `dist/`:
   - **MVSF.LAN**: `port`, `SSL.bUseSSL`, `SSL.key`, `SSL.cert`
   - **MVSF.WAN**: `host` (public URL), `port`
   - **MVSF**: `key` (admin password), `sCompanyId` (from [dev.rp1.com](https://dev.rp1.com))
   - **SQL.config**: `host`, `port`, `user`, `password`, `database` (MySQL) or `connectionString` (SQL Server)

4. **Install server and sample scene**:
   ```bash
   npm run install:svc
   npm run install:sample
   ```

5. **Test**:
   ```bash
   npm run dev
   ```
   Expected output: `SQL Server READY` / `Server running on port 2000`

#### 3. Optional: Run as systemd service

Create `/etc/systemd/system/msf-map-svc.service`:

```ini
[Unit]
Description=MSF Map Service
After=network.target

[Service]
Type=simple
User={YOURUSERNAME}
WorkingDirectory=/home/{YOURUSERNAME}/MSF_Map_Svc/dist
Environment=NODE_INTERNALPORT=2000
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable msf-map-svc
sudo systemctl start msf-map-svc
```

---

### Installation: Windows

> See the [Open Metaverse Browser Wiki](https://omb.metaverse-standards.org/install/windows) for full details.

#### 1. Setup

1. Clone and install:
   ```bash
   git clone --recurse-submodules https://github.com/MetaversalCorp/MSF_Map_Svc.git
   cd MSF_Map_Svc
   npm install
   ```

2. Build:
   ```bash
   npm run build:win:mysql
   # or
   npm run build:win:mssql
   ```

#### 2. Create Server

1. `cd dist` and `npm install`

2. **Obtain an SSL certificate** — Use [win-acme](https://www.win-acme.com/) with Let's Encrypt, or place existing PEM cert/key in `dist/ssl/`.

3. **Configure `settings.json`** — Set LAN, WAN, key, `sCompanyId`, and database config.

4. **Install**:
   ```bash
   npm run install:svc
   npm run install:sample
   ```

5. **Test**: `npm run dev`

#### 3. Optional: Windows Service

```bash
npm install node-windows
```

Create `service.js`:

```javascript
var Service = require('node-windows').Service;
var svc = new Service({
  name: 'Metaverse Map Service',
  description: 'Provides capabilities for reading and editing metaverse spatial fabrics.',
  script: '.\\server.js'
});
svc.on('install', function() { svc.start(); });
svc.install();
```

Run `node service.js`, then configure **Log On As** in Windows Services.

---

### Installation: VPS on Linux

This guide uses [Hostinger](https://hostinger.com) and Ubuntu; the process is similar for other VPS providers.

#### 1. Sign up and create VPS

1. Sign up at hostinger.com
2. VPS → Get Now → Choose location
3. Choose **Ubuntu** (24.04 LTS recommended)
4. Set root password (or add SSH key)
5. Choose plan (KVM1 is sufficient)

#### 2. Install Node.js

```bash
ssh root@YOUR_VPS_IP
sudo apt update && sudo apt upgrade -y
sudo apt install nodejs npm -y
node -v && npm -v
```

#### 3. Install MySQL

```bash
sudo apt install mysql-server
sudo systemctl status mysql
sudo mysql_secure_installation
```

Create a database user:

```bash
sudo mysql
```

```sql
CREATE USER 'map'@'localhost' IDENTIFIED BY '{PASSWORD}';
GRANT ALL PRIVILEGES ON *.* TO 'map'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

#### 4. Install the map service

Follow the [Linux installation](#installation-linux) steps above, using the MySQL user and password you created.

---

## Project Structure

```
MSF_Map_Svc/
├── svc/                    # Server core
│   ├── mapbase.js          # Base server class, auth, MVSF wiring
│   ├── utils.js            # SQL helpers (RunQuery, RunQuery2, InitSQL, EventQueue)
│   ├── handler.json        # Handler modules and protocol config (REST, SocketIO)
│   ├── Handlers/           # Request handlers
│   │   ├── RMBase.js       # Base handler, subscribe/unsubscribe
│   │   ├── RMRoot.js       # Root objects
│   │   ├── RMCObject.js    # Container objects
│   │   ├── RMPObject.js    # Placeholder objects
│   │   └── RMTObject.js    # Transform objects
│   └── config/
│       ├── MySQL/          # MySQL server, install, sample
│       ├── SQL_Server/     # SQL Server server, install
│       └── Railway/        # Railway deployment config
├── db/                     # Database schema and procedures
│   ├── MySQL/              # MySQL tables, functions, procedures
│   └── SQL_Server/         # SQL Server equivalent
├── sa/                     # Scene Assembler (web editor)
│   └── site/               # Static web app (Three.js, Bootstrap, CodeMirror)
└── dist/                   # Output of build (created by npm run build:*)
```

### Key components

| Component | Purpose |
|-----------|---------|
| **@metaversalcorp/mvsf** | Metaversal Fabric framework (REST, Socket.IO) |
| **@metaversalcorp/mvsql_mysql** / **mvsql_mssql** | Database adapters |
| **Handlers (RMBase, RMRoot, RMCObject, RMPObject, RMTObject)** | Map object CRUD and events |
| **Scene Assembler (sa/)** | Web-based 3D scene editor; see [sa/README.md](https://github.com/MetaversalCorp/SceneAssembler/blob/main/README.md) |

### Build scripts

| Script | Description |
|--------|-------------|
| `build:linux:mysql` | Linux + MySQL |
| `build:linux:mssql` | Linux + SQL Server |
| `build:win:mysql` | Windows + MySQL |
| `build:win:mssql` | Windows + SQL Server |
| `build:railway` | Railway deployment (MySQL) |

---

## Contributing

Contributions are welcome. The project is licensed under Apache-2.0.

### For experienced developers

1. **Architecture**
   - Server: `svc/` — Node.js + MVSF; handlers extend `MVHANDLER`
   - Database: `db/MySQL/` and `db/SQL_Server/` — tables, functions, stored procedures
   - Frontend: `sa/site/` — Scene Assembler; see [sa/README.md](https://github.com/MetaversalCorp/SceneAssembler/blob/main/README.md) and [sa/site/js/README.md](https://github.com/MetaversalCorp/SceneAssembler/blob/main/site/js/README.md)

2. **Adding features**
   - **Handlers**: Add or extend handlers in `svc/Handlers/`; register in `handler.json`
   - **Database**: Add procedures in `db/MySQL/Procedures/` or `db/SQL_Server/Procedures/`; update `_Create` scripts
   - **Scene Assembler**: Extend `sa-*.js` modules; keep config in `sa-config.js`

3. **Testing**
   - Run `npm run dev` in `dist/` after setup
   - Serve Scene Assembler with `npx serve sa/site -p 8080` or `python3 -m http.server 8080` in `sa/site`

4. **Code style**
   - Preserve existing patterns and license headers
   - Use `userData` on Three.js objects for app metadata
   - Avoid hardcoding; use `settings.json` and `sa-config.js`

5. **Reporting issues**
   - Open an issue on GitHub
   - For installation problems, the project maintains a [Discord](https://rp1.com/discord) community

---

## License

Apache-2.0. See [LICENSE](LICENSE).

---

## Links

- [Open Metaverse Browser Wiki](https://omb.metaverse-standards.org/)
- [Install on Linux](https://omb.metaverse-standards.org/install/linux)
- [Install on Windows](https://omb.metaverse-standards.org/install/windows)
- [VPS on Linux](https://omb.metaverse-standards.org/install/vps_linux)
- [RP1 Dev Portal](https://dev.rp1.com)

# React Chat App with Rocket.Chat

A modern React chat application that connects to a local Rocket.Chat server. Built with Vite, React, and styled with CSS.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 20.19+ or 22.12+ (for the React app)
- Git

### Clone and Setup

```bash
git clone <your-repo-url>
cd rocketchat-example
```

### Get Registration Token for Rocketchat
Signup on https://cloud.rocket.chat/home

Click on `Register Self Managed`  - copy token 

### Update env vars 
Copy .env.example to `.env`
Update value for `REG_TOKEN`


### Start Rocket.Chat Server

```bash
# Start MongoDB and Rocket.Chat
docker-compose up -d

```

### 4. Start React Example Chat App

```bash
cd chat-app
npm install
npm run dev
```

The React app will be available at `http://localhost:5173` (or another port if 5173 is busy).

## 🔐 Creating Users in Rocket.Chat

### Method 1: Through Admin Panel (Recommended)

1. **Login as Admin**: Go to `http://localhost:3000` and login with your admin credentials
2. **Navigate to Users**: Go to **Administration** → **Users**
3. **Create New User**: Click **+ New** button
4. **Fill User Details**:
   - **Name**: Full name (e.g., "Test User")
   - **Username**: Login username (e.g., "testuser")
   - **Email**: Email address (e.g., "test@example.com")
   - **Password**: Set a password
   - **Roles**: Leave as "user" (default)
5. **Save**: Click **Save** to create the user

### Method 2: Using API (Advanced)

```bash
# Install axios if not already installed
npm install axios

# Run the user creation script
node create-user-script.js
```

## 🎯 Features

- 🔐 **Authentication**: Login with username/password
- 🎨 **Modern UI**: Clean, intuitive interface
- 📋 **Room Management**: Browse and select different channels/rooms


## ⚙️ Configuration

### Environment Variables

The React app uses these environment variables (in `chat-app/.env`):

```env
VITE_ROCKETCHAT_URL=http://localhost:3000
```

### Docker Compose Configuration

The `docker-compose.yml` file sets up:
- **MongoDB 8.0**: Database with replica set
- **Rocket.Chat 7.7.9**: Chat server
- **Persistent volumes**: Data persistence across restarts


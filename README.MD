# Steps to Reproduce the Issue

Follow these steps to reproduce the issue:

## Prerequisites

- Node.js and Yarn installed on your machine

## Steps

### Step 1: Install Dependencies

Run yarn install for all projects:

```bash
# For hostApp
cd hostApp
yarn install

# For mini-server
cd ../mini-server
yarn install

# For miniApp
cd ../miniApp
yarn install
```

### Step 2: Bundle miniApp

Navigate to miniApp directory and run bundle command:

```bash
cd miniApp
yarn bundle
```

### Step 3: Copy Bundle Files

After bundling is complete, copy the entire bundle folder to mini-server:

```bash
cp -r bundle/ ../mini-server/
```

### Step 4: Start mini-server

Run mini-server:

```bash
cd ../mini-server
yarn start
```

### Step 5: Configure hostApp

Open `MiniAppDefine.tsx` file in hostApp and replace the rootUrl with your machine's IP address.

### Step 6: Run hostApp

Start the hostApp:

```bash
cd ../hostApp
yarn start
```

In the Home Screen, tap the "Go to Mini Screen" button to access the mini-app.

## Troubleshooting

If you encounter any issues, please verify that:

- All dependencies are correctly installed
- The IP address in MiniAppDefine.tsx is correct
- Both servers (mini-server and hostApp) are running

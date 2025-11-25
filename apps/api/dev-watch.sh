#!/bin/bash

# Development Watch Script
# Opens two separate terminal windows: one for tests, one for progress tracking

# Get the current directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Open a new terminal window for test watching
osascript <<EOF
tell application "Terminal"
    activate
    do script "cd '$DIR' && clear && echo '🧪 Test Watcher' && echo '════════════════════════════════════════' && bun test --watch"
end tell
EOF

# Wait a moment to avoid terminal conflicts
sleep 1

# Open a new terminal window for progress tracking
osascript <<EOF
tell application "Terminal"
    activate
    do script "cd '$DIR' && clear && echo '📊 Progress Tracker' && echo '════════════════════════════════════════' && bun progress.ts watch"
end tell
EOF

echo "✅ Opened two terminal windows:"
echo "   1. Test Watcher (running tests)"
echo "   2. Progress Tracker (updating every 3 minutes)"

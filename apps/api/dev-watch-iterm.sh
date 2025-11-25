#!/bin/bash

# Development Watch Script for iTerm2
# Opens two separate iTerm2 tabs: one for tests, one for progress tracking

# Get the current directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if iTerm2 is installed
if ! osascript -e 'exists application "iTerm"' 2>/dev/null; then
    echo "❌ iTerm2 is not installed. Please use 'bun run dev:split' for Terminal.app"
    exit 1
fi

# Open iTerm2 with two tabs
osascript <<EOF
tell application "iTerm"
    activate

    -- Create a new window
    create window with default profile

    tell current session of current window
        -- First tab: Test Watcher
        write text "cd '$DIR' && clear && echo '🧪 Test Watcher' && echo '════════════════════════════════════════' && bun test --watch"
    end tell

    -- Create second tab
    tell current window
        create tab with default profile
    end tell

    tell current session of current window
        -- Second tab: Progress Tracker
        write text "cd '$DIR' && clear && echo '📊 Progress Tracker' && echo '════════════════════════════════════════' && bun progress.ts watch"
    end tell
end tell
EOF

echo "✅ Opened two iTerm2 tabs:"
echo "   1. Test Watcher (running tests)"
echo "   2. Progress Tracker (updating every 3 minutes)"

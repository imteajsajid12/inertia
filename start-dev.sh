#!/bin/bash

echo "🚀 Starting SaaS Subscription System Development Servers..."

# Start Laravel server in background
echo "📡 Starting Laravel server on http://localhost:8000"
php artisan serve --host=0.0.0.0 --port=8000 &
LARAVEL_PID=$!

# Start Vite dev server in background  
echo "⚡ Starting Vite dev server..."
npm run dev &
VITE_PID=$!

echo ""
echo "✅ Development servers started!"
echo "🌐 Application: http://localhost:8000"
echo "⚡ Vite HMR: http://localhost:5173"
echo ""
echo "👥 Test Users:"
echo "   Admin: admin@test.com / password"
echo "   Client: client@test.com / password"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping development servers..."
    kill $LARAVEL_PID 2>/dev/null
    kill $VITE_PID 2>/dev/null
    echo "✅ All servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for background processes
wait
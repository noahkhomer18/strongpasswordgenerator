#!/usr/bin/env python3
"""
Simple HTTP Server for StrongPass Generator Website
Run this file to serve your website locally
"""

import http.server
import socketserver
import webbrowser
import os
from pathlib import Path

# Configuration
PORT = 8000
DIRECTORY = Path(__file__).parent

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)
    
    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def main():
    """Start the HTTP server and open the website in browser"""
    
    # Change to the directory containing this script
    os.chdir(DIRECTORY)
    
    # Create the server
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"🚀 Starting StrongPass Generator server...")
        print(f"📁 Serving files from: {DIRECTORY}")
        print(f"🌐 Server running at: http://localhost:{PORT}")
        print(f"🔐 Open your browser and navigate to: http://localhost:{PORT}")
        print(f"⏹️  Press Ctrl+C to stop the server")
        print("-" * 50)
        
        try:
            # Open the website in the default browser
            webbrowser.open(f'http://localhost:{PORT}')
            
            # Start serving
            httpd.serve_forever()
            
        except KeyboardInterrupt:
            print("\n🛑 Server stopped by user")
        except Exception as e:
            print(f"❌ Error: {e}")
        finally:
            httpd.server_close()
            print("✅ Server closed")

if __name__ == "__main__":
    main()

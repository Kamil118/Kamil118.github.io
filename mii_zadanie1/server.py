import http.server
import socketserver
import os

os.chdir("C:/Users/Kamil/Desktop/mii_zadanie1")

class myHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.path = '/video_canvas_webgl.htm'
        print(self.path)
        http.server.SimpleHTTPRequestHandler.do_GET(self)
        return

port = 8000
handler = myHTTPRequestHandler

with socketserver.TCPServer(("",port),handler) as httpd:
    print("serving at port ",port)
    httpd.serve_forever()
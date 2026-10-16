import http.server
import os
import socket
import sys
import threading
import webbrowser


def resource_dir():
    # PyInstaller onefile extracts bundled data under sys._MEIPASS
    base = getattr(sys, "_MEIPASS", os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base, "invisible-cities")


def free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def main():
    directory = resource_dir()
    port = free_port()
    handler = lambda *args, **kwargs: http.server.SimpleHTTPRequestHandler(
        *args, directory=directory, **kwargs
    )
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)

    url = f"http://127.0.0.1:{port}/"
    threading.Timer(0.5, lambda: webbrowser.open(url)).start()

    print(f"Invisible Cities is running at {url}")
    print("Close this window (or press Ctrl+C) to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()

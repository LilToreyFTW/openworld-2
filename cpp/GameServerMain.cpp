/**
 * Virtual Sim — Full-Stack Game Executable
 * HTTP server + game logic + auto-opens browser
 */

#include "GameServer.h"
#include "QuestData.h"
#include "Weapon.h"
#include "GameTypes.h"
#include <string>
#include <fstream>
#include <sstream>
#include <thread>
#include <chrono>
#include <cstdio>

#ifdef _WIN32
#define WIN32_LEAN_AND_MEAN
#include <winsock2.h>
#include <ws2tcpip.h>
#include <windows.h>
#include <shellapi.h>
#pragma comment(lib, "ws2_32.lib")
typedef SOCKET SocketType;
#define CLOSE_SOCKET closesocket
#else
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
typedef int SocketType;
#define CLOSE_SOCKET close
#define INVALID_SOCKET -1
#define SOCKET_ERROR -1
#endif

using namespace game;

class SimpleHTTPServer {
public:
    SimpleHTTPServer(int port) : port_(port), running_(false) {}
    
    void Start() {
        running_ = true;
#ifdef _WIN32
        WSADATA wsaData;
        WSAStartup(MAKEWORD(2, 2), &wsaData);
#endif
        serverThread_ = std::thread(&SimpleHTTPServer::RunServer, this);
    }
    
    void Stop() {
        running_ = false;
        if (serverThread_.joinable()) serverThread_.join();
#ifdef _WIN32
        WSACleanup();
#endif
    }
    
    void SetGameServer(GameServer* gs) { gameServer_ = gs; }
    void SetContentPath(const std::string& path) { contentPath_ = path; }

private:
    void RunServer() {
        SocketType listenSocket = socket(AF_INET, SOCK_STREAM, 0);
#ifdef _WIN32
        if (listenSocket == INVALID_SOCKET) return;
#else
        if (listenSocket < 0) return;
#endif
        
        int opt = 1;
#ifdef _WIN32
        setsockopt(listenSocket, SOL_SOCKET, SO_REUSEADDR, (char*)&opt, sizeof(opt));
#else
        setsockopt(listenSocket, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
#endif
        
        sockaddr_in addr{};
        addr.sin_family = AF_INET;
        addr.sin_addr.s_addr = INADDR_ANY;
        addr.sin_port = htons(static_cast<u_short>(port_));
        
#ifdef _WIN32
        if (bind(listenSocket, (sockaddr*)&addr, sizeof(addr)) == SOCKET_ERROR) {
            CLOSE_SOCKET(listenSocket);
            return;
        }
#else
        if (bind(listenSocket, (sockaddr*)&addr, sizeof(addr)) < 0) {
            CLOSE_SOCKET(listenSocket);
            return;
        }
#endif
        
        listen(listenSocket, 5);
        
        while (running_) {
#ifdef _WIN32
            fd_set readSet;
            FD_ZERO(&readSet);
            FD_SET(listenSocket, &readSet);
            timeval timeout{0, 100000};
            
            if (select(0, &readSet, nullptr, nullptr, &timeout) > 0) {
                SocketType clientSocket = accept(listenSocket, nullptr, nullptr);
                if (clientSocket != INVALID_SOCKET && clientSocket != SOCKET_ERROR) {
                    HandleRequest(clientSocket);
                    CLOSE_SOCKET(clientSocket);
                }
            }
#else
            SocketType clientSocket = accept(listenSocket, nullptr, nullptr);
            if (clientSocket >= 0) {
                HandleRequest(clientSocket);
                CLOSE_SOCKET(clientSocket);
            }
            usleep(100000);
#endif
        }
        CLOSE_SOCKET(listenSocket);
    }
    
    void HandleRequest(SocketType clientSocket) {
        char buffer[4096] = {0};
#ifdef _WIN32
        recv(clientSocket, buffer, sizeof(buffer) - 1, 0);
#else
        read(clientSocket, buffer, sizeof(buffer) - 1);
#endif
        
        std::string request(buffer);
        std::string method, path;
        std::istringstream iss(request);
        iss >> method >> path;
        
        if (path == "/") path = "/game.html";
        if (path[0] == '/') path = path.substr(1);
        
        std::string response;
        
        if (path.find("api/") == 0) {
            response = HandleAPI(path);
        } else {
            response = ServeFile(path);
        }
        
#ifdef _WIN32
        send(clientSocket, response.c_str(), static_cast<int>(response.length()), 0);
#else
        write(clientSocket, response.c_str(), response.length());
#endif
    }
    
    std::string ServeFile(const std::string& path) {
        std::string fullPath = contentPath_ + "/" + path;
        std::ifstream file(fullPath, std::ios::binary);
        
        if (!file.is_open()) {
            return "HTTP/1.1 404 Not Found\r\n\r\n404 Not Found";
        }
        
        std::ostringstream content;
        content << file.rdbuf();
        std::string body = content.str();
        
        std::string contentType = "text/html";
        if (path.find(".js") != std::string::npos) contentType = "application/javascript";
        else if (path.find(".css") != std::string::npos) contentType = "text/css";
        else if (path.find(".mp3") != std::string::npos) contentType = "audio/mpeg";
        else if (path.find(".png") != std::string::npos) contentType = "image/png";
        else if (path.find(".jpg") != std::string::npos || path.find(".jpeg") != std::string::npos) contentType = "image/jpeg";
        
        std::ostringstream response;
        response << "HTTP/1.1 200 OK\r\n"
                 << "Content-Type: " << contentType << "\r\n"
                 << "Content-Length: " << body.length() << "\r\n"
                 << "Access-Control-Allow-Origin: *\r\n"
                 << "\r\n" << body;
        return response.str();
    }
    
    std::string HandleAPI(const std::string& path) {
        if (!gameServer_) return "HTTP/1.1 500 Internal Server Error\r\n\r\n";
        
        if (path == "api/quests") {
            return "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{\"status\":\"ok\"}";
        }
        
        return "HTTP/1.1 404 Not Found\r\n\r\n";
    }
    
    int port_;
    bool running_;
    std::thread serverThread_;
    GameServer* gameServer_ = nullptr;
    std::string contentPath_ = ".";
};

void OpenBrowser(const std::string& url) {
#ifdef _WIN32
    ShellExecuteA(nullptr, "open", url.c_str(), nullptr, nullptr, SW_SHOWNORMAL);
#else
    system(("xdg-open " + url).c_str());
#endif
}

int main(int argc, char** argv) {
    (void)argc;
    (void)argv;
    const int PORT = 8080;
    const std::string URL = "http://localhost:" + std::to_string(PORT);
    
    GameServer gameServer;
    RegisterAllQuests(gameServer.Quests());
    
    SimpleHTTPServer httpServer(PORT);
    httpServer.SetGameServer(&gameServer);
    
    char exePath[1024] = {0};
#ifdef _WIN32
    GetModuleFileNameA(nullptr, exePath, sizeof(exePath));
    std::string exeDir(exePath);
    size_t lastSlash = exeDir.find_last_of("\\/");
    if (lastSlash != std::string::npos) {
        exeDir = exeDir.substr(0, lastSlash);
    }
    httpServer.SetContentPath(exeDir);
#else
    if (readlink("/proc/self/exe", exePath, sizeof(exePath)) > 0) {
        std::string exeDir(exePath);
        size_t lastSlash = exeDir.find_last_of("/");
        if (lastSlash != std::string::npos) {
            exeDir = exeDir.substr(0, lastSlash);
        }
        httpServer.SetContentPath(exeDir);
    }
#endif
    
    httpServer.Start();
    
    std::printf("Virtual Sim Game Server running on %s\n", URL.c_str());
    std::printf("Opening browser...\n");
    
    std::this_thread::sleep_for(std::chrono::milliseconds(500));
    OpenBrowser(URL);
    
    std::printf("Press Enter to stop the server...\n");
    getchar();
    
    httpServer.Stop();
    return 0;
}

# js网络


## DNS解析
什么是DNS解析？当用户输入一个网址并按下回车键的时候，浏览器得到了一个域名。而在实际通信过程中，我们需要的是一个IP地址。因此我们需要先把域名转换成相应的IP地址，这个过程称作DNS解析。
![Image from alias](~@assets/img/1628047184(1).jpg)
![Image from alias](~@assets/img/1628060096(1).jpg)


**1. 浏览器首先搜索浏览器自身缓存的DNS记录。**

或许很多人不知道，浏览器自身也带有一层DNS缓存。Chrome 缓存1000条DNS解析结果，缓存时间大概在一分钟左右。（Chrome浏览器通过输入：chrome://net-internals/#dns 打开DNS缓存页面）

**2. 如果浏览器缓存中没有找到需要的记录或记录已经过期，则搜索hosts文件和操作系统缓存。**
- 在Windows操作系统中，可以通过 ipconfig /displaydns 命令查看本机当前的缓存。
- 通过hosts文件，你可以手动指定一个域名和其对应的IP解析结果，并且该结果一旦被使用，同样会被缓存到操作系统缓存中。
- Windows系统的hosts文件在%systemroot%\system32\drivers\etc下，linux系统的hosts文件在/etc/hosts下。

**3. 如果在hosts文件和操作系统缓存中没有找到需要的记录或记录已经过期，则向域名解析服务器发送解析请求。**
- 其实第一台被访问的域名解析服务器就是我们平时在设置中填写的DNS服务器一项，当操作系统缓存中也没有命中的时候，系统会向DNS服务器正式发出解析请求。这里是真正意义上开始解析一个未知的域名。
- 一般一台域名解析服务器会被地理位置临近的大量用户使用（特别是ISP的DNS），一般常见的网站域名解析都能在这里命中。

**4. 如果域名解析服务器也没有该域名的记录，则开始递归+迭代解析。**
- 这里我们举个例子，如果我们要解析的是mail.google.com。
- 首先我们的域名解析服务器会向根域服务器（全球只有13台）发出请求。显然，仅凭13台服务器不可能把全球所有IP都记录下来。所以根域服务器记录的是com域服务器的IP、cn域服务器的IP、org域服务器的IP……。如果我们要查找.com结尾的域名，那么我们可以到com域服务器去进一步解析。所以其实这部分的域名解析过程是一个树形的搜索过程。
![Image from alias](~@assets/img/1628047785(1).jpg)
- 根域服务器告诉我们com域服务器的IP。
- 接着我们的域名解析服务器会向com域服务器发出请求。根域服务器并没有mail.google.com的IP，但是却有google.com域服务器的IP。
- 接着我们的域名解析服务器会向google.com域服务器发出请求。...
- 如此重复，直到获得mail.google.com的IP地址。

为什么是递归：问题由一开始的本机要解析mail.google.com变成域名解析服务器要解析mail.google.com，这是递归。

为什么是迭代：问题由向根域服务器发出请求变成向com域服务器发出请求再变成向google.com域发出请求，这是迭代。

**5. 获取域名对应的IP后，一步步向上返回，直到返回给浏览器。**


## IP
- 英文：Internet Protocol Address
- 中文：互联网协议地址、IP地址
- 作用：分配给用户上网使用的互联网协议
- 分类：IPv4、IPv6、其他
- 形式：192.168.0.1（长度32位（4个字节），十进制表示）（IPv4）

介绍：
- v：version
- 4或6：版本号
- 优势：IPv6地址空间更大（8组（128位），十六进制）
    - 路由表更小
    - 组播支持以及对流支持增强
    - 对自动配置的支持
    - 更高的安全性
    - ABCD:EF01:2345:6789:ABCD:EF01:2345:6789:

## IP端口号PORT
- IP地址：上海迪斯尼乐园的地址（IPv4或IPv6）
- 端口号：乐园中的不同游乐设施（80、443）
- 解释：找到一个IP就像找到了乐园的地址，你就可以到乐园，相当于可以访问到IP所对应的服务器，IP加端口号，相当于到乐园去玩不同的项目，每个项目其实就是一个端口号。
- 总结：每一个端口对应的是一个服务器的一个业务，访问一个服务器的不同端口相当于访问不同的业务。
- 端口号范围：0-65535
- 默认端口：http协议下（80）、https协议下（443）、FTP协议下（20、21）


## TCP（打电话）
- TCP：Transmission Control Protocol 传输控制协议
- 特点：面向连接（收发数据前，必须建立可靠得连接）
- 建立连接基础：三次握手
- 应用场景：数据必须准确无误的收发
  - HTTP请求、FTP文件传输、邮件收发
- 优点：速度慢、稳定、重传机制、拥塞控制机制、断开连接
- 缺点：效率低、占用资源、容易被攻击（三次握手->DOS、DDOS攻击）
- TCP/IP协议组：提供点对点的连接机制，制定了数据封装、定址、传输、路由、数据接收的标准。

## 建立TCP连接
- 标志位
- SYN：Synchronize Sequence Numbers 同步序列编码
- ACK：Acknowledgment 确认字符
- LISTEN：侦听TCP端口的连接请求（我等着你发送连接请求呢）
- SYN-SENT：在发送连接请求后等待匹配的连接请求（我发送了连接请求，我等你回复哈）
- SYN-RECEIVED：在收到和发送一个连接请求后等待对连接请求的确认（我收到你的连接请求了哈，我等你回复我）
- ESTABLISHED：代表一个打开的连接，数据可以传送给用户（建立连接了哈，我跟你说一下）
![Image from alias](~@alias/img/1628057987(1).jpg)
- 第一次握手：客户端向服务端发送SYN标志位（序号是J），并进入SYN_SEND状态（等待服务器确认状态）。
- 第二次握手：服务器收到来自客户端的SYNJ，服务端会确认该数据包已收到并发送ACK标志位（序号是J+1）和SYN标志位（序号是K），服务器进入SYN_RECV（请求接收并等待客户端确认状态）。
- 第三次握手：客户端进入连接建立状态后，向服务器发送ACK标志位（序号是K+1）确认客户端已收到建立连接确认，服务器收到ACK标志位后，服务端进入连接已建立状态。
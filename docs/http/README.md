# HTTP

## 5层网络协议模型

1. 应用层（HTTP、FTP）
2. 传输层（TCP、UDP）
3. 网络层
4. 数据链路层
5. 物理层

![通信协议](../img/http/img1.jpg)





## HTTP的三次握手

所谓的“三次握手”：为了对每次发送的数据量进行跟踪与协商，确保数据段的发送和接收同步，根据所接收到的数据量而确认数据发送、接收完毕后何时撤消联系，并建立虚连接。 [1] 

为了提供可靠的传送，TCP在发送新的数之前，以特定的顺序将数据包的序号，并需要这些包传送给目标机之后的确认消息。TCP总是用来发送大批量的数据。当应用程序在收到数据后要做出确认时也要用到TCP

![三次握手](../img/http/img2.jpg)



## URI  URL-URN

1. #### URI = Universal Resource Identifier 统一资源标志符

   ​		它包含URL和URN

2. #### URL = Universal Resource Locator 统一资源定位符

   ​		URL唯一地标识一个资源在Internet上的位置。不管用什么方法表示，只要能定位一个资源，就叫URL。

3. #### URN = Universal Resource Name 统一资源名称

   ​		URN它命名资源但不指定如何定位资源，比如：只告诉你一个人的姓名，不告诉你这个人在哪。例如：telnet、mailto、news 和 isbn URI 等都是URN。

4. URI、URL和URN区别

   - URI 指的是一个资源
   - URL 用地址定位一个资源
   - URN 用名称定位一个资源



## HTTP报文格式

![](../img/http/img3.jpg)

​		http方法：用来定义对资源的操作（GET、POST...）

​		http code：定义服务器对请求的处理结果



## curl指令的简单应用

​		curl它的功能非常强大，命令行参数多达几十种。如果熟练的话，完全可以取代 Postman 这一类的图形界面工具。

![1574690272753](../img/http/curlV.png)

- 不带有任何参数时，curl 就是发出 GET 请求。

> ```bash
> $ curl https://www.example.com
> ```

上面命令向`www.example.com`发出 GET 请求，服务器返回的内容会在命令行输出。

- **-v**

`-v`参数输出通信的整个过程，用于调试。

> ```bash
> $ curl -v https://www.example.com
> ```

`--trace`参数也可以用于调试，还会输出原始的二进制数据。

> ```bash
> $ curl --trace - https://www.example.com
> ```

## 跨域

### Access-Control-Allow-Origin

![跨域实例](../img/http/img4.png)

在8888端口下返回test.html文件，在test中访问8887端口

**跨域会导致浏览器拦截response：**Access to XMLHttpRequest at 'http://localhost:8887/' from origin 'http://localhost:8888' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

```js
response.writeHead(200, {
	'Access-Control-Allow-Origin': '*'
})
```

*： 表示允许任何服务都接受，可以设置特地域名

```js
response.writeHead(200, {
	'Access-Control-Allow-Origin': 'http://localhost:8888'
})
```



### JSONP

原理：浏览器允许link script和img标签加载数据，不需要设置允许跨域Access-Control-Allow-Origin

![JSONP](../img/http/img5.png)

## CORS跨域限制以及请求校验

### 限制

​		保持Access-Control-Allow-Origin允许之下，仍然是有限制的（返回200但是浏览器不允许）

- 允许方法: GET、HEAD、POST
- 允许的Content-Type: text/plain、multipart/form-data、application/x-www-form-urlencoded
- 其他限制：请求头限制、XMLHttpRequestUpload对象均没有注册任何事件监听器、请求中没有使用ReadableStream对象

method限制：

```js
    fetch('http://localhost:8887/', {
      method: 'POST',
      headers: {
        'X-Test-Cors': '123'
      }
    })
```

### 浏览器跨域预请求

```js
response.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Test-Cors',
    'Access-Control-Allow-Methods': 'POST,PUT,Delete',
    'Access-Control-Max-Age': '1000'
  })
```

​		通过服务端设置允许的请求头来保证这个跨域请求的进行，在查看Network时会看到有两条请求记录吗，先是OPTIONS请求验证服务端是否允许此请求头的跨域，通过之后才是POST请求：

1. OPTIONS
2. POST

   保证跨域操作的安全性，对跨域方法和请求头的限制

### Access-Control-Max-Age

​		表示跨域请求的参数事件内在第一次预请求之后的时间内不需要再发送OPTIONS预请求（second）



## Cache-Control缓存

这个请求头只是一个希望你按照的这个规则来，你可以不遵守

### 可缓存性

- public: 代表http经过的任何地方，客户端、浏览器、包括代理的中间服务器都可以进行缓存
- private: 只有发起请求的浏览器可以进行和缓存
- no-cache: 可以缓存的，但是每次访问缓存之前需要发送一个请求验证是否可以使用缓存的数据

### 到期 

#### max-age (s)

​		指这个缓存什么时候到期，之后需要重新发起请求而不能读取缓存的内容。

```js
response.writeHeader(200, {
    'Content-Type': 'text/javascript',
    'Cache-Control': 'max-age=200'   // 请求后的200s内再请求可使用缓存数据
})
```



#### s-maxage(s)

​		在浏览器中会读取max-age, 但是在代理服务器中如果同时存在max-age和s-maxage, 会读取s-maxage。

#### max-stale(s)

​		发起请求的一方主动带的一个请求头，即使max-age已经过期，超出max-age时间的响应消息如果还在max-stale有效期之内，还能读取缓存的内容，而不需要重新发起请求。

​		此时max-age和max-stale和

### 重新验证*

#### must-revalidate

​		缓存如果过期必须从原服务端发送请求验证这个缓存是否真的过期，来重新获取数据，而不能读取本地缓存

#### proxy-revalidate

​		在代理服务器中需要重新验证

### 其他

#### no-store

​		客户端和代理服务器都不可以使用缓存数据，必须重新发送请求

#### no-transform

​		代理服务器不能改动数据，例如压缩等等操作

## no-cache资源验证

### Last-Modified

​		上次修改的时间，配合**If-Modified-Since**或者**If-Unmodifiled-Since**使用

​		服务端设置Last-Modified，下次请求会带上If-Modified-Since，以此判断资源是否修改过，然后确认要不要读取缓存的数据还是重新发起请求

### Etag

​		数据签名，资源修改后就更新Etag，配合例如对内容进行一个hash计算，判断两者是否一样，配合If-Match和If-Non-Match使用

```js
response.writeHeader(200, {
    'Content-Type': 'text/javascript',
    'Cache-Control': 'max-age=200000，no-cache',   // no-cache
    'Last-Modified': 'data1',
    'Etag': 'data2'
})

// request  head
// If-Modified-Since: data1
// If-Non-Match：data2

if (etag === data2) {
    response.writeHeader(304, {
        'Content-Type': 'text/javascript',
        'Cache-Control': 'max-age=200000，no-cache',   // no-cache
        'Last-Modified': 'data1',
        'Etag': 'data2'
    })
}
```

- 当请求返回304（Not-Modified）时，此时使用本地缓存的数据，在respond里面的内容是不会返回的



## cookie和session

### cookie

- node里面通过Set-Cookie设置
- 下次请求的head里面会自动带上这个数据
- 可以设置多个key=value

#### 属性

- max-age和expires设置过期时间
- Secure只在https的时候发送
- HttpOnly无法通过document.cookie访问

*cookie的过期时间是在浏览器关闭之后失效，在没有设置过期时间的情况下*

1. 过期之后下次请求Request Headers的Cookie便不会带上这个key=value
2. max-age值有效时间是多长，expires指到这个时间点过期

```js
response.writeHeader(200, {
    'Content-Type': 'text/javascript',
    'Set-Cookie': ['id=123;max-age=10','abc=456；HttpOnly']
})
```

#### cookie domain

cookie在当前域下写入在其他域是无法访问的

但是如果在test.com里面设置了cookie,二级域名下a.test.com/b.test.com都可以访问

### session

cookie不等于session，session的实现方式有很多种，cookie只是其中一种

例如通过对不同用户设置不同的唯一的cookie的key=value值，来**定位用户的数据**

## HTTP长连接

http的创建过程中需要创建一个TCP连接，长连接可以保持TCP的连接不关闭，减少三次握手导致的开销

chrome下可以最多保持6个TCP的并发，那么http长连接可以在此6个TCP连接内传输

现代浏览器下和框架下一般都是长连接 Connection: keep-alive   (close)

```js
response.writeHeader(200, {
    'Content-Type': '......',
    'Connection': 'close'
})
// 每个http请求都要创建一个TCP连接
```

HTTP2：信道复用，tcp内可以并发http请求

## 数据协商

### Accept(客户端)

- Accept：想要的数据类型
- Accept-Encoding：数据的编码方式，限制服务端的数据压缩方法（gzip deflate br...）
- Accept-Language：判断返回的语言(zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7...  q越大表示权重越大   )
- User-Agent:：表示浏览器一些相关的信息，移动端、PC端(Mozilla/5.0(windows NT 10.0; win64; ×64)...)



### Content（服务端）

- Content-Type：服务端返回的数据格式 (type/suntype)

```js
'X-Content-Type-Options': 'nosniff'
// 让浏览器不预测返回的数据类型
```

**发送请求也可以带Content-Type**

```html
<form action="/form" method="POST" enctype="multipart/form-data">
    <input name="name" type="text">
    <input name="password" type="password">
    <input type="file" name="file">
    <input type="submit">
</form>

<form action="/form" method="POST" enctype="application/x-www-form-urlencoded">
    <input name="name" type="text">
    <input name="password" type="password">
    <input type="submit">
</form>
```

- Content-Encoding: 返回的数据编码方式
- Content-Language: 声明返回的语言

### 表单中的 enctype

#### 表单中的三种entype

1. application/x-www-urlencoded
2. multipart/form-data
3. text-plain

​		GET 请求只支持 ASCII 字符集，因此，如果我们要发送更大**字符集的内容**，我们应使用 **POST** 请求。

​		默认情况下是 `application/x-www-urlencoded`，当表单使用 POST 请求时，数据会被以 x-www-urlencoded 方式编码到 Body 中来传送， 而如果 GET 请求，则是附在 url 链接后面来发送(query)。

​		如果要发送大量的二进制数据（non-ASCII），`"application/x-www-form-urlencoded"` 显然是低效的，因为它需要用 3 个字符来表示一个 non-ASCII 的字符。因此，这种情况下，应该使用 `"multipart/form-data"` 格式。

#### application/x-www-urlencoded

​		我们在通过 HTTP 向服务器发送 POST 请求提交数据，都是通过 form 表单形式提交的，代码如下：

```html
<FORM method="post" action="http://w.sohu.com" >
    <INPUT type="text" name="txt1">
    <INPUT type="text" name="txt2">
 </FORM>
```

​		提交时会向服务器端发出这样的数据（已经去除部分不相关的头信息），数据如下：

```dart
POST / HTTP/1.1
Content-Type:application/x-www-form-urlencoded
Accept-Encoding: gzip, deflate
Host: w.sohu.com
Content-Length: 21
Connection: Keep-Alive
Cache-Control: no-cache
 
txt1=hello&txt2=world
```

​		对于普通的 HTML Form POST请求，它会在头信息里使用 `Content-Length` 注明内容长度。
​		请求头信息每行一条，空行之后便是 Body，即“内容”（entity）。内容的格式是在头信息中的 Content-Type 指定的，如上是 `application/x-www-form-urlencoded`，这意味着消息内容会经过 URL 格式编码，就像在 GET请 求时 URL 里的 QueryString 那样。`txt1=hello&txt2=world`

#### multipart/form-data

​		`multipart/form-data` 定义在 [rfc2388](https://tools.ietf.org/html/rfc2388) 中，最早的 HTTP POST 是不支持文件上传的，给编程开发带来很多问题。但是在1995年，ietf 出台了 rfc1867，也就是《RFC 1867 -Form-based File Upload in HTML》，用以支持文件上传。所以 Content-Type 的类型扩充了multipart/form-data 用以支持向服务器发送二进制数据。因此，发送 POST 请求时候，表单 <form> 属性 enctype 共有二个值可选，这个属性管理的是表单的 MIME 编码：

​		① application/x-www-form-urlencoded (默认值)
​		② multipart/form-data

注：form 表单中 enctype 的默认值是 `enctype="application/x- www-form-urlencoded"`.

通过 form 表单提交文件操作如下：

```shell
<FORM method="POST" action="http://w.sohu.com/t2/upload.do" enctype="multipart/form-data">
    <INPUT type="text" name="city" value="Santa colo">
    <INPUT type="text" name="desc">
    <INPUT type="file" name="pic">
 </FORM>
```

浏览器将会发送以下数据：

```kotlin
POST /t2/upload.do HTTP/1.1
User-Agent: SOHUWapRebot
Accept-Language: zh-cn,zh;q=0.5
Accept-Charset: GBK,utf-8;q=0.7,*;q=0.7
Connection: keep-alive
Content-Length: 60408
Content-Type:multipart/form-data; boundary=ZnGpDtePMx0KrHh_G0X99Yef9r8JZsRJSXC
Host: w.sohu.com

--ZnGpDtePMx0KrHh_G0X99Yef9r8JZsRJSXC
Content-Disposition: form-data; name="city"

Santa colo
--ZnGpDtePMx0KrHh_G0X99Yef9r8JZsRJSXC
Content-Disposition: form-data;name="desc"
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 8bit
 
...
--ZnGpDtePMx0KrHh_G0X99Yef9r8JZsRJSXC
Content-Disposition: form-data;name="pic"; filename="photo.jpg"
Content-Type: application/octet-stream
Content-Transfer-Encoding: binary
 
... binary data of the jpg ...
--ZnGpDtePMx0KrHh_G0X99Yef9r8JZsRJSXC--
```

​		从上面的 `multipart/form-data` 格式发送的请求的样式来看，它包含了多个 **Parts**，每个 **Part** 都包含头信息部分，**Part** 头信息中必须包含一个 `Content-Disposition` 头，其他的头信息则为可选项， 比如 `Content-Type` 等。

​		**Content-Disposition** 包含了 type 和 一个名字为 name 的 parameter，type 是 form-data，name 参数的值则为表单控件（也即 field）的名字，如果是文件，那么还有一个 filename 参数，值就是文件名。

比如：

```kotlin
Content-Disposition: form-data; name="user"; filename="hello.txt"
```

​		上面的 "user" 就是表单中的控件的名字，后面的参数 filename 则是点选的文件名。
 		对于可选的 Content-Type（如果没有的话），默认就是 `text/plain`。

##### 注意：

​		如果文件内容是通过填充表单来获得，那么上传的时候，Content-Type 会被自动设置（识别）成相应的格式，如果没法识别，那么就会被设置成 `"application/octet-stream"`
​		如果多个文件被填充成单个表单项，那么它们的请求格式则会是 multipart/mixed。

​		如果 Part 的内容跟默认的 encoding 方式不同，那么会有一个 `"content-transfer-encoding"` 头信息来指定。

​		下面，我们填充两个文件到一个表单项中，行程的请求信息如下：

```dart
Content-Type: multipart/form-data; boundary=AaB03x

--AaB03x
Content-Disposition: form-data; name="submit-name"

Larry
--AaB03x
Content-Disposition: form-data; name="files"
Content-Type: multipart/mixed; boundary=BbC04y

--BbC04y
Content-Disposition: file; filename="file1.txt"
Content-Type: text/plain

... contents of file1.txt ...
--BbC04y
Content-Disposition: file; filename="file2.gif"
Content-Type: image/gif
Content-Transfer-Encoding: binary

...contents of file2.gif...
--BbC04y--
--AaB03x--
```

#### Boundary 分隔符

​		每个部分使用 `--boundary` 分割开来，最后一行使用 `--boundary--` 结尾。



## Redirect重定向

​		**临时跳转302**：将请求重定向到新的地址，必须要设置代表需要进行跳转。

​		**永久跳转301**：永久定向到一个新的路由。from disk cache，可能会一直访问缓存数据，无法控制缓存。（302需要先到旧地址再到新地址，301则在下次让浏览器直接访问新地址）

```js
if (resquest.url === '/') {
    response.writeHead(302, {
        'Location': '/new'
    })
    response.end()
}
if (resquest.url === '/new') {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    })
    response.end('<div>this is content</div>')
}
```


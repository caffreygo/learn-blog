# Express && 爬虫

## Express基础项目结构搭建

### 改良

使用Express开启一个服务器，让浏览器能够访问服务器上的接口

```json
  "scripts": {
    "dev:build": "tsc -w",
    "dev:start": "nodemon node ./build/index.js",
    "dev": "concurrently npm:dev:*"
  },
```

第一次运行`npm run dev`时，由于build和start是并行运行的，当index.js还未生成，会报错找不到index.js

解决：

```json
  "scripts": {
    "dev:build": "tsc -w",
    "dev:start": "nodemon node ./build/index.js",
    "dev": "tsc && concurrently npm:dev:*"
  },
```

在node执行js的时候先tsc编译一次TS代码

### Express搭建服务器

```sh
npm install express --save
npm install @types/express --D
```

```sh
|-- build
|-- data
|-- node_modules
|-- src
|   |-- crowller.ts
|   |-- dellAnalyzer.ts
|   |-- index.ts
|   |-- router.ts
|-- package-lock.json
|-- package.json
|-- tsconfig.json
```

```typescript
// index.js
import express, { Request, Response } from 'express';
import router from './router';

const app = express();
app.use(router);

app.listen(7001, () => {
  console.log('server is running');
});
```

```typescript
// router.ts
import { Router, Request, Response } from 'express';
import Crowller from './crowller';
import DellAnalyzer from './dellAnalyzer';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('hello world !');
});

router.get('/getData', (req: Request, res: Response) => {
  const secret = 'secretKey';
  const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
  const analyzer = DellAnalyzer.getInstance();
  new Crowller(url, analyzer);
  res.send('getData Success!');
});

export default router;
```

### TS编写express代码

现在每次访问getData接口，就会生成新数据，为了防止过多的访问刷新，增加权限

```typescript
router.post('/getData', (req: Request, res: Response) => {
  if (req.body.password === '123') {
    const secret = 'secretKey';
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyzer = DellAnalyzer.getInstance();
    new Crowller(url, analyzer);
    res.send('getData Success!');
  } else {
    res.send('password Error!');
  }
});
```

req.body返回值是undefined,然而编辑器中虽然引入了.d.ts文件，却没有报错。需要有body-parse这个express中间件`npm install body-parse --save`，中间件使用app.use(),必须在app.use(router之前)

```typescript
// index.ts
import express, { Request, Response } from 'express';
import bodyParse from 'body-parser';
import router from './router';

const app = express();
app.use(bodyParse.urlencoded({ extended: false }));
app.use(router);

app.listen(7001, () => {
  console.log('server is running');
});
```

- express库的类型定义文件 .d.ts 文件描述不准确（老框架）
- 当使用中间件的时候，对req res进行了修改，实际上类型并不能改变（例如当对req增加了新属性，但是使用的时候类型没有更新，会报错）
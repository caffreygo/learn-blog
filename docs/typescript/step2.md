# TypeScript语法进阶

## TypeScript中的配置文件

### 编译文件指定

```powershell
tsc --init
```

初始化一个新文件夹并且生成一个tsconfig.json文件

直接 tsc指定编译文件 **不会应用**tsconfig.json的配置的

```powershell
tsc demo.ts
```

**直接运行tsc**则会读取配置文件（ts-node demo.ts 也会使用tsconfig.json）

```powershell
tsc
```

运行 tsc 会先到tsconfig.json中查找配置中需要编译的文件(include)，没有则默认把根目录下的ts文件编译

[tsconfig.json]: http://www.typescriptlang.org/docs/handbook/tsconfig-json.html

- include / files指定需要编译的文件(正则匹配)
- exclude指定不编译的文件(正则匹配)

```json
{
    "include"：["./demo.ts"],
	"compilerOptions"： {
        ...
    }
}
```

### compilerOptions

[compilerOptions]: http://www.typescriptlang.org/docs/handbook/compiler-options.html

- removeComments：移除ts对应的注释项
- strict：对应的strict以下的配置都是true
- noImplicitAny：不允许隐士配置any(true: 需要手动设置any类型)
- strictNullChecks：强制检查null类型 （true : const str:string = null报错）
- rootDir/outDir：指定编译的文件和输出的位置
- incremental：增量编译，对已经编译的文件不再编译
- target：es5编译后的语法
- allowJs：对js文件的编译，（e.g. es6=>es5）
- checkJs: 是否检查JS文件的语法
- sourceMap：是否生成代码的.map文件
- noUnusedLocals：有定义但未使用的变量检查
- noUnusedParameters：有定义但未使用的函数参数检查
- baseUrl：根路径指定

......

## 联合类型和类型保护

### 联合类型

**type a | type b**

```typescript
interface Bird {
  fly: boolean;
  sing: () => {};
}

interface Dog {
  fly: boolean;
  bark: () => {};
}

function trainAnimal(animal: Bird | Dog) {
  // 语法只会提示共有的fly,typescript无法判断具体是哪种
  animal.fly...
}
```



### 类型保护

- 类型断言

```typescript
function trainAnimal(animal: Bird | Dog) {
  if (animal.fly) {
    (animal as Bird).sing();
  } else {
    (animal as Dog).bark();
  }
}
```

- in 语法来做类型保护

```typescript
function trainAnimal(animal: Bird | Dog) {
  if ('sing' in animal) {
    animal.sing();
  } else {
    animal.bark();
  }
}
```

- typeof 语法来做类型保护

```typescript
function add(first: string | number, second: string | number) {
  // 运算符“+”不能应用于类型“string | number”和“string | number”
  // return first + second
  if (typeof first === 'string' || typeof second === 'string') {
    return `${first}${second}`
  } else {
    return first + second
  }
}
```

- 使用instanceof 语法来做类型保护（class才可以使用instanceof ， interface不可以）

```typescript
class NumberObj {
  count: number;
}

function addSecond (first : object | NumberObj, second : object | NumberObj) {
  if(first instanceof NumberObj && second instanceof NumberObj) {
    return first.count + second.count
  }
  return 0
}
```

## Enum 枚举类型

```powershell
npm init -y
npm install ts-node -D
npm install typescript -D
```

- JavaScript(场景：某个状态的值固定)

```javascript
const Status = {
  OFFLINE: 0,
  ONLINE: 1,
  DELETED: 2
};

function getResult(status) {
  if (status === Status.OFFLINE) {
    return 'offline';
  } else if (status === Status.ONLINE) {
    return 'online';
  } else if (status === Status.DELETED) {
    return 'deleted';
  }
  return 'error';
}

const result = getResult(Status.ONLINE);
console.log(result);

```

- 枚举类型

```typescript
// 枚举类型的默认值从0开始，  0，1，2...
enum Status {
  OFFLINE,
  ONLINE,
  DELETED
}

function getResult(status: any) {
  if (status === Status.OFFLINE) {
    return 'offline';
  } else if (status === Status.ONLINE) {
    return 'online';
  } else if (status === Status.DELETED) {
    return 'deleted';
  }
  return 'error';
}

const result = getResult(1);     //	online
console.log(Status.OFFLINE);     // 0
console.log(Status.ONLINE);		 // 1
console.log(Status.DELETED);	 // 2
console.log(Status[0]);	   // OFFLINE     反向映射   
```

```typescript
// 如果中间的某个值被设置了，后续的+1自增
enum Status {
  OFFLINE,
  ONLINE = 4,
  DELETED
}
// 0 4 5
// Status[0]    undefined
```

## 函数泛型

- 场景

```typescript
function join(first: string | number, second: string | number) {
  return `${first}${second}`;
}

join('1', 1);

// 需求如果fisrt是number或者string,second也要一样?
```

- 泛型 generic **泛指的类型**，在使用的时候才会知道具体的类型，可以显式得声明，也可以让typescript进行类型推断

```typescript
// ABC 泛型（任意类型）
function join<ABC>(first: ABC,second: ABC) {
  return `${first}${second}`
}

// 报错：类型“1”的参数不能赋给类型“string”的参数
join("1",1)
join<string>('1',1)
// success
join<string>('1','1')
join<number>(1,1)
```

- 泛型的使用

```typescript
function map<ABC>(params: ABC) {
  return params
}
map<string>('123')     //  123

// T[]  与  Array<T>  等价
function map1<T>(params: T[]) {
  return params
}
map1<string>(['123'])     //  ['123']

function map1<T>(params: Array<T>) {
  return params
}
map2<string>(['123'])     //  ['123']
```

- 多个泛型的定义

```typescript
function join<T, P>(first: T, second: P) {
  return `${first}${second}`
}

join<number, string>(1,'1')
// 如果没有写类型，typescript会类型推断
join(1,'1')
```

## 类中的泛型以及泛型类型、

### 类中的泛型

```typescript
class DataManager {
	// 可以传string或者number类型的数组...
	constructor (private data: string [] | number[]) {}
	getItem(index: number): string|number {
		return this.data[index]
	}
}

const data = new DataManager(['1']);
data.getItem(0)           //   '1'
```

为了能传入各种类型的参数，并且返回和传入相应的类型，减少代码量

```typescript
class DataManager<T> {
	constructor (private data: T[]) {}
	getItem(index: number): T {
		return this.data[index]
	}
}

// const data = new DataManager(['1']);    类型推断
const data = new DanaManager<number>([1]);
data.getItem(0)           //   '1'
```

- 泛型类型约束（extends）

如果要求this.data[index].name有值,传入T类型一定要包含name属性，此时返回值是string

```typescript
interface Item {
	name: string;
}

class DataManager<T extends Item> {
	constructor (private data: T[]) {}
	getItem(index: number): string {
		return this.data[index].name;
	}
}

const data = new DanaManager([
	{
		name: 'caffrey'
	}
]);


//  interface Test {
//  	name: string
//  }
//  const data = new DanaManager<Test>([{name: 'caffrey'}]);
```

- 类接收的泛型的具体类型只能是number和string

```typescript
class DataManager<T extends number | string> {
	constructor (private data: T[]) {}
	getItem(index: number): T {
		return this.data[index]
	}
}

const data = new DataManager<string>([1])

```

### 泛型声明类型

```typescript
// 如何使用泛型作为一个具体的类型注解
function hello<T>(params: T) {
    return params;
}

//  const func: (T)=>string = <T>() => {
//  	return '123'
//  }
const func: <T>(patams: T) => T = hello;
```

## 命名空间

```shell
npm init -y
tsc -init
```

tsconfig.json

```json
"outDir": "./dist",
"rootDir": "./src"
```

index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="./page.js"></script>
  </head>
  <body>
    <script>
      new Page();
    </script>
  </body>
</html>
```

page.ts

```typescript
class Header {
  constructor() {
    const elem = document.createElement('div');
    elem.innerText = 'this is header';
    document.body.appendChild(elem);
  }
}

class Content {
  constructor() {
    const elem = document.createElement('div');
    elem.innerText = 'this is content';
    document.body.appendChild(elem);
  }
}

class Footer {
  constructor() {
    const elem = document.createElement('div');
    elem.innerText = 'this is footer';
    document.body.appendChild(elem);
  }
}

class Page {
  constructor() {
    new Header();
    new Content();
    new Footer();
  }
}
```

运行 tsc -w (自动检测变化编译)

```shell
|-- namespace
|   |-- dist
|   |   |-- page.js
|   |   |-- index.html
|   |-- src
|   |   |-- page.ts
|   |-- package.json
|   |-- tsconfig.json
```

问题：编译后的page.js文件暴露了很多的全局变量（控制台能够拿到Header、Content、Footer、Page）,而实际上需要保留的只有Page这个全局变量，需要在typescript中融入一些**模块化**的思想。

### namespace

```typescript
namespace Home {
  class Header {
    constructor() {
      const elem = document.createElement('div');
      elem.innerText = 'this is header';
      document.body.appendChild(elem);
    }
  }

  class Content {
    constructor() {
      const elem = document.createElement('div');
      elem.innerText = 'this is content';
      document.body.appendChild(elem);
    }
  }

  class Footer {
    constructor() {
      const elem = document.createElement('div');
      elem.innerText = 'this is footer';
      document.body.appendChild(elem);
    }
  }
  // 如果没有export,此时在控制台只能拿到一个空对象Home,export编译后（Home.Page = Page）
  // new Home.page()
  export class Page {
    constructor() {
      new Header();
      new Content();
      new Footer();
    }
  }
}
```

全局变量只有一个Home,而且Home只暴露了一个Page方法（export）
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


---
nav:
  path: /hooks
---

# useTimeout

一个可以生产 setTimeout 执行器函数的 Hook。

## 代码演示

### 基础用法

<code src="./demo/demo1.tsx" />
<code src="./demo/demo2.tsx" />

## API

```typescript
useCreateTimeout(
  fn: (...args: any) => void,
  delay?: number | null,
  options?: {
    autoClear?: boolean| null
  } | null
): {
  run: (...args: any) => void;
  memoRun: (...args: any) => void;
  clear: () => void;
};
```

### Params

| 参数              | 说明                                                                      | 类型                    |
| ----------------- | ------------------------------------------------------------------------- | ----------------------- |
| fn                | 待执行函数                                                                | `() => void`            |
| delay             | 定时时间（单位为毫秒），支持动态变化，当取值为 `undefined` 时会停止计时器 | `number` \| `undefined` |
| options.autoClear | 执行器运行时是否自动清理上一次的定时器（默认为 true ）                    | `boolean`               |

### Result

| 参数    | 说明                   | 类型                     |
| ------- | ---------------------- | ------------------------ |
| run     | 定时器执行函数         | `(...args: any) => void` |
| memoRun | 受记忆的定时器执行函数 | `(...args: any) => void` |
| clear   | 清除定时器             | `() => void`             |

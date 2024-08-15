import { renderHook } from '@testing-library/react';

import useCreateTimeout, { UseCreateTimeoutOptions } from '../index';

interface ParamsObj {
  fn: (...arg: any) => any;
  delay?: number;
  options?: UseCreateTimeoutOptions;
}

const setUp = (props: ParamsObj) =>
  renderHook<ReturnType<typeof useCreateTimeout>, ParamsObj>(
    ({ fn, delay, options }) => useCreateTimeout(fn, delay, options),
    { initialProps: props },
  );

describe('useCreateTimeout', () => {
  jest.useFakeTimers();
  jest.spyOn(global, 'clearTimeout');

  it('timeout should work(basic demo).', () => {
    const callback = jest.fn();
    const hooks = setUp({ fn: callback, delay: 20 });

    hooks.result.current.run();
    expect(callback).not.toBeCalled();
    jest.advanceTimersByTime(30);
    expect(callback).toHaveBeenCalledTimes(1);

    hooks.result.current.run();
    jest.advanceTimersByTime(10);
    expect(callback).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(20);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('timeout should work when delay time was changed.', () => {
    const callback = jest.fn();
    const hooks = setUp({ fn: callback, delay: 20 });

    hooks.result.current.run();
    expect(callback).not.toBeCalled();
    jest.advanceTimersByTime(30);
    expect(callback).toHaveBeenCalledTimes(1);

    hooks.rerender({ fn: callback, delay: 50 });
    expect(clearTimeout).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(70);
    expect(callback).toHaveBeenCalledTimes(1);

    hooks.result.current.run();
    expect(clearTimeout).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(10);
    expect(callback).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(30);
    expect(callback).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(30);
    expect(callback).toHaveBeenCalledTimes(2);

    hooks.result.current.run();
    jest.advanceTimersByTime(30);
    expect(callback).toHaveBeenCalledTimes(2);
    jest.advanceTimersByTime(30);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('timeout should work when option of autoClear was closed.', () => {
    const callback = jest.fn();
    const hooks = setUp({ fn: callback, delay: 20 });

    hooks.result.current.run();
    hooks.rerender({ fn: callback, delay: 20, options: { autoClear: false } });
    hooks.result.current.run();
    expect(callback).not.toBeCalled();
    expect(clearTimeout).toHaveBeenCalledTimes(0);
    jest.advanceTimersByTime(10);
    hooks.result.current.run();
    expect(callback).not.toBeCalled();
    jest.advanceTimersByTime(15);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(clearTimeout).toHaveBeenCalledTimes(0);
    jest.advanceTimersByTime(10);
    expect(callback).toHaveBeenCalledTimes(3);
    expect(clearTimeout).toHaveBeenCalledTimes(0);
  });

  it('timeout should stop', () => {
    const callback = jest.fn();
    const hooksA = setUp({ fn: callback, delay: undefined });
    const hooksB = setUp({ fn: callback, delay: -2 });

    hooksA.result.current.run();
    jest.advanceTimersByTime(50);
    expect(callback).toHaveBeenCalledTimes(0);

    hooksB.result.current.run();
    jest.advanceTimersByTime(50);
    expect(callback).toHaveBeenCalledTimes(0);
  });

  it('timeout should be clear', () => {
    const callback = jest.fn();
    const hook = setUp({ fn: callback, delay: 20 });

    hook.result.current.run();
    expect(callback).not.toBeCalled();
    hook.result.current.clear();
    jest.advanceTimersByTime(30);
    expect(callback).toHaveBeenCalledTimes(0);
    expect(clearTimeout).toHaveBeenCalledTimes(1);
  });
});

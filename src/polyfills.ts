// Core-js polyfills
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// DOM polyfills
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function (callback) {
    return setTimeout(callback, 1000 / 60);
  };
}

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = function (id) {
    clearTimeout(id);
  };
}

// Custom event polyfill for IE
(function () {
  if (typeof window.CustomEvent === 'function') return false;

  function CustomEvent(event: string, params: any) {
    params = params || { bubbles: false, cancelable: false, detail: null };
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  window.CustomEvent = CustomEvent as any;
})();

// Object.fromEntries polyfill
if (!Object.fromEntries) {
  Object.fromEntries = function (entries: Iterable<[string, any]>) {
    if (!entries || !entries[Symbol.iterator]) {
      throw new Error('Object.fromEntries requires a single iterable argument');
    }
    const obj: Record<string, any> = {};
    for (const [key, value] of entries) {
      obj[key] = value;
    }
    return obj;
  };
}

// Array.flat polyfill
if (!Array.prototype.flat) {
  Object.defineProperty(Array.prototype, 'flat', {
    configurable: true,
    writable: true,
    value: function flat(this: any[], depth = 1): any[] {
      const flatDeep = (arr: any[], d: number): any[] => {
        return d > 0
          ? arr.reduce(
              (acc: any[], val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val),
              []
            )
          : arr.slice();
      };
      return flatDeep(this, depth);
    },
  });
}

// String.prototype.replaceAll polyfill
interface String {
  replaceAll(searchValue: string | RegExp, replaceValue: string): string;
}

if (!String.prototype.replaceAll) {
  Object.defineProperty(String.prototype, 'replaceAll', {
    configurable: true,
    writable: true,
    value: function (this: string, searchValue: string | RegExp, replaceValue: string): string {
      if (Object.prototype.toString.call(searchValue) === '[object RegExp]') {
        return this.replace(searchValue, replaceValue);
      }
      return this.replace(
        new RegExp(String(searchValue).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        replaceValue
      );
    },
  });
}

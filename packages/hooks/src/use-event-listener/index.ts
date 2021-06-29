import { useEffect, MutableRefObject, useRef } from 'react';

export type BasicTarget<T = HTMLElement> =
    | (() => T | null)
    | T
    | null
    | MutableRefObject<T | null | undefined>;

interface AddEventListenerOptions extends EventListenerOptions {
    once?: boolean;
    passive?: boolean;
}

type TargetMapper = Window | Element | HTMLElement | Document;

export type EventTarget = BasicTarget<TargetMapper>

export type EventMaper = DocumentEventMap | HTMLElementEventMap | ElementEventMap | WindowEventMap;

type Options<T extends EventTarget = EventTarget > = {
    target?: T;
} & AddEventListenerOptions;

const getDom = (target, defaultTarget) => {

    let targetDom = defaultTarget;

    if (!target || !target?.current) { return targetDom; }

    if (typeof target === 'function') {
        targetDom =  target();
    } else if (target.hasOwnProperty('current')) {
        targetDom = target.current;
    } else {
        targetDom = target;
    }
}

function useEventListener<K extends keyof EventMaper>(eventType: K, handler: (e: (keyof EventMaper)[K]) => void, options?: Options<TargetMapper>): void;

function useEventListener(eventType: string, handler: EventHandlerNonNull, options: Options): void;

function useEventListener(eventType: string, handler: Function, options: Options = {}) {

    const hookRef = useRef<{
        handler: null | Function;
        options: Options;
    }>({
        handler: null,
        options: {}
    });
    hookRef.current.handler = handler;
    hookRef.current.options = options

    useEffect(() => {

        const element = getDom(options?.target, window);

        if (!element.addEventListener) {
            return;
        }

        const eventListener = (event: Event) => {
            return  hookRef.current.handler?.(event);
        };

        const { once, passive, capture } = hookRef.current.options;

        window.addEventListener(eventType, eventListener, {
            once,
            passive,
            capture
        })


        return (): void => {
            window.removeEventListener(eventType, eventListener, { capture });
        }
    }, [])
}

export default useEventListener

// 测绘
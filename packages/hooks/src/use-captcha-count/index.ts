import { useCallback, useRef, useState, useEffect } from 'react';
import { useImmer } from 'use-immer';
import kindOf from 'kind-of';

type ArgsProps = {
    /** 计时阈值 */
    delay?: number;
    /** handler, shopuld be a promise */
    handler: Promise<any>;
}

type CaptchaState = {
    /** 计时时间 */
    delay?: number;
    /** 按钮是否可以点击 */
    canClick: boolean;
    /** loading */
    loading: boolean;
}


type ReturnsProps = {
    captchaState: CaptchaState;
    countDown: () => void;
}

function useCaptchaCount(props: ArgsProps): ReturnsProps;

function useCaptchaCount({ delay = 60, handler }: ArgsProps): ReturnsProps {

    const timeRef = useRef(null);
    const [captchaState, updateState] = useImmer({
        delay,
        canClick: true,
        loading: false
    });

    const countDown = useCallback(() => {
        if (kindOf(handler) === 'promise') {
            updateState(draft => {
                draft.loading = true;
            })
            handler.then(() => {
                // @ts-ignore
                timeRef.current = setTimeout(() => {
                    updateState(draft => {
                        if(draft.delay < 1) {
                            draft.delay = delay
                            draft.canClick = true;
                            return;
                        }

                        // 计数期间不可点击
                        if(draft.canClick) {
                            draft.canClick = false;
                        }

                        draft.delay -= 1;

                        countDown();
                    })
                }, 1000);
            })
                .finally(() => {
                    updateState(draft => {
                        draft.loading = false;
                    })
                });
        } else {
            throw new Error(`
                useCaptchaCount Error: 
                    handler should be a promise (include fetch data with xhr or fetch)
            `)
        }
    }, []);

    useEffect(() => () => {
        // clear timeRef
        timeRef.current = null;
    }, [])

    return {
        captchaState,
        countDown
    }
}

export default useCaptchaCount;
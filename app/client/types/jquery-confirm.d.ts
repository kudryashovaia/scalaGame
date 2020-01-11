interface JQueryConfirmOptions {
    title?: string | (() => string),
    titleClass?: string,
    type?: string,
    typeAnimated?: boolean,
    draggable?: boolean,
    alignMiddle?: boolean,
    content?: string | (() => string),
    contentLoaded?: any,
    buttons?: any,
    icon?: string,
    lazyOpen?: boolean,
    bgOpacity?: number,
    theme?: string,
    animation?: string,
    closeAnimation?: string,
    animationSpeed?: number,
    animationBounce?: number,
    escapeKey?: boolean | string,
    rtl?: boolean,
    container?: string,
    containerFluid?: boolean,
    backgroundDismiss?: boolean | string | (() => void),
    backgroundDismissAnimation?: string,
    autoClose?: string,
    closeIcon?: boolean | null,
    closeIconClass?: string,
    watchInterval?: number,
    columnClass?: string,
    useBootstrap?: boolean,
    boxWidth?: string,
    scrollToPreviousElement?: boolean,
    scrollToPreviousElementAnimate?: boolean,
    offsetTop?: number,
    offsetBottom?: number,
    dragWindowGap?: number,
    bootstrapClasses?: any,
    onContentReady?: () => void,
    onOpenBefore?: () => void,
    onOpen?: () => void,
    onClose?: () => void,
    onDestroy?: () => void,
    onAction?: (string) => void
}
interface JQueryStatic {
    alert(options: JQueryConfirmOptions): void;
    confirm(options: JQueryConfirmOptions): void;
    dialog(options: JQueryConfirmOptions): void;
}
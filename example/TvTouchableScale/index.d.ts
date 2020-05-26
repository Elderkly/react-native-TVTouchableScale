import {Component} from 'react'

interface TVTouchableScaleProps {
    style?: object,                     //  样式
    scale?: number,                     //  放大比例
    focusStyle: object,                 //  聚焦样式
    getRef?: () => any,                 //  返回ref
    onPress?: () => void,               //  点击事件
    onFocus?: () => void,               //  聚焦事件
    onBlur?: () => void,                //  失焦事件
    autoFocus?: boolean,                //  是否自动聚焦
    prohibitDisabled?: string[],        //  禁用特定方向聚焦
    prohibitTarget?: object[],          //  指定特定方向聚焦到特定dom
    hideDisabledAnimation?: boolean,    //  去除抖动动画
    eventHandler?: () => string,        //  监听遥控器事件
    eventDisabled?: () => [],           //  监听触发禁用方向事件
    // disabled?: boolean,                 //  是否禁用元素
    // prominentDom?: any                  //  指定高亮dom
}
export default class TVTouchableScale extends Component<TVTouchableScaleProps> {
    static defaultProps: {
        style: {}
    }
    constructor(props: TVTouchableScaleProps);
    _onFocus(): void;
    _onBlur(): void;
    _onPress(): void;
    prohibitTarget(c: any): void;
    prohibitDisabled(c: any): void;
    getProhibitArray(c: any): object;
    initListen(c: any): void;
    initProhibit(c: any): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    shouldComponentUpdate(nextProps: any, nextState: any, nextContext: any): boolean;
}

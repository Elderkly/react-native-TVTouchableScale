import React, {createRef, Component} from 'react'
import {
    Animated,
    TouchableOpacity,
    findNodeHandle,
    TVEventHandler,
} from 'react-native';

export default class TVTouchableScale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //  是否聚焦
            focus: false,
            //  禁用动画
            TranslateX: new Animated.Value(0),
            //  放大动画
            Scale: new Animated.Value(1),
        };
        //  ref
        this.dom = createRef();
        //  监听
        this.listenEvent = null;
        //  触发禁用方向次数
        this.disabledNum = [null,0]
    }

    //  初始化方向事件
    initProhibit() {
        if (this.dom) {
            this.prohibitDisabled(this.props)
            this.prohibitTarget(this.props);
        }
    }

    initListen(props) {
        //  监听按钮方向是否与禁用方向一致
        this.listenEvent = new TVEventHandler();
        this.listenEvent.enable(
            this, (cmp, evt) =>  {
                const {eventType, eventKeyAction} = evt
                //  只有按键按下触发 防止重复执行
                if (eventKeyAction !== 0) return
                if (evt) {
                    const event = eventType
                    console.log(eventType,this.props.prohibitDisabled)
                    props.eventHandler && props.eventHandler(event)
                    if (props.prohibitDisabled && props.prohibitDisabled.indexOf(event) !== -1 && this.state.focus) {
                        if (event === this.disabledNum[0]) {
                            this.disabledNum = [event, this.disabledNum[1] + 1]
                        } else {
                            this.disabledNum = [event, 1]
                        }
                        props.eventDisabled && props.eventDisabled(this.disabledNum)
                        if (props.hideDisabledAnimation) return
                        const value = 2;
                        //  执行弹簧动画
                        Animated.stagger(100, [
                            Animated.spring(this.state.TranslateX, {
                                toValue: value,
                                bounciness: 30,
                                speed: 80,
                                useNativeDriver: true,
                            }),
                            Animated.spring(this.state.TranslateX, {
                                toValue: 0,
                                bounciness: 25,
                                speed: 80,
                                useNativeDriver: true,
                            }),
                        ]).start();
                    } else {
                        this.disabledNum = [event, 1]
                    }
                }
            }
        );
    }

    //  根据props的禁用聚焦方向及指定聚焦元素 生成新的prohibitEvent
    getProhibitArray(props) {
        if (!props.prohibitDisabled &&
            !props.prohibitTarget) {
            return {};
        }
        try{
            //  生成将用于禁用方向焦点的对象
            const prohibitEvent = {};
            //  各个方向对应的事件名称
            const events = [
                {direction: 'left', event: 'nextFocusLeft'},
                {direction: 'right', event: 'nextFocusRight'},
                {direction: 'up', event: 'nextFocusUp'},
                {direction: 'down', event: 'nextFocusDown'}
            ]
            //  自身ID
            const ID = findNodeHandle(this.dom);
            while(events.length > 0) {
                const event = events.pop()
                //  禁用方向
                const Disabled = props.prohibitDisabled ? props.prohibitDisabled.indexOf(event.direction) : -1
                //  指定聚焦元素
                const Target = props.prohibitTarget ? props.prohibitTarget.findIndex(e => !!e[event.direction]) : -1
                //  如果指定了当前遍历方向的操作则插入相应的数组 否则就把这个方向的操作置为默认状态
                if (Disabled !== -1 || Target !== -1) {
                    //  如果禁用了方向则指定聚焦对象到 自身
                    if (Disabled !== -1) {
                        prohibitEvent[[event.event]] = ID
                    }
                    //  如果指定了聚焦元素则将方向指定到 指定元素
                    if (Target !== -1) {
                        prohibitEvent[[event.event]] = props.prohibitTarget[Target][event.direction]
                    }
                } else {
                    //  指定默认行为
                    prohibitEvent[[event.event]] = -1
                }
            }
            return prohibitEvent
        } catch (e) {
            console.log('getProhibitArray Error',e)
            return {}
        }
    }
    //  禁用方向焦点
    prohibitDisabled(props) {
        if (props.prohibitDisabled) {
            const prohibitEvent = this.getProhibitArray(props)
            //  禁用
            this.dom.setNativeProps(
                prohibitEvent,
            );

            // this.initListen(props)
        }
    }
    //  指定聚焦元素
    prohibitTarget(props) {
        const prohibitEvent = this.getProhibitArray(props)
        this.dom.setNativeProps(
            prohibitEvent,
        );
    }
    //  聚焦
    _onFocus = () => {
        this.setState({focus: true})
        Animated.spring(
            this.state.Scale,
            {
                toValue: this.props.scale ? this.props.scale : 1.1,
                bounciness: 10,
                speed: 8,
                useNativeDriver: true,
            },
        ).start();

        this.initListen(this.props)

        this.props.onFocus && this.props.onFocus();
    }
    //  失焦
    _onBlur = () => {
        this.setState({focus: false})
        Animated.timing(
            this.state.Scale,
            {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            },
        ).start();
        this.disabledNum = [null,0]
        // this.listenEvent && this.listenEvent.remove();
        this.props.onBlur && this.props.onBlur();

        if (this.listenEvent != null) {
            this.listenEvent.disable();
        }
    }
    //  点击
    _onPress = e => {
        const {onPress} = this.props;
        const {eventKeyAction} = e;
        //  修复onPress 触发两次的BUG
        if (onPress && eventKeyAction === 0) {
            onPress(e);
        }
    };

    componentDidMount(): void {
        this.initProhibit();
        this.props.getRef && this.props.getRef(this.dom);
    }

    componentWillUnmount(): void {
        // this.listenEvent && this.listenEvent.remove();
        if (this.listenEvent != null) {
            this.listenEvent.disable();
        }
    }

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        //  锁定聚焦方向变化
        if (JSON.stringify(nextProps.prohibitDisabled) !== JSON.stringify(this.props.prohibitDisabled)) {
            this.prohibitDisabled(nextProps)
        }
        //  指定聚焦元素变化
        if (JSON.stringify(nextProps.prohibitTarget) !== JSON.stringify(this.props.prohibitTarget)) {
            this.prohibitTarget(nextProps);
        }
        return true
    }

    // componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    //     console.log('刷新',new Date().getTime())
    // }

    render() {
        return (
            <TouchableOpacity
                activeOpacity={1}
                onBlur={this._onBlur}
                onFocus={this._onFocus}
                onPress={this._onPress}
                ref={refs => this.dom = refs}
                accessibilityStates={!!this.props.disabled ? ['disabled'] : ['selected']}
                hasTVPreferredFocus={!!this.props.autoFocus}
                style={[this.props.style, {transform: [{scale: this.state.Scale}, {translateX: this.state.TranslateX}]}, this.props.focusStyle && this.state.focus ? this.props.focusStyle : {}]}
            >
                {/*{this.props.scaleDom ? Platform.Version >= 21 ? <CardView*/}
                {/*    cardElevation={this.state.focus ? 10 : 0}*/}
                {/*    cardMaxElevation={this.state.focus ? 10 : 0}*/}
                {/*    cornerRadius={0}*/}
                {/*    style={[{backgroundColor:'rgba(0,0,0,0)',position:'relative',zIndex:10}]}*/}
                {/*>*/}
                {/*    <View style={{padding:3,borderWidth:1,borderColor:this.state.focus ? '#fff' : 'rgba(0,0,0,0)'}}>{this.props.scaleDom}</View>*/}
                {/*</CardView> : <View style={{padding:3,borderWidth:1,borderColor:this.state.focus ? '#fff' : 'rgba(0,0,0,0)'}}>{this.props.scaleDom}</View> : null*/}
                {/*}*/}
                {this.props.children}
            </TouchableOpacity>
        );
    }
}

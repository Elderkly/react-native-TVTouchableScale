# TVTouchableScale
一款纯JS开发的react-native TV端触控组件     

<div align=center><img src="https://github.com/Elderkly/ImgRepository/blob/master/react-native-TVTouchableScale/QQ20200526-153414-HD.gif?raw=true"/></div>      

##  如何安装
```
yarn add react-native-tvtouchablescale
```
or   
```
npm i --save react-native-tvtouchablescale
```

##  如何使用
```javascript
import TVTouchableScale from 'react-native-tvtouchablescale'

export default function(props) {
    return (
        <TVTouchableScale
            autoFocus={true}
            style={{width:50,height:50,backgroundColor:'red'}}
        >
            <Text>Hello World!</Text>
        </TVTouchableScale>
    )
}
```    

[示例](https://github.com/Elderkly/react-native-TVTouchableScale/tree/master/example)   

## API
|Prop|Type|Description|Default|
|:---|:---|:---|:---|
|style|Object|样式|true||
|scale|Number|放大比例|1.1|
|focusStyle|Object|聚焦时的样式||
|getRef|Function|用于获取Dom的ref||
|onPress|Function|点击事件||
|onFocus|Function|聚焦事件||
|onBlur|Function|失焦事件||
|autoFocus|Boolean|是否自动聚焦|false|
|prohibitDisabled|Array|禁用特定的聚焦方向||
|prohibitTarget|Array|指定特定方向聚焦的Dom||
|hideDisabledAnimation|Boolean|是否去除抖动动画||
|eventHandler|Function|监听遥控器事件||
|eventDisabled|Function|监听触发禁用方向事件||    

## LICENSE

react-native-tvtouchablescale is open source software licensed as
[MIT.](https://github.com/Elderkly/react-native-tvtouchablescale/blob/master/LICENSE)

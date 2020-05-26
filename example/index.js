import React, {Component} from 'react'
import {
    View,
    Text,
    findNodeHandle
} from 'react-native'
import TVTouchableScale from './TvTouchableScale'

export default class DEMO extends Component {
    constructor(props) {
        super(props)
        this.state = {
            itemId: []
        }
    }

    render() {
        return (
            <View style={{backgroundColor:'#222a52',flex:1,alignItems:'center',justifyContent:'center'}}>
                <View style={{width:500,flexDirection:'row',flexWrap:'wrap'}}>
                    {
                        [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map((e,index) => (
                            <TVTouchableScale
                                key={index}
                                autoFocus={index === 0}
                                focusStyle={index === 5 ? {backgroundColor: 'red'} : {backgroundColor: '#000'}}
                                getRef={refs => {
                                    const {itemId} = this.state
                                    itemId[index] = findNodeHandle(refs)
                                    this.setState({itemId})
                                }}
                                prohibitTarget={
                                    index === 1 ? [{'down': this.state.itemId[11]}]
                                        : index === 11 ? [{'up': this.state.itemId[0]}]
                                            : index === 13 ? [{'left': this.state.itemId[6]}]
                                                : index === 6 ? [{'right': this.state.itemId[8]}]
                                                    : index === 8 ? [{'left': this.state.itemId[10]}] : []
                                }
                                prohibitDisabled={index === 3 || index === 9 || index === 14 ? ['right'] : index === 4 ? ['up','right'] : index === 12 ? ['left','right','down'] : []}
                                hideDisabledAnimation={index === 9}
                                onFocus={index === 7 ? () => alert('Focus Item8') : null}
                                onPress={() => alert('press' + e)}
                                eventDisabled={index === 12 ? (e) => alert(e) : null}
                                style={{width:80,height:80,margin:5,backgroundColor: ['#3A55FD','#6B60FF','#bb59ff'][index % 3],alignItems:'center',justifyContent:'center'}}
                            >
                                <Text style={{color:'#fff'}}>item {e}</Text>
                                {
                                    index === 0 && <Text style={{color:'#fff',fontSize: 10}}>autoFoucs</Text>
                                }
                                {
                                    index === 1 && <Text style={{color:'#fff',fontSize: 10}}>Down to item12</Text>
                                }
                                {
                                    index === 3 && <Text style={{color:'#fff',fontSize: 10}}>Disabled right</Text>
                                }
                                {
                                    index === 4 && <Text style={{color:'#fff',fontSize: 10}}>Disabled right</Text>
                                }
                                {
                                    index === 4 && <Text style={{color:'#fff',fontSize: 10}}>Disabled up</Text>
                                }
                                {
                                    index === 5 && <Text style={{color:'#fff',fontSize: 10}}>Div focusStyle</Text>
                                }
                                {
                                    index === 6 && <Text style={{color:'#fff',fontSize: 10}}>Right to item9</Text>
                                }
                                {
                                    index === 7 && <Text style={{color:'#fff',fontSize: 10}}>Event Focus</Text>
                                }
                                {
                                    index === 8 && <Text style={{color:'#fff',fontSize: 10}}>Left to Item11</Text>
                                }
                                {
                                    index === 9 && <Text style={{color:'#fff',fontSize: 10}}>Disabled right</Text>
                                }
                                {
                                    index === 9 && <Text style={{color:'#fff',fontSize: 6}}>hideDisabledAnimation</Text>
                                }
                                {
                                    index === 11 && <Text style={{color:'#fff',fontSize: 10}}>Up to item1</Text>
                                }
                                {
                                    index === 12 && <Text style={{color:'#fff',fontSize: 10}}>eventDisabled</Text>
                                }
                                {
                                    index === 13 && <Text style={{color:'#fff',fontSize: 10}}>Left to item7</Text>
                                }
                                {
                                    index === 14 && <Text style={{color:'#fff',fontSize: 10}}>Disabled right</Text>
                                }
                            </TVTouchableScale>
                        ))
                    }
                </View>
            </View>
        )
    }
}

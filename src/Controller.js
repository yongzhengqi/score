import React, {Component, PureComponent} from 'react';
import {connect} from 'react-redux';
import {toggle_switch,do_load} from './actions';

import './Controller.css';

const REFRESH_TIME=300;

class AutoRefreshController extends Component {
    constructor(props) {
        super(props);
        this.state={
            time_left: null,
        };
        this.interval=null;
        this.toggle_bound=this.toggle.bind(this);
    }

    toggle() {
        this.setState((prevState)=>{
            if(prevState.time_left===null) {
                this.interval=setInterval(this.tick.bind(this),1000);
                return {
                    time_left: REFRESH_TIME,
                };
            } else {
                if(this.interval) {
                    clearInterval(this.interval);
                    this.interval=null;
                }
                return {
                    time_left: null,
                };
            }
        });
    }

    tick() {
        this.setState((prevState)=>{
            let t=prevState.time_left;
            if(t!==null) {
                if(t===0) {
                    t=REFRESH_TIME;
                    this.props.fire();
                }
                return {
                    time_left: t-1,
                };
            } else
                return prevState;
        });
    }

    render() {
        if(this.state.time_left===null)
            return (<a onClick={this.toggle_bound}><span className="icon icon-refresh" /> 自动刷新</a>);
        else
            return (<a onClick={this.toggle_bound}><span className="icon icon-refresh" /> {this.state.time_left}s后刷新</a>);
    }
}

function Controller(props) {
    return (
        <p className="controller-bar print-hide">
            <AutoRefreshController fire={props.do_refresh} />
            &nbsp; &nbsp;
            <a onClick={()=>props.do_switch('hide_text')}>
                {props.display_switch.hide_text ?
                    <span><span className="icon icon-show" /> 显示文字</span> :
                    <span><span className="icon icon-hide" /> 隐藏文字</span>
                }
            </a>
            &nbsp; &nbsp;
            <a onClick={()=>props.do_switch('judge_by_gpa')}>
                {props.display_switch.judge_by_gpa ?
                    <span title="当前四分制着色，GPA从1至4由红变绿"><span className="icon icon-display"/> 百分制着色</span> :
                    <span title="当前百分制着色，分数从60至100由红变绿"><span className="icon icon-display"/> 四分制着色</span>
                }
            </a>
        </p>
    );
}

let state_to_props=(state)=>({
    display_switch: state.display_switch,
});
let dispatch_to_props=(dispatch)=>({
    do_switch: (name)=>dispatch(toggle_switch(name)),
    do_refresh: ()=>dispatch(do_load(true)),
});

export default connect(state_to_props,dispatch_to_props)(Controller);
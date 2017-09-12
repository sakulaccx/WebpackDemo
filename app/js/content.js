import React, {Component} from 'react';
import config from '../json/config.json';

class Content extends Component{
	render() {
		return (
			<div className={this.props.class}>
				{config.title}
				<div>{config.welcome}</div>
			</div>

		);
	}
};

/*const Content = React.createClass({
	getInitialState: function(){
		return {
			class: this.props.class
		}
	},
	render: function(){
		return (
			<div className={this.state.class}>
				{config.title}
				<div>{config.welcome}</div>
			</div>
		)
	}
});*/

export default Content
//module.exports = Content;
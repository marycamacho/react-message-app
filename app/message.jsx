var React = require('react');

var Message = React.createClass({
    render: function(){
        return <p>{this.props.text}</p>
    }
});

module.exports = Message;
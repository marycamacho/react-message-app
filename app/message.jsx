var React = require('react');

var Message = React.createClass({
    render: function(){
        return <p>{this.props.message.message} ({this.props.message.username})</p>
    }
});

module.exports = Message;
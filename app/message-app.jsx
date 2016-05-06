var React = require("react");
var Message = require("./message.jsx");
var MessageForm = require("./message-form.jsx");

var MessageApp = React.createClass({

    render: function(){
        var messages = this.state.messages;
        var messageHTML = [];
        for(var i = 0; i < messages.length; i++){
            messageHTML.push(<Message key={i} text={messages[i]} />);
        }
        return(<div>
            {messageHTML}
            <MessageForm  getMessages={this.getMessages} />            
        </div>);
    },

    getInitialState: function () {
        return {
            messages: []
        };
    },
    componentDidMount: function(){
        this.getMessages();
    },

    getMessages: function() {
    var that = this;
    $.get('/messages', function (result) {
        that.setState({
            messages: result
        });
    }, 'json')
}



});

module.exports = MessageApp;
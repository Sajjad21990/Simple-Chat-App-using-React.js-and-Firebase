import React from "react";
import TextField from "@material-ui/core/TextField";
import Send from "@material-ui/icons/Send";
import styles from "./styles";
import { withStyles } from "@material-ui/core/styles";

class ChatTextBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatText: ""
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.chatTextBoxContainer}>
        <TextField
          placeholder="Type Your Message..."
          onKeyUp={e => this.userTyping(e)}
          id="chattextbox"
          className={classes.chatTextBox}
          onFocus={this.userClickedInput}
        ></TextField>
        <Send onClick={this.submitMessage} className={classes.sendBtn}></Send>
      </div>
    );
  }

  userTyping = e => {
    e.keyCode === 13
      ? this.submitMessage()
      : this.setState({ chatText: e.target.value });
  };

  messageValid = txt => txt && txt.replace(/\s/g, "").length;

  userClickedInput = () => this.props.messageReadfn();

  submitMessage = () => {
    if (this.messageValid(this.state.chatText)) {
      this.props.submitfn(this.state.chatText);
      document.getElementById("chattextbox").value = "";
      console.log("submitted");
    }
  };
}

export default withStyles(styles)(ChatTextBox);

import React from "react";
import NewChatComponent from "../NewChat/NewChat";
import ChatListComponent from "../chatlist/ChatList";
import ChatView from "../chatview/ChatView";
import ChatTextBox from "../chattextbox/ChatTextBox";
import styles from "./styles";
import { Button, withStyles } from "@material-ui/core";

const firebase = require("firebase");

class DashboardComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      selectedChat: null,
      newChatFormVisible: false,
      chats: [],
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <ChatListComponent
          history={this.props.history}
          userEmail={this.state.email}
          chats={this.state.chats}
          newChatBtnFn={this.newChatBtnClicked}
          selectChatfn={this.selectChat}
          selectedChatIndex={this.state.selectedChat}
        ></ChatListComponent>
        {this.state.newChatFormVisible ? null : (
          <ChatView
            user={this.state.email}
            chat={this.state.chats[this.state.selectedChat]}
          ></ChatView>
        )}
        {this.state.selectedChat !== null && !this.state.newChatFormVisible ? (
          <ChatTextBox
            submitfn={this.submitMessageFunction}
            messageReadfn={this.messageRead}
          ></ChatTextBox>
        ) : null}
        {this.state.newChatFormVisible ? (
          <NewChatComponent
            goToChatFn={this.goToChat}
            newChatSubmitFn={this.newChatSubmit}
          ></NewChatComponent>
        ) : null}
        <Button
          className={classes.signOutBtn}
          variant="contained"
          color="primary"
          onClick={this.signOutBtn}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  goToChat = async (docKey, msg) => {
    const usersInChat = docKey.split(":");
    const chat = this.state.chats.find((_chat) =>
      usersInChat.every((_user) => _chat.users.includes(_user))
    );
    this.setState({ newChatFormVisible: false });
    await this.selectChat(this.state.chats.indexOf(chat));
    this.submitMessageFunction(msg);
  };

  newChatSubmit = async (chatObj) => {
    const docKey = this.buildDocKey(chatObj.sendTo);
    await firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .set({
        receiverHasRead: false,
        users: [
          {
            message: chatObj.message,
            sender: this.state.email,
          },
        ],
      });
    this.setState({ newChatFormVisible: false });
    this.selectChat(this.state.chats.length - 1);
  };

  signOutBtn = () => {
    firebase.auth().signOut();
  };

  newChatBtnClicked = () => {
    this.setState({ newChatFormVisible: true, selectedChat: null });
  };

  selectChat = async (chatIndex) => {
    await this.setState({ selectedChat: chatIndex });
    this.messageRead();
  };

  buildDocKey = (friend) => [this.state.email, friend].sort().join(":");

  submitMessageFunction = (msg) => {
    const docKey = this.buildDocKey(
      this.state.chats[this.state.selectedChat].users.filter(
        (_usr) => _usr !== this.state.email
      )[0]
    );
    firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          sender: this.state.email,
          message: msg,
          timestamp: Date.now(),
        }),
        receiverHasRead: false,
      });
  };

  messageRead = () => {
    const docKey = this.buildDocKey(
      this.state.chats[this.state.selectedChat].users.filter(
        (_usr) => _usr !== this.state.email
      )[0]
    );
    if (this.clickedChatWhereNotSender(this.state.selectedChat)) {
      firebase
        .firestore()
        .collection("chats")
        .doc(docKey)
        .update({ receiverHasRead: true });
    } else {
      console.log("hi");
    }
  };

  clickedChatWhereNotSender = (chatIndex) =>
    this.state.chats[chatIndex].messages[
      this.state.chats[chatIndex].messages.length - 1
    ].sender !== this.state.email;

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(async (_usr) => {
      if (!_usr) {
        this.props.history.push("/");
      } else {
        await firebase
          .firestore()
          .collection("chats")
          .where("users", "array-contains", _usr.email)
          .onSnapshot(async (res) => {
            const chats = res.docs.map((_doc) => _doc.data());
            await this.setState({
              email: _usr.email,
              chats: chats,
            });
          });
      }
    });
  };
}

export default withStyles(styles)(DashboardComponent);

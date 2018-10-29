import React, { Component } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat'
import { Colors, Metrics } from '../../Themes'
import { connect } from 'react-redux'
import  firebase  from  'react-native-firebase'
import Icon from 'react-native-vector-icons/FontAwesome'

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from '../Styles/ChatStyle'

class ChatScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      messages: [],
    }
  }

  componentWillMount() {
    this.setState({
      messages: [],
    })
  }

  componentDidMount() {
    const { navigation } = this.props
    const taskId = navigation.getParam('activeTaskId', 'fallback');
    // See Firestore's "messages" collection 
    this.ref = firebase.firestore().collection(`tasks`).doc(taskId).collection('chat')

    this.unsubscribe  =  this.ref.onSnapshot ( this.onCollectionUpdate ); 
    // onCollectionUpdate registration to update when an event of Ref 
  }

  componentWillUnmount() {
    // this.unsubscribe()
  }

  // onSend(messages = []) {
  //   this.setState(previousState => ({
  //     messages: GiftedChat.append(previousState.messages, messages),
  //   }))
  // }

    /**
   * Sendボタンがタップされたときのイベント
   */
  onSend = (messages = []) => {
    // Firestoreのコレクションに追加
    messages.forEach((message) => {
      this.ref.add(message);
    });

    // onCollectionUpdateが呼ばれるので、ここではstateには渡さない
    //this.setState((previousState) => ({
    //  messages: GiftedChat.append(previousState.messages, messages),
    //}));
  }

  /**
   * Firestoreのコレクションが更新されたときのイベント
   */
  onCollectionUpdate = (querySnapshot) => {
    // docsのdataをmessagesとして取得
    const messages = querySnapshot.docs.map((doc) => {
      return doc.data();
    });

    // messagesをstateに渡す
    this.setState({ messages });
  }

  renderSend(props) {
    return (
        <Send
            {...props}
        >
            <View style={{marginRight: 10, marginBottom: 5, alignItems: 'center', justifyContent: 'center'}}>
                <Icon name="send" color={Colors.primaryColor} size={Metrics.hp('3%')}/>
            </View>
        </Send>
    )
  }

  renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: Colors.white
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: Colors.white
          },
          right: {
            backgroundColor: Colors.primaryColor
          }
        }}
      />
    )
  }


  render () {
    const { user } = this.props
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        showUserAvatar
        user={{
          _id: user.uid,
          avatar: user.photoURL,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }}
        renderBubble={this.renderBubble}
        renderSend={this.renderSend}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.login.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen)

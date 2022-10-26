import React from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

const getBody = require('./webview/dist/index.js')

class AvvyProvider extends React.Component {
  sleep = (time) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, time)
    })
  }

  poseidon = async (inputArr) => {
    let payload = []
    for (let i = 0; i < inputArr.length; i += 1) {
      if (inputArr[i] === undefined) {
        payload.push(undefined)
      } else {
        payload.push(inputArr[i].toString())
      }
    }
    this.webview.injectJavaScript(`
      window.poseidon(${JSON.stringify(payload)})
    `)
    while (true) {
      await this.sleep(100)
      if (this.poseidonResponse) {
        let res = this.poseidonResponse
        this.poseidonResponse = undefined
        return res
      }
    }
  }

  async init() {
    let provider
    if (this.props.poseidon) {
      this.props.poseidon(this.poseidon)
    }
  }

  onMessage = async (event) => {
    const payload = JSON.parse(event.nativeEvent.data)
    switch (payload.method) {
      case "initialized":
        this.init()
        break

      case "debug":
        if (this.props.debug) {
          console.log("DEBUG: " + payload.message)
        }
        break

      case "poseidon":
        this.poseidonResponse = payload.hash
        break

    }
  }

  render() {
    return (
      <>
        <WebView
          ref={(ref) => (this.webview = ref)}
          style={{
            display: 'none',
            flex: 1,
          }}
          onMessage={this.onMessage}
          injectedJavaScript={getBody()}
        />
        {this.props.children}
      </>
    )
  }
}

export default AvvyProvider

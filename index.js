import React from 'react'
import { Alert, View } from 'react-native'
import { WebView } from 'react-native-webview'
import AVVY from '@avvy/client'
import { ethers } from 'ethers'

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

  init() {
    const RPC_URL = this.props.RPC_URL || 'https://api.avax.network/ext/bc/C/rpc'
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
    this.avvy = new AVVY(provider, {
      poseidon: this.poseidon
    })

    if (this.props.ready) {
      this.props.ready(this.avvy)
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
      <View>
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
      </View>
    )
  }
}

export default AvvyProvider

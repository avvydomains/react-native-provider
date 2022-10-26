import { buildPoseidon } from 'circomlibjs/src/poseidon_wasm.js'

let _poseidon

window.sendMessage = (payload) => {
  window.ReactNativeWebView.postMessage(JSON.stringify(payload))
}

buildPoseidon().then(instance => {
  _poseidon = instance
  sendMessage({
    method: 'initialized'
  })
})

window.poseidon = async (payload) => {
  sendMessage({
    method: 'debug',
    message: 'poseidon payload received'
  })
  sendMessage({
    method: 'debug',
    message: 'poseidon payload received : ' + JSON.stringify(payload)
  })
  const arr = await _poseidon(payload)
  const hash = _poseidon.F.toObject(arr)
  sendMessage({
    method: 'poseidon',
    hash: hash.toString()
  })
}

import algosdk from 'algosdk'
const server = 'https://node.testnet.algoexplorerapi.io'
const port = '';
const token = ''
const algod = new algosdk.Algodv2(token, server, port)
export default { algod, algosdk }
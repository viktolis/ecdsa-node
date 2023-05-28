import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex } from 'ethereum-cryptography/utils';

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onPrivateKeyChange(event) {
    const privateKey = event.target.value;

    try{
      setPrivateKey(privateKey);
      const publicKey = secp.secp256k1.getPublicKey(privateKey);
      const address = toHex(publicKey.slice(1).slice(-20))
      setAddress(address)
      const {
        data: {balance},
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } catch (e) {
      setAddress('Address not found')
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private key
        <input placeholder="Enter your private key" value={privateKey} onChange={onPrivateKeyChange}></input>
      </label>

      <label>
        Sender address: {address ? address : 'Address not found'}
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;

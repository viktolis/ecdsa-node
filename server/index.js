const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "7af7dd9ea47f263dba4141c4b4e51c36872f6efa": 100,
  "a748285f74a207508c83819d0cfcdd2dd5681440": 50,
  "23179a8c6c10fc2ea7a1998708cf94641634bc83": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const secp = require("ethereum-cryptography/secp256k1");
  const keccak256 =  require("ethereum-cryptography/keccak");
  const utils = require("ethereum-cryptography/utils");

  const { data, signature, publicKey } = req.body;
  const {sender, recipient, amount} = data

  const hash = keccak256.keccak256(utils.utf8ToBytes(JSON.stringify(data)));
  const isSigned = secp.secp256k1.verify(signature, hash, publicKey);

  if(!isSigned){
    res.status(400).send({ message: 'Data is malformed, you cant transfer requested amount' });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

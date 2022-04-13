var login = document.getElementById("login");
var answer = document.getElementById("answer");
var send = document.getElementById("send");
var responsedata = ''
var isConnected = false;
var onClick = function() {
    (async()=>{
        const api = sig$.composeApi({
            nodeHost: 'https://europe3.testnet.signum.network'
        });

        const wallet = new sig$wallets.GenericExtensionWallet();
        const {publicKey, connectionStatus, nodeHost, accountId} = await wallet.connect({
            appName: "Example App",
            nodeHost: "https://europe3.testnet.signum.network"
        });

        const newDiv = document.createElement("div");
        const newContent = document.createTextNode("You connected successfully");
        newDiv.appendChild(newContent);
        document.body.insertBefore(newDiv, answerAccount);

        const accountIdAnswer = document.createTextNode("Your accountId: " + accountId + "\n");
        const node = document.createTextNode("Your node host: " + nodeHost + "\n");
        answerAccount.appendChild(accountIdAnswer);
        answerNode.appendChild(node);

        const explorer = document.createElement('a');
        const explorerLink = document.createTextNode("Go to explorer \n");
        explorer.appendChild(explorerLink);
        explorer.href = "https://chain.signum.network/address/" + accountId;
        document.body.appendChild(explorer);

        api.account.getAccountBalance(accountId).then(balance=>{
            const balUser = sig$util.Amount.fromPlanck(balance.balanceNQT).toString();
            const balDiv = document.createElement('div');
            const getBal = document.createTextNode("\nAccount Balance: " + balUser);
            balDiv.appendChild(getBal);
            document.body.insertBefore(balDiv, balanceUser);
        }
        )
        const b = document.createElement('button');
        b.innerHTML = "send SIGNA to this aderess";
        var doRequest = function() {
            fetch("https://cryptodefrag.com:2222", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: accountId
            }).then(resp=>resp.text()).then((dataStr)=>{
                responsedata = dataStr
                gobutton.appendChild(document.createElement('br'));
                gobutton.appendChild(document.createTextNode("Response: " + dataStr))
                b.removeEventListener("click", doRequest, false);
            }
            )
        }
        b.addEventListener("click", doRequest, false);
        gobutton.appendChild(b)
    }
    )()
    login.removeEventListener("click", onClick, false);
}
login.addEventListener("click", onClick, false);

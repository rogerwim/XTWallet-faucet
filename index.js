var login = document.getElementById("login");
var answer = document.getElementById("answer");
var send = document.getElementById("send");
var responsedata = ''
var isConnected = false;

function onNetworkChange({networkHost, networkName}) {
    console.log('Network changed', networkName, networkHost)
}

function onAccountChange({accountId, accountPublicKey}) {
    console.log('Account changed', accountId, accountPublicKey)
}

function onPermissionRemoved({origin}) {
    console.log('Permission removed', origin)
}

function onAccountRemoved({accountId}) {
    console.log('Account removed', accountId)
}

let connectionListener = null;

var onClick = function() {
    (async()=>{
        const ledger = sig$.LedgerClientFactory.createClient({
            nodeHost: 'https://europe3.testnet.signum.network'
        });
        const {networkName, addressPrefix, valueSuffix } = await ledger.network.getNetworkInfo()

        const wallet = new sig$wallets.GenericExtensionWallet();
        const connection = await wallet.connect({
            appName: "Example App",
            networkName
        });

        // you can listen to all these events if you want
        connectionListener = connection.listen({
            onNetworkChanged: onNetworkChange,
            onAccountChanged: onAccountChange,
            onPermissionRemoved: onPermissionRemoved,
            onAccountRemoved: onAccountRemoved,
        });

        const {accountId, currentNodeHost} = connection

        const newDiv = document.createElement("div");
        const newContent = document.createTextNode("You connected successfully");
        newDiv.appendChild(newContent);
        document.body.insertBefore(newDiv, answerAccount);

        const accountIdAnswer = document.createTextNode(`Your accountId: ${accountId} - ${sig$.Address.create(accountId, addressPrefix).getReedSolomonAddress()}`);
        const node = document.createTextNode("Your node host: " + currentNodeHost + "\n");
        answerAccount.appendChild(accountIdAnswer);
        answerNode.appendChild(node);

        const explorer = document.createElement('a');
        const explorerLink = document.createTextNode("Go to explorer \n");
        explorer.appendChild(explorerLink);
        explorer.href = "https://chain.signum.network/address/" + accountId;
        document.body.appendChild(explorer);

        ledger.account.getAccountBalance(accountId).then(balance=>{
            const balUser = sig$util.Amount.fromPlanck(balance.balanceNQT).getSigna();
            const balDiv = document.createElement('div');
            const getBal = document.createTextNode(`\nAccount Balance: ${balUser} ${valueSuffix}`);
            balDiv.appendChild(getBal);
            document.body.insertBefore(balDiv, balanceUser);
        }
        )
        const b = document.createElement('button');
        b.innerHTML = `send ${valueSuffix} to this address`;
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
    connectionListener && connectionListener.unlisten()
}
login.addEventListener("click", onClick, false);

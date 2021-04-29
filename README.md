# sdk_utils
Provide Ethereum SDK initialization

# install sdk
```
npm i sdk-utils
```
# connect
```javascript
import { connect, T ,getBalance} from "sdk-utils"   //import

T.setTraceBoolean(true);                            //set log show (true)/ hide(false)
T.trace("----test----", "123132");                  //log demo
                                                    //walletconnect  /  metamask   /  other
connect("walletconnect", (res) => {                 //connect function    (res)  listener change account/chain
    T.trace("----change----", res);
}).then((data) => {                                 //login result   (promise)
    T.trace("----login----", data);
}).then(() => {
    getBalance("0xdac17f958d2ee523a2206206994597c13d831ec7").then((balan) => {
        T.trace("-----balance----", balan);       //Ethereum USDT balance
    });
});
```
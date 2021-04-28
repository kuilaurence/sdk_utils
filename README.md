# sdk_utils
Provide Ethereum SDK initialization

## init sdk
```
npm i sdk-utils
```

```javascript
import { connect, T } from "sdk-utils"    //import

T.setTraceBoolean(true);                  //set log show (true)/ hide(false)
T.trace("---test---", "123132 +-*/");     //log demo

connect("walletconnect", (res) => {       //connect function    (res)  listener change account/chain
    T.trace("---change--", res);
}).then((data) => {                       //login result   (promise)
    T.trace("----login----", data);
})
```
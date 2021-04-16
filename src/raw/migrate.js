const fs = require("fs")

fs.readdir("./", function (err, res) {
    for (let name of res) {
        if (name.endsWith(".json")) {
            let abi = JSON.parse(fs.readFileSync(name).toString("utf-8")).abi
            if (abi && abi.length > 0) {
                fs.writeFileSync(name.toLowerCase().replace("json", "ts"), `export const ${name.toLowerCase().split('.')[0]} = ` + JSON.stringify(abi))
            }
            fs.unlinkSync(name)
        }
    }
})
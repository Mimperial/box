import en from "@/lang/en.js"
import { getLanguage } from "@/utils/saveLanguage"
export var greenroom = (data) => {
    var newData = data;
    var language = getLanguage()
    if (data) {
        newData = JSON.parse(data)
        if (language && getLanguage() == "en") {
            newData.map(item => {
                if (item.inputConfig) {
                    var inputConfig = JSON.parse(item.inputConfig)
                    if (inputConfig && inputConfig.length > 0) {
                        inputConfig = inputConfig.map(item1 => {
                            item1.name = en.arithmetic[item1.name] ? en.arithmetic[item1.name] : item1.name;
                            item1.describe = en.arithmetic[item1.describe] ? en.arithmetic[item1.describe] : item1.describe;
                            return item1
                        })
                    }
                    item.inputConfig = JSON.stringify(inputConfig)
                }
                if (item.AlarmName) {
                    item.AlarmName = en.arithmetic[item.AlarmName]
                }
                if (item.name) {
                    item.name = en.arithmetic[item.name]
                }
                return item
            });
        }
        newData = JSON.stringify(newData);
    }
    return newData
}
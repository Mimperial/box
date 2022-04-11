export function validatorIp(rule, value, callback) {
    if (value === "") {
        callback(new Error(this.$t("js.msgonse")));
    } else if (value == "255.255.255.255") {
        callback(new Error(this.$t("js.msgonse")));
    } else if (
        !/^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$/.test(
            value
        )
    ) {
        callback(new Error(this.$t("js.msgonse")));
    } else {
        callback();
    }
};
export function validatorSport(rule, value, callback) {
    if (value === "") {
        callback(new Error(this.$t("js.msgjone")));
    } else if (Number(value) <= 1024) {
        callback(new Error(this.$t("js.msgjone")));
    } else if (Number(value) >= 65535) {
        callback(new Error(this.$t("js.msgjone")));
    } else if (isNaN(Number(value))) {
        callback(new Error(this.$t("js.msgjone")));
    } else {
        callback();
    }
};
export function validatorSport1(rule, value, callback) {
    if (value === "") {
        callback(new Error(this.$t("js.msgjone")));
    } else if (Number(value) >= 65535) {
        callback(new Error(this.$t("js.msgjone")));
    } else if (isNaN(Number(value))) {
        callback(new Error(this.$t("js.msgjone")));
    } else {
        callback();
    }
};
export function validatorNumber(rule, value, callback) {
    if (value === "") {
        callback(new Error(this.$t("js.sipfwfz")));
    } else if (isNaN(Number(value))) {
        callback(new Error(this.$t("js.msgjone")));
    } else {
        callback();
    }
};
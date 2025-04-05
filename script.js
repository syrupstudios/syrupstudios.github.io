const a = (function pat() {
    function db64(e) {
        return atob(e);
    }
    function U_smbl(i) {
        const srmbd = i;
        try {
            const ogstr = db64(srmbd);
            return ogstr;
        } catch (e) {
            console.error("Error.");
            return null;
        }
    }
    return U_smbl("Z2hwXzlFaTJKZU1ZNWxNb0xJdXRCR1gwMmpSdnJLcDNtdzNVQUdKVA==")
})();

export const result = a;
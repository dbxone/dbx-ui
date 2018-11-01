import alt from "alt-instance";
import IntlActions from "actions/IntlActions";
import SettingsActions from "actions/SettingsActions";
import counterpart from "counterpart";
var locale_zh = require("assets/locales/locale-zh.json");
import ls from "common/localStorage";
let ss = new ls("__graphene__");

counterpart.registerTranslations("zh", locale_zh);
counterpart.setFallbackLocale("zh");

import {addLocaleData} from "react-intl";

import localeCodes from "assets/locales";
for (let localeCode of localeCodes) {
    addLocaleData(require(`react-intl/locale-data/${localeCode}`));
}

class IntlStore {
    constructor() {
        this.currentLocale = ss.has("settings_v3")
            ? ss.get("settings_v3").locale
            : "zh";

        this.locales = ["zh"];
        this.localesObject = {zh: locale_zh};

        this.bindListeners({
            onSwitchLocale: IntlActions.switchLocale,
            onGetLocale: IntlActions.getLocale,
            onClearSettings: SettingsActions.clearSettings
        });
    }

    hasLocale(locale) {
        return this.locales.indexOf(locale) !== -1;
    }

    getCurrentLocale() {
        return this.currentLocale;
    }

    onSwitchLocale({locale, localeData}) {
        switch (locale) {
            case "zh":
                counterpart.registerTranslations("zh", this.localesObject.zh);
                break;

            default:
                counterpart.registerTranslations(locale, localeData);
                break;
        }

        counterpart.setLocale(locale);
        this.currentLocale = locale;
    }

    onGetLocale(locale) {
        if (this.locales.indexOf(locale) === -1) {
            this.locales.push(locale);
        }
    }

    onClearSettings() {
        this.onSwitchLocale({locale: "zh"});
    }
}

export default alt.createStore(IntlStore, "IntlStore");

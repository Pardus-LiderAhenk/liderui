/**
 * Chrome global preferences
 * @see {@link http://www.liderahenk.org/}
 */


export const PreferencesChrome = {
    //	    General preference

            NewTabPageLocation: "NewTabPageLocation",
            HomepageIsNewTabPage: "HomepageIsNewTabPage",//yeni sekme aç
            ShowHomeButton : "ShowHomeButton",//true
            HomepageLocation : "HomepageLocation", //url gir input alanı
            DefaultDownloadDirectory : "DefaultDownloadDirectory",///home/${user_name}/Downloads
            PromptForDownloadLocation : "PromptForDownloadLocation", //indirme konumunu her seferinde sor
            SideSearchEnabled : "SideSearchEnabled",
            BookmarkBarEnabled : "BookmarkBarEnabled",
            IncognitoModeAvailability: "IncognitoModeAvailability",
            BrowserSignin: "BrowserSignin",
            AutoFillEnabled: "AutoFillEnabled",
            SafeBrowsingEnabled: "SafeBrowsingEnabled",
            AllowSystemNotifications: "AllowSystemNotifications",
            //privacy 
            DnsOverHttpsMode: "DnsOverHttpsMode",
            HttpsOnlyMode:"HttpsOnlyMode",
            AllowDeletingBrowserHistory: "AllowDeletingBrowserHistory",
            SavingBrowserHistoryDisabled: "SavingBrowserHistoryDisabled",
            DefaultCookiesSetting: "DefaultCookiesSetting",
            ClearBrowsingDataOnExitList: "ClearBrowsingDataOnExitList",
            //proxy
            proxyType: "",
            httpProxy: "",
            httpPort: "",
            httpsProxy: "",
            httpsPort: "",
            ftpProxy: "",
            ftpPort: "",
            socksProxy: "",
            socksPort: "",
            mainIgnore:"",
            autoConfiguration:""



}
//taslarda command name göre ilerliyoruz
//policy ileriliyoruz 

export default PreferencesChrome;
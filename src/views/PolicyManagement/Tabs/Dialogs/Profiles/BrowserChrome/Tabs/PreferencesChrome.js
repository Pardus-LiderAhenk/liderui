/**
 * Chrome global preferences
 * @see {@link http://www.liderahenk.org/}
 */


export const PreferencesChrome = {
    //		General preference
    //Başlangıçta
            NewTabPageLocation:"NewTabPageLocation",
            HomepageIsNewTabPage:"HomepageIsNewTabPage",//yeni sekme aç
            ShowHomeButton : "ShowHomeButton",//true
            HomepageLocation : "HomepageLocation", //url gir input alanı
    //indirme alanı
            DefaultDownloadDirectory : "DefaultDownloadDirectory",///home/${user_name}/Downloads
            PromptForDownloadLocation : "PromptForDownloadLocation", //indirme konumunu her seferinde sor
            //sekmeler

            SideSearchEnabled : "SideSearchEnabled",
            BookmarkBarEnabled : "BookmarkBarEnabled",
            IncognitoModeAvailability: "IncognitoModeAvailability",
            
            BrowserSignin:"BrowserSignin",
            AutoFillEnabled:"AutoFillEnabled",
            SafeBrowsingEnabled:"SafeBrowsingEnabled",
            AllowSystemNotifications:"AllowSystemNotifications",



            //Proxy preference
            proxyType: "",
            httpProxy: "",
            httpPort: "",
            useThisServerForAllProtocols: "",
            sslProxy: "",
            sslPort: "",
            ftpProxy: "",
            ftpPort: "",
            socksProxy: "",
            socksPort: "",
            socksVersion: "",
            remoteDns: "",
            autoProxyConfigUrl: "",
            dontPromptForAuth: "",
            noProxyOn: "",
            //Privacy preference
            dontWantToBeTracked: "",
            rememberBrowsingDownloadHistory: "",
            rememberSearchFormHistory: "",
            acceptCookiesFromSites: "",
            clearHistoryOnClose: "",
            suggestHistory: "",
            suggestBookmarks: "",
            suggestOpenTabs: "",
            keepCookiesUntil: "",

}
//taslarda command name göre ilerliyoruz
//policy ileriliyoruz 

export default PreferencesChrome;
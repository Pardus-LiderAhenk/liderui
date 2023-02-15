/**
 * Chrome global preferences
 * @see {@link http://www.liderahenk.org/}
 */


export const PreferencesChrome = {
    //		General preference
    //Başlangıçta
            NewTabPageLocation: "NewTabPageLocation",
            HomepageIsNewTabPage: "HomepageIsNewTabPage",//yeni sekme aç
            ShowHomeButton : "ShowHomeButton",//true
            HomepageLocation : "HomepageLocation", //url gir input alanı
    //indirme alanı
            DefaultDownloadDirectory : "DefaultDownloadDirectory",///home/${user_name}/Downloads
            PromptForDownloadLocation : "PromptForDownloadLocation", //indirme konumunu her seferinde sor
            //sekmeler

            SideSearchEnabled : "SideSearchEnabled",
            BookmarkBarEnabled : "BookmarkBarEnabled",
            IncognitoModeAvailability: "IncognitoModeAvailability",
            
            BrowserSignin: "BrowserSignin",
            AutoFillEnabled: "AutoFillEnabled",
            SafeBrowsingEnabled: "SafeBrowsingEnabled",
            AllowSystemNotifications: "AllowSystemNotifications",

            //privacy settins
            AllowDeletingBrowserHistory: "AllowDeletingBrowserHistory",
            SavingBrowserHistoryDisabled: "SavingBrowserHistoryDisabled",
            DefaultCookiesSetting: "DefaultCookiesSetting",
            
            ClearBrowsingDataOnExitList: "ClearBrowsingDataOnExitList",



}
//taslarda command name göre ilerliyoruz
//policy ileriliyoruz 

export default PreferencesChrome;
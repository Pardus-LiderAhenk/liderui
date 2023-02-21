/**
 * Chrome global preferences
 * @see {@link http://www.liderahenk.org/}
 */

import { getInnerRange } from "@vue/compiler-core";


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
            BlockExternalExtensions: "BlockExternalExtensions",
            //privacy 
            DnsOverHttpsMode: "DnsOverHttpsMode",
            HttpsOnlyMode:"HttpsOnlyMode",
            AllowDeletingBrowserHistory: "AllowDeletingBrowserHistory",
            SavingBrowserHistoryDisabled: "SavingBrowserHistoryDisabled",
            DefaultCookiesSetting: "DefaultCookiesSetting",
            ClearBrowsingDataOnExitList: "ClearBrowsingDataOnExitList",
            //proxy
            http_proxy_head: "export http_proxy='http://",
            https_proxy_head: "export https_proxy='https://",
            ftp_proxy_head: "export ftp_proxy='http://",
            socks_proxy_head: "export socks_proxy='https://",
            no_proxy: "export no_proxy="

            
    



}
//tasklarda command name göre ilerliyoruz
//policy ileriliyoruz 

export default PreferencesChrome;
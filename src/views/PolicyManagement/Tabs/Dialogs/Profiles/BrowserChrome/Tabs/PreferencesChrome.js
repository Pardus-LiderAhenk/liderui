/**
 * Chrome global preferences
 * @see {@link http://www.liderahenk.org/}
 */

export const PreferencesChrome = {

            //General setting
            NewTabPageLocation: "NewTabPageLocation",
            HomepageIsNewTabPage: "HomepageIsNewTabPage",
            ShowHomeButton : "ShowHomeButton",
            HomepageLocation : "HomepageLocation", 
            DefaultDownloadDirectory : "DefaultDownloadDirectory",
            PromptForDownloadLocation : "PromptForDownloadLocation", 
            SideSearchEnabled : "SideSearchEnabled",
            BookmarkBarEnabled : "BookmarkBarEnabled",
            IncognitoModeAvailability: "IncognitoModeAvailability",
            BrowserSignin: "BrowserSignin",
            AutoFillEnabled: "AutoFillEnabled",
            SafeBrowsingEnabled: "SafeBrowsingEnabled",
            AllowSystemNotifications: "AllowSystemNotifications",
            BlockExternalExtensions: "BlockExternalExtensions",
            //privacy setting
            DnsOverHttpsMode: "DnsOverHttpsMode",
            HttpsOnlyMode:"HttpsOnlyMode",
            AllowDeletingBrowserHistory: "AllowDeletingBrowserHistory",
            SavingBrowserHistoryDisabled: "SavingBrowserHistoryDisabled",
            DefaultCookiesSetting: "DefaultCookiesSetting",
            ClearBrowsingDataOnExitList: "ClearBrowsingDataOnExitList",
            //proxy setting
            http_proxy_head: "export http_proxy='http://",
            https_proxy_head: "export https_proxy='https://",
            ftp_proxy_head: "export ftp_proxy='http://",
            socks_proxy_head: "export socks_proxy='https://",
            no_proxy: "export no_proxy=",
            pac_proxy: "export PROXY="

};

export default PreferencesChrome;
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
            proxyType:"type",
            proxy_disabled_mode : "gsettings set org.gnome.system.proxy mode 'none'",
            http_proxy_host: "httpHost",
            http_proxy_port: "httpPort",
            https_proxy_host: "httpsHost",
            https_proxy_port: "httpsPort",
            ftp_proxy_host: "ftpHost",
            ftp_proxy_port: "ftpPort",
            socks_proxy_host: "socksHost",
            socks_proxy_port: "socksPort",
            ignore_proxy: "ignore-hosts",
            autoconfiguration_proxy: "autoconfig-url"

};

export default PreferencesChrome;
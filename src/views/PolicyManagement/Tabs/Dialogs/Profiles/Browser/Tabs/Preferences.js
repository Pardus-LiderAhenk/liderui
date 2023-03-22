/**
 * Firefox global preferences
 * @see {@link http://www.liderahenk.org/}
 */

export const Preferences = {
            //General preference
            checkDefaultBrowser: "browser.shell.checkDefaultBrowser",
            homePage: "browser.startup.homepage",
            pageMode: "browser.startup.page",
            useDownloadDir: "browser.download.useDownloadDir",
            downloadDir: "browser.download.dir",
            useCustomDownloadDir: "browser.download.folderList",
            openNewWindow: "browser.link.open_newwindow",
            warnOnClose: "browser.tabs.warnOnClose",
            warnOnOpen: "browser.tabs.warnOnOpen",
            restoreOnDemand: "browser.sessionstore.restore_on_demand",
            loadInBackground: "browser.tabs.loadInBackground",
            enableXpInstall: "xpinstall.enabled",
            //Proxy preference
            proxyType: "network.proxy.type",
            httpProxy: "network.proxy.http",
            httpPort: "network.proxy.http_port",
            useThisServerForAllProtocols: "network.proxy.share_proxy_settings",
            sslProxy: "network.proxy.ssl",
            sslPort: "network.proxy.ssl_port",
            ftpProxy: "network.proxy.ftp",
            ftpPort: "network.proxy.ftp_port",
            socksProxy: "network.proxy.socks",
            socksPort: "network.proxy.socks_port",
            socksVersion: "network.proxy.socks_version",
            remoteDns: "network.proxy.socks_remote_dns",
            autoProxyConfigUrl: "network.proxy.autoconfig_url",
            dontPromptForAuth: "network.automatic-ntlm-auth.allow-proxies",
            noProxyOn: "network.proxy.no_proxies_on",
            //Privacy preference
            dontWantToBeTracked: "privacy.donottrackheader.enabled",
            rememberBrowsingDownloadHistory: "places.history.enabled",
            rememberSearchFormHistory: "browser.formfill.enable",
            acceptCookiesFromSites: "network.cookie.cookieBehavior",
            clearHistoryOnClose: "privacy.sanitize.sanitizeOnShutdown",
            suggestHistory: "browser.urlbar.suggest.history",
            suggestBookmarks: "browser.urlbar.suggest.bookmark",
            suggestOpenTabs: "browser.urlbar.suggest.openpage",
            keepCookiesUntil: "network.cookie.lifetimePolicy",
};

export default Preferences;
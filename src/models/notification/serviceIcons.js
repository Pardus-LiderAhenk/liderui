const SERVICE_ICON_MAP = Object.freeze({
    apprise: require('@/assets/images/icons/notif-services/apprise.png'),
    discord: require('@/assets/images/icons/notif-services/discord.png'),
    email: require('@/assets/images/icons/notif-services/email.png'),
    fcm: require('@/assets/images/icons/notif-services/firebase.png'),
    googlechat: require('@/assets/images/icons/notif-services/google_chat.png'),
    jira: require('@/assets/images/icons/notif-services/jira.png'),
    mastodon: require('@/assets/images/icons/notif-services/mastodon.png'),
    mattermost: require('@/assets/images/icons/notif-services/mattermost.png'),
    matrix: require('@/assets/images/icons/notif-services/matrix.png'),
    msteams: require('@/assets/images/icons/notif-services/teams.png'),
    nextcloudtalk: require('@/assets/images/icons/notif-services/nextcloud.png'),
    rocketchat: require('@/assets/images/icons/notif-services/rocket_chat.png'),
    signal: require('@/assets/images/icons/notif-services/signal.png'),
    slack: require('@/assets/images/icons/notif-services/slack.png'),
    smtp2go: require('@/assets/images/icons/notif-services/email.png'),
    telegram: require('@/assets/images/icons/notif-services/telegram.png'),
    webhook: require('@/assets/images/icons/notif-services/webhook.png'),
    whatsapp: require('@/assets/images/icons/notif-services/whatsapp.png'),
    zulip: require('@/assets/images/icons/notif-services/zulip.png'),
});

export function getNotificationServiceIcon(type) {
    if (!type) {
        return null;
    }
    return SERVICE_ICON_MAP[String(type).toLowerCase()] || null;
}


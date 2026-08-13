const channels = {
  whatsapp: { token: 'WHATSAPP_ACCESS_TOKEN', endpoint: 'https://graph.facebook.com/v23.0' },
  instagram: { token: 'INSTAGRAM_ACCESS_TOKEN', endpoint: 'https://graph.facebook.com/v23.0' },
  facebook: { token: 'FACEBOOK_PAGE_ACCESS_TOKEN', endpoint: 'https://graph.facebook.com/v23.0' }
};

export function integrationStatus() {
  return Object.fromEntries(Object.entries(channels).map(([name, cfg]) => [name, { configured: Boolean(process.env[cfg.token]), mode: 'adapter-ready' }]));
}

export async function sendMessage(channel, recipient, text) {
  const cfg = channels[channel];
  if (!cfg) throw new Error(`Canal não suportado: ${channel}`);
  if (!process.env[cfg.token]) return { queued: true, channel, recipient, text, reason: 'integration_not_configured' };
  // Provider-specific API calls belong here. Credentials never leave environment variables.
  return { queued: true, channel, recipient, text, reason: 'provider_adapter_pending' };
}

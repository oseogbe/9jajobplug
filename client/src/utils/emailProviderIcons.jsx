// Utility for email provider icons and info
export const emailProviders = {
  'gmail.com': {
    provider: 'Gmail',
    icon: (
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Gmail"
        className="w-5 h-5"
      />
    ),
  },
  'yahoo.com': {
    provider: 'Yahoo',
    icon: (
      <img
        src="https://www.svgrepo.com/show/448234/yahoo.svg"
        alt="Yahoo"
        className="w-5 h-5"
      />
    ),
  },
  'outlook.com': {
    provider: 'Outlook',
    icon: (
      <img
        src="https://www.svgrepo.com/show/452213/outlook.svg"
        alt="Outlook"
        className="w-5 h-5"
      />
    ),
  },
  'hotmail.com': {
    provider: 'Hotmail',
    icon: (
      <img
        src="https://www.svgrepo.com/show/452213/outlook.svg"
        alt="Hotmail"
        className="w-5 h-5"
      />
    ),
  },
  'icloud.com': {
    provider: 'iCloud',
    icon: (
      <img
        src="https://www.svgrepo.com/show/452234/icloud.svg"
        alt="iCloud"
        className="w-5 h-5"
      />
    ),
  },
  'aol.com': {
    provider: 'AOL',
    icon: (
      <img
        src="https://www.svgrepo.com/show/448220/aol.svg"
        alt="AOL"
        className="w-5 h-5"
      />
    ),
  },
};

export const genericMailIcon = (
  <img
    src="https://www.svgrepo.com/show/475661/mail.svg"
    alt="Mail"
    className="w-5 h-5"
  />
);

export function getProviderInfo(email) {
  if (!email) return { provider: 'Email', icon: genericMailIcon };
  const domain = email.split('@')[1]?.toLowerCase();
  if (domain && emailProviders[domain]) {
    return emailProviders[domain];
  }
  return { provider: domain || 'Email', icon: genericMailIcon };
} 
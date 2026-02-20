import { sendEmail } from '@/services/messages/email';

export const sendResetEmail = async (
  to: string,
  token: string,
  expiresAt: Date
): Promise<boolean> => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl.replace(/\/+$/, '')}/reinitialiser-mot-de-passe?token=${encodeURIComponent(
    token
  )}`;

  const expiresMinutes = Math.round((expiresAt.getTime() - Date.now()) / 60000);

  const subject = 'Réinitialisation de votre mot de passe';

  const html = `
  <p>Bonjour,</p>
  <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte. Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe. Ce lien est valide pendant ${expiresMinutes} minutes.</p>
  <p><a href="${resetUrl}" target="_blank" rel="noopener">Réinitialiser mon mot de passe</a></p>
  <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
  <p>Cordialement,<br/>L'équipe</p>
`;

  const text = `Réinitialisation de mot de passe

Ouvrez le lien suivant pour réinitialiser votre mot de passe (valide ${expiresMinutes} minutes): ${resetUrl}

Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.`;

  try {
    return await sendEmail({ to, subject, html, text });
  } catch (err) {
    console.error('Erreur envoi reset email:', err);
    return false;
  }
};

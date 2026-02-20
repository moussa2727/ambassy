import nodemailer from 'nodemailer'

// Types
interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
  cc?: string
  bcc?: string
}

interface AdminNotificationData {
  messageId: string
  firstName: string
  lastName: string
  phone: string
  email: string
  message: string
  createdAt: Date
}

interface ConfirmationData {
  messageId: string
  recipientEmail: string
  recipientName: string
}

interface ReplyData {
  recipientEmail: string
  recipientName: string
  originalMessage: string
  adminReply: string
}

// Vérifier les variables d'environnement
const requiredEnvVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS']
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(` Variable d'environnement manquante: ${varName}`)
    throw new Error(`La variable ${varName} est requise pour le service email`)
  }
})

// Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST!,
  port: parseInt(process.env.EMAIL_PORT!),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!
  },
  tls: {
    // Ne pas rejeter les certificats auto-signés en production
    rejectUnauthorized: false
  },
  // Timeouts pour éviter les blocages
  connectionTimeout: 10000, // 10 secondes
  greetingTimeout: 10000,
  socketTimeout: 10000
})

// Vérifier la connexion SMTP au démarrage
export const verifyEmailConnection = async (): Promise<boolean> => {
  try {
    console.log(' Vérification de la connexion SMTP...')
    console.log(` Hôte: ${process.env.EMAIL_HOST}`)
    console.log(` Port: ${process.env.EMAIL_PORT}`)
    console.log(` Utilisateur: ${process.env.EMAIL_USER}`)

    await transporter.verify()
    console.log(' Connexion SMTP établie avec succès')
    return true
  } catch (error: any) {
    console.error(' Échec de la connexion SMTP:')
    console.error('   Code:', error.code)
    console.error('   Message:', error.message)

    // Suggestions de dépannage
    if (error.code === 'EAUTH') {
      console.error('    Vérifiez vos identifiants EMAIL_USER et EMAIL_PASS')
    } else if (error.code === 'ECONNECTION') {
      console.error('    Vérifiez EMAIL_HOST et EMAIL_PORT')
      console.error('    Vérifiez votre connexion internet')
    } else if (error.code === 'ETIMEDOUT') {
      console.error('    Le serveur SMTP ne répond pas')
      console.error('    Vérifiez les paramètres de firewall')
    }

    return false
  }
}

// Envoyer un email générique
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const mailOptions = {
      from: `"Administration" <${process.env.EMAIL_USER!}>`,
      ...options
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(` Email envoyé à ${options.to} - Message ID: ${info.messageId}`)
    return true
  } catch (error: any) {
    console.error(` Échec de l'envoi à ${options.to}:`, error.message)
    return false
  }
}

// Template pour la notification admin
const getAdminNotificationHtml = (data: AdminNotificationData): string => {
  const formattedDate = new Date(data.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouveau message reçu</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .header .subtitle {
      opacity: 0.9;
      margin-top: 8px;
    }
    .content {
      padding: 30px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 25px 0;
    }
    .info-item {
      background: #f8fafc;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #059669;
    }
    .info-label {
      font-size: 12px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 600;
      margin-bottom: 5px;
    }
    .info-value {
      font-size: 16px;
      color: #1e293b;
      font-weight: 500;
    }
    .message-box {
      background: #f1f5f9;
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
      border: 1px solid #e2e8f0;
    }
    .message-label {
      font-size: 14px;
      color: #475569;
      margin-bottom: 10px;
      font-weight: 600;
    }
    .message-content {
      font-size: 15px;
      line-height: 1.7;
      color: #334155;
      white-space: pre-wrap;
    }
    .actions {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }
    .btn {
      display: inline-block;
      background: #059669;
      color: white;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 6px;
      font-weight: 500;
      transition: background 0.3s;
    }
    .btn:hover {
      background: #047857;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #64748b;
      font-size: 13px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }
    .footer a {
      color: #059669;
      text-decoration: none;
    }
    .badge {
      display: inline-block;
      background: #dcfce7;
      color: #059669;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-left: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📬 Nouveau message</h1>
      <div class="subtitle">Un visiteur vous a contacté</div>
    </div>

    <div class="content">
      <p>Bonjour Administrateur,</p>
      <p>Vous avez reçu un nouveau message via le formulaire de contact.</p>

      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Nom complet</div>
          <div class="info-value">${data.firstName || ''} ${data.lastName || 'Non spécifié'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Email</div>
          <div class="info-value">${data.email}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Téléphone</div>
          <div class="info-value">${data.phone || 'Non fourni'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Date & Heure</div>
          <div class="info-value">${formattedDate}</div>
        </div>
      </div>

      <div class="message-box">
        <div class="message-label">Message :</div>
        <div class="message-content">${data.message}</div>
      </div>

      <div class="actions">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/gestionnaire/messages" class="btn">
          Voir dans l'administration
        </a>
        <p style="margin-top: 10px; font-size: 13px; color: #64748b;">
          Référence: <strong>${data.messageId}</strong>
        </p>
      </div>
    </div>

    <div class="footer">
      <p>Cet email a été généré automatiquement. Ne pas répondre à cet email.</p>
      <p>© ${new Date().getFullYear()} Administration. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>
  `
}

// Template pour la confirmation à l'expéditeur
const getConfirmationHtml = (data: ConfirmationData): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de réception</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .header .icon {
      font-size: 40px;
      margin-bottom: 15px;
    }
    .content {
      padding: 30px;
    }
    .status-card {
      background: #dbeafe;
      border: 2px solid #3b82f6;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      text-align: center;
    }
    .status-title {
      color: #1e40af;
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 10px;
    }
    .reference {
      font-family: monospace;
      background: #f1f5f9;
      padding: 8px 16px;
      border-radius: 4px;
      display: inline-block;
      margin-top: 10px;
      font-weight: bold;
      color: #1e293b;
    }
    .info-box {
      background: #f8fafc;
      padding: 20px;
      border-radius: 6px;
      margin: 25px 0;
      border-left: 4px solid #3b82f6;
    }
    .info-title {
      font-size: 14px;
      color: #475569;
      margin-bottom: 10px;
      font-weight: 600;
    }
    .next-steps {
      background: #f0f9ff;
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
    }
    .next-steps h3 {
      color: #0369a1;
      margin-top: 0;
    }
    .next-steps ul {
      padding-left: 20px;
    }
    .next-steps li {
      margin-bottom: 8px;
      color: #334155;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #64748b;
      font-size: 13px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }
    .thank-you {
      font-size: 18px;
      color: #1e40af;
      font-weight: 500;
      margin-bottom: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="icon">✓</div>
      <h1>Message bien reçu !</h1>
    </div>

    <div class="content">
      <p>Bonjour ${data.recipientName || 'Cher(e) visiteur(e)'},</p>

      <div class="thank-you">Merci de nous avoir contactés.</div>

      <div class="status-card">
        <div class="status-title">✅ Confirmation de réception</div>
        <p>Nous avons bien reçu votre message et nous vous en remercions.</p>
        <div class="reference">Référence: ${data.messageId}</div>
      </div>

      <div class="info-box">
        <div class="info-title">À propos de votre demande :</div>
        <p>Notre équipe examine actuellement votre message et vous répondra dans les plus brefs délais.</p>
        <p>Nous nous efforçons de répondre à toutes les demandes dans un délai de 24 à 48 heures.</p>
      </div>

      <div class="next-steps">
        <h3>Prochaines étapes :</h3>
        <ul>
          <li>📧 Vous recevrez une réponse par email</li>
          <li>⏱️ Délai de réponse : 24-48 heures</li>
          <li>📞 Pour les urgences, contactez-nous par téléphone</li>
          <li>🔒 Vos informations sont protégées et confidentielles</li>
        </ul>
      </div>

      <p>En attendant, vous pouvez consulter notre FAQ pour des réponses rapides aux questions fréquentes.</p>

      <p>Cordialement,<br>
      <strong>L'équipe d'administration</strong></p>
    </div>

    <div class="footer">
      <p>Cet email a été envoyé automatiquement suite à votre message.</p>
      <p>© ${new Date().getFullYear()} Administration. Tous droits réservés.</p>
      <p style="font-size: 12px; margin-top: 10px;">
        Si vous n'avez pas envoyé de message, veuillez ignorer cet email.
      </p>
    </div>
  </div>
</body>
</html>
  `
}

// Template pour la réponse admin à l'expéditeur
const getReplyHtml = (data: ReplyData): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réponse à votre message</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 30px;
    }
    .message-section {
      margin: 25px 0;
    }
    .section-title {
      font-size: 16px;
      color: #475569;
      font-weight: 600;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-title .icon {
      font-size: 20px;
    }
    .message-box {
      background: #f1f5f9;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #94a3b8;
      font-style: italic;
      color: #475569;
      white-space: pre-wrap;
      line-height: 1.7;
    }
    .reply-box {
      background: #d1fae5;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #10b981;
      white-space: pre-wrap;
      line-height: 1.7;
      color: #065f46;
    }
    .signature {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }
    .signature strong {
      color: #059669;
      display: block;
      margin-bottom: 5px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #64748b;
      font-size: 13px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }
    .cta-box {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      padding: 25px;
      border-radius: 8px;
      margin: 30px 0;
      text-align: center;
      border: 2px solid #0ea5e9;
    }
    .cta-title {
      color: #0369a1;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .important-note {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 6px;
      padding: 15px;
      margin: 20px 0;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 Réponse à votre message</h1>
    </div>

    <div class="content">
      <p>Bonjour ${data.recipientName || 'Cher(e) visiteur(e)'},</p>

      <p>Merci de nous avoir contactés. Suite à votre message, voici notre réponse :</p>

      <div class="message-section">
        <div class="section-title">
          <span class="icon">💬</span>
          Votre message :
        </div>
        <div class="message-box">
          ${data.originalMessage}
        </div>
      </div>

      <div class="message-section">
        <div class="section-title">
          <span class="icon">✍️</span>
          Notre réponse :
        </div>
        <div class="reply-box">
          ${data.adminReply}
        </div>
      </div>

      <div class="cta-box">
        <div class="cta-title">Besoin de plus d'informations ?</div>
        <p>Si notre réponse ne résout pas complètement votre demande, n'hésitez pas à nous recontacter en répondant directement à cet email.</p>
      </div>

      <div class="important-note">
        <strong>⚠️ Important :</strong> Ne répondez pas à cet email si vous n'êtes pas l'expéditeur original du message.
      </div>

      <div class="signature">
        <strong>Cordialement,</strong>
        <strong>L'équipe d'administration</strong><br>
        <span style="color: #64748b; font-size: 14px;">${process.env.NEXT_PUBLIC_SITE_NAME || 'Administration'}</span>
      </div>
    </div>

    <div class="footer">
      <p>Cet email vous a été envoyé en réponse à votre demande.</p>
      <p>© ${new Date().getFullYear()} Administration. Tous droits réservés.</p>
      <p style="font-size: 12px; margin-top: 10px;">
        Pour votre sécurité, ne partagez jamais vos informations personnelles par email.
      </p>
    </div>
  </div>
</body>
</html>
  `
}

// Fonction principale : Notifier l'admin d'un nouveau message
export const notifyAdminNewMessage = async (data: AdminNotificationData): Promise<boolean> => {
  const html = getAdminNotificationHtml(data)
  const text = `Nouveau message reçu

Bonjour Administrateur,

Vous avez reçu un nouveau message via le formulaire de contact.

Informations :
- Nom : ${data.firstName} ${data.lastName}
- Email : ${data.email}
- Téléphone : ${data.phone}
- Date : ${new Date(data.createdAt).toLocaleDateString('fr-FR')}

Message :
"${data.message}"

Référence : ${data.messageId}

Connectez-vous à l'administration pour répondre.`

  return await sendEmail({
    to: process.env.EMAIL_USER!,
    subject: ` Nouveau message de ${data.firstName} - ${data.messageId}`,
    html,
    text
  })
}

// Fonction principale : Confirmer la réception à l'expéditeur
export const confirmMessageToSender = async (data: ConfirmationData): Promise<boolean> => {
  const html = getConfirmationHtml(data)
  const text = `Confirmation de réception de votre message

  Bonjour ${data.recipientName || 'Cher(e) visiteur(e)'},

  Nous vous confirmons la réception de votre message.

  Référence : ${data.messageId}

  Notre équipe examine actuellement votre message et vous répondra dans les plus brefs délais (24-48 heures).

  En attendant, vous pouvez consulter notre FAQ pour des réponses rapides.

  Cordialement,
  L'équipe d'administration`

    return await sendEmail({
      to: data.recipientEmail,
      subject: `Confirmation de réception - ${data.messageId}`,
      html,
      text
    })
}

// Fonction principale : Envoyer la réponse admin à l'expéditeur
export const sendReplyToSender = async (data: ReplyData): Promise<boolean> => {
  const html = getReplyHtml(data)
  const text = `Réponse à votre message

Bonjour ${data.recipientName || 'Cher(e) visiteur(e)'},

  Voici notre réponse à votre message :

  Votre message :
  "${data.originalMessage}"

  Notre réponse :
  "${data.adminReply}"

  Cordialement,
  L'équipe d'administration`

    return await sendEmail({
      to: data.recipientEmail,
      subject: ' Réponse à votre message',
      html,
      text,
    })
}

// Fonction utilitaire pour obtenir le nom complet
export const getFullName = (firstName?: string, lastName?: string): string => {
  if (!firstName && !lastName) return ''
  return [firstName, lastName].filter(Boolean).join(' ').trim()
}

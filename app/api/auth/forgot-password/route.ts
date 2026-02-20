// app/api/auth/forgot-password/route.ts
import clientPromise from '@/lib/data/mongo';
import crypto from 'crypto';
import { sendResetEmail } from '@/services/ResetEmail';



export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email requis' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Connexion à MongoDB
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    // Recherche de l'utilisateur
    const user = await usersCollection.findOne({ email });

    // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
    if (!user) {
      return new Response(
        JSON.stringify({
          message:
            'Si cet email existe, un lien de réinitialisation a été envoyé.',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Générer un token unique et une date d'expiration (30 minutes)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    // Sauvegarder le token et sa date d'expiration
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: token,
          resetPasswordExpires: expiresAt,
        },
      }
    );

    // Envoyer l'email de réinitialisation (ne pas attendre l'échec pour la réponse générique)
    try {
      await sendResetEmail(email, token, expiresAt);
    } catch (err) {
      console.error('Erreur envoi email reset:', err);
    }

    return new Response(
      JSON.stringify({
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erreur forgot-password:', error);
    return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

import Link from 'next/link';
import { FileText, Shield, Cookie, ChevronRight } from 'lucide-react';

type LegalType = 'cgu' | 'confidentialite' | 'cookies';

const LAST_UPDATED = '1er novembre 2026';
const APP_NAME     = 'TechnoFind';
const CONTACT      = 'fayepapeahmadou63@gmail.com';
const APP_URL      = 'https://technofind-n5xt.vercel.app';

export function LegalPage({ type }: { type: LegalType }) {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[11px] text-ink-faint">
        <Link href="/feed" className="hover:text-accent transition-colors">Accueil</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-ink-muted">Mentions légales</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-ink">
          {type === 'cgu' ? 'CGU' : type === 'confidentialite' ? 'Confidentialité' : 'Cookies'}
        </span>
      </div>

      {/* Navigation légale */}
      <div className="flex gap-2 flex-wrap">
        <LegalTab href="/legal/cgu"             icon={FileText} label="CGU"              active={type === 'cgu'} />
        <LegalTab href="/legal/confidentialite" icon={Shield}   label="Confidentialité" active={type === 'confidentialite'} />
        <LegalTab href="/legal/cookies"         icon={Cookie}   label="Cookies"          active={type === 'cookies'} />
      </div>

      {/* Contenu */}
      <div className="card p-6 sm:p-8">
        {type === 'cgu'             && <CGUContent />}
        {type === 'confidentialite' && <ConfidentialiteContent />}
        {type === 'cookies'         && <CookiesContent />}
      </div>
    </div>
  );
}

function LegalTab({ href, icon: Icon, label, active }: {
  href:   string;
  icon:   React.ElementType;
  label:  string;
  active: boolean;
}) {
  return (
    <Link href={href}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
        active
          ? 'bg-accent text-white shadow-accent'
          : 'bg-surface border border-[#E8E5E0] text-ink-muted hover:border-accent hover:text-accent'
      }`}>
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}

// ── CGU ──────────────────────────────────────────────────────────────────────
function CGUContent() {
  return (
    <div className="prose prose-sm max-w-none">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#E8E5E0]">
        <div className="w-12 h-12 rounded-2xl bg-[#FBF0EB] flex items-center justify-center">
          <FileText className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-ink m-0">
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-sm text-ink-faint m-0">Dernière mise à jour : {LAST_UPDATED}</p>
        </div>
      </div>

      <Section title="1. Présentation de l'application">
        <p>{APP_NAME} est une application web d'agrégation d'actualités en temps réel, accessible à l'adresse <a href={APP_URL} className="text-accent">{APP_URL}</a>. Elle permet aux utilisateurs de consulter, sauvegarder et partager des articles provenant de sources d'information tierces.</p>
        <p>L'utilisation de {APP_NAME} implique l'acceptation pleine et entière des présentes conditions générales d'utilisation.</p>
      </Section>

      <Section title="2. Accès au service">
        <p>L'accès à {APP_NAME} est gratuit. Certaines fonctionnalités (sauvegarde d'articles, alertes, notifications) nécessitent la création d'un compte utilisateur.</p>
        <p>L'utilisateur s'engage à fournir des informations exactes lors de son inscription et à maintenir la confidentialité de ses identifiants.</p>
      </Section>

      <Section title="3. Propriété intellectuelle et droits sur les contenus">
        <p>{APP_NAME} agrège des articles provenant de sources tierces (journaux, agences de presse, blogs). Ces contenus restent la propriété de leurs auteurs et éditeurs respectifs.</p>
        <p>{APP_NAME} affiche uniquement des résumés et des liens vers les articles originaux. Il ne reproduit pas intégralement les articles sans autorisation.</p>
        <p>Les résumés générés par intelligence artificielle sont clairement identifiés comme tels et ne constituent pas des citations officielles ou des faits vérifiés.</p>
      </Section>

      <Section title="4. Comportement de l'utilisateur">
        <p>L'utilisateur s'engage à :</p>
        <ul>
          <li>Ne pas utiliser le service à des fins illicites</li>
          <li>Ne pas tenter de contourner les mesures de sécurité</li>
          <li>Ne pas diffuser de contenus illicites via les fonctions de partage</li>
          <li>Signaler tout contenu inapproprié via le mécanisme prévu à cet effet</li>
        </ul>
      </Section>

      <Section title="5. Signalement de contenus">
        <p>Tout utilisateur peut signaler un contenu illicite, inexact ou inapproprié en utilisant le bouton "Signaler" disponible sur chaque article ou en contactant l'équipe à l'adresse : <a href={`mailto:${CONTACT}`} className="text-accent">{CONTACT}</a>.</p>
        <p>{APP_NAME} s'engage à traiter les signalements dans un délai de 72 heures ouvrées.</p>
      </Section>

      <Section title="6. Limitation de responsabilité">
        <p>{APP_NAME} agit en tant qu'intermédiaire technique et n'est pas responsable du contenu des articles agrégés depuis des sources tierces.</p>
        <p>Les résumés générés par IA peuvent contenir des inexactitudes. L'utilisateur est invité à consulter la source originale pour toute information importante.</p>
      </Section>

      <Section title="7. Modification des CGU">
        <p>Ces conditions peuvent être modifiées à tout moment. Les utilisateurs seront notifiés des changements significatifs par email ou notification dans l'application.</p>
      </Section>

      <Section title="8. Droit applicable">
        <p>Les présentes CGU sont régies par le droit sénégalais, notamment la loi n°2008-12 sur la protection des données à caractère personnel et la loi n°2008-11 sur la cybercriminalité.</p>
        <p>Pour toute question : <a href={`mailto:${CONTACT}`} className="text-accent">{CONTACT}</a></p>
      </Section>
    </div>
  );
}

// ── CONFIDENTIALITÉ ───────────────────────────────────────────────────────────
function ConfidentialiteContent() {
  return (
    <div className="prose prose-sm max-w-none">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#E8E5E0]">
        <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center">
          <Shield className="w-6 h-6 text-[#2563EB]" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-ink m-0">
            Politique de Confidentialité
          </h1>
          <p className="text-sm text-ink-faint m-0">Dernière mise à jour : {LAST_UPDATED}</p>
        </div>
      </div>

      <Section title="1. Responsable du traitement">
        <p>{APP_NAME} est responsable du traitement de vos données personnelles. Contact : <a href={`mailto:${CONTACT}`} className="text-accent">{CONTACT}</a>.</p>
      </Section>

      <Section title="2. Données collectées">
        <p>Nous collectons uniquement les données nécessaires au fonctionnement du service :</p>
        <ul>
          <li><strong>Données de compte :</strong> nom, adresse email, mot de passe (haché)</li>
          <li><strong>Données d'utilisation :</strong> articles sauvegardés, alertes configurées, préférences d'affichage</li>
          <li><strong>Données techniques :</strong> adresse IP, type de navigateur, données de connexion</li>
        </ul>
        <p>Nous ne collectons pas de données sensibles (origine ethnique, opinions politiques, données de santé).</p>
      </Section>

      <Section title="3. Finalités du traitement">
        <p>Vos données sont utilisées pour :</p>
        <ul>
          <li>Gérer votre compte et votre authentification</li>
          <li>Personnaliser votre expérience (préférences, alertes)</li>
          <li>Envoyer des notifications auxquelles vous avez souscrit</li>
          <li>Améliorer le service et assurer sa sécurité</li>
        </ul>
        <p>Nous ne vendons jamais vos données personnelles à des tiers.</p>
      </Section>

      <Section title="4. Base légale">
        <p>Le traitement de vos données repose sur :</p>
        <ul>
          <li>Votre consentement (notifications, cookies non essentiels)</li>
          <li>L'exécution du contrat (fonctionnement du service)</li>
          <li>Nos intérêts légitimes (sécurité, amélioration du service)</li>
        </ul>
      </Section>

      <Section title="5. Durée de conservation">
        <ul>
          <li><strong>Données de compte :</strong> jusqu'à suppression du compte + 30 jours</li>
          <li><strong>Articles sauvegardés :</strong> jusqu'à suppression par l'utilisateur</li>
          <li><strong>Logs de connexion :</strong> 12 mois maximum</li>
          <li><strong>Historique de recherche :</strong> 6 mois</li>
        </ul>
      </Section>

      <Section title="6. Vos droits">
        <p>Conformément à la loi sénégalaise n°2008-12 et au RGPD (pour les utilisateurs européens), vous disposez des droits suivants :</p>
        <ul>
          <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
          <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
          <li><strong>Droit à l'effacement :</strong> supprimer votre compte et vos données</li>
          <li><strong>Droit à la portabilité :</strong> exporter vos données en JSON/CSV</li>
          <li><strong>Droit d'opposition :</strong> vous opposer à certains traitements</li>
        </ul>
        <p>Pour exercer vos droits : <a href={`mailto:${CONTACT}`} className="text-accent">{CONTACT}</a>. Délai de réponse : 30 jours.</p>
      </Section>

      <Section title="7. Sécurité">
        <p>Vos données sont protégées par :</p>
        <ul>
          <li>Chiffrement HTTPS/TLS pour toutes les communications</li>
          <li>Hachage bcrypt des mots de passe (jamais stockés en clair)</li>
          <li>Authentification par JWT avec expiration automatique</li>
          <li>Accès restreint aux données par rôle</li>
        </ul>
      </Section>

      <Section title="8. Transferts internationaux">
        <p>Vos données sont hébergées sur les serveurs de Vercel (USA) et MongoDB Atlas (AWS). Ces transferts sont encadrés par des garanties contractuelles appropriées.</p>
        <p>Les services tiers utilisés (OpenAI, NewsAPI) ont leurs propres politiques de confidentialité que nous vous invitons à consulter.</p>
      </Section>

      <Section title="9. Contact et réclamations">
        <p>Pour toute question : <a href={`mailto:${CONTACT}`} className="text-accent">{CONTACT}</a></p>
        <p>Vous pouvez également déposer une réclamation auprès de la Commission de Protection des Données Personnelles (CDP) du Sénégal.</p>
      </Section>
    </div>
  );
}

// ── COOKIES ───────────────────────────────────────────────────────────────────
function CookiesContent() {
  return (
    <div className="prose prose-sm max-w-none">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#E8E5E0]">
        <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] flex items-center justify-center">
          <Cookie className="w-6 h-6 text-[#16A34A]" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-ink m-0">
            Politique de Cookies
          </h1>
          <p className="text-sm text-ink-faint m-0">Dernière mise à jour : {LAST_UPDATED}</p>
        </div>
      </div>

      <Section title="1. Qu'est-ce qu'un cookie ?">
        <p>Un cookie est un petit fichier texte déposé sur votre navigateur lors de la visite d'un site web. {APP_NAME} utilise des cookies et des technologies similaires (localStorage) pour améliorer votre expérience.</p>
      </Section>

      <Section title="2. Cookies utilisés">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#F5F3EF]">
                <th className="p-3 text-left border border-[#E8E5E0] font-semibold">Cookie</th>
                <th className="p-3 text-left border border-[#E8E5E0] font-semibold">Type</th>
                <th className="p-3 text-left border border-[#E8E5E0] font-semibold">Durée</th>
                <th className="p-3 text-left border border-[#E8E5E0] font-semibold">Finalité</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-[#E8E5E0]"><code>refresh_token</code></td>
                <td className="p-3 border border-[#E8E5E0]"><span className="text-[#16A34A] font-medium">Essentiel</span></td>
                <td className="p-3 border border-[#E8E5E0]">30 jours</td>
                <td className="p-3 border border-[#E8E5E0]">Maintien de la session de connexion</td>
              </tr>
              <tr className="bg-[#F5F3EF]">
                <td className="p-3 border border-[#E8E5E0]"><code>access_token</code></td>
                <td className="p-3 border border-[#E8E5E0]"><span className="text-[#16A34A] font-medium">Essentiel</span></td>
                <td className="p-3 border border-[#E8E5E0]">15 minutes</td>
                <td className="p-3 border border-[#E8E5E0]">Authentification aux API</td>
              </tr>
              <tr>
                <td className="p-3 border border-[#E8E5E0]"><code>technofind-feed</code></td>
                <td className="p-3 border border-[#E8E5E0]"><span className="text-[#16A34A] font-medium">Fonctionnel</span></td>
                <td className="p-3 border border-[#E8E5E0]">Persistant</td>
                <td className="p-3 border border-[#E8E5E0]">Préférences d'affichage, articles sauvegardés</td>
              </tr>
              <tr className="bg-[#F5F3EF]">
                <td className="p-3 border border-[#E8E5E0]"><code>technofind-auth</code></td>
                <td className="p-3 border border-[#E8E5E0]"><span className="text-[#16A34A] font-medium">Essentiel</span></td>
                <td className="p-3 border border-[#E8E5E0]">Session</td>
                <td className="p-3 border border-[#E8E5E0]">Informations de l'utilisateur connecté</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3">⚠️ {APP_NAME} n'utilise pas de cookies publicitaires ni de cookies de tracking tiers.</p>
      </Section>

      <Section title="3. Gestion des cookies">
        <p>Vous pouvez gérer vos préférences de cookies à tout moment :</p>
        <ul>
          <li><strong>Via votre navigateur :</strong> la plupart des navigateurs permettent de refuser ou supprimer les cookies dans leurs paramètres</li>
          <li><strong>Via l'application :</strong> vous pouvez supprimer votre compte et toutes vos données depuis la page Profil</li>
        </ul>
        <p>⚠️ Le refus des cookies essentiels empêchera la connexion à votre compte.</p>
      </Section>

      <Section title="4. Contact">
        <p>Pour toute question : <a href={`mailto:${CONTACT}`} className="text-accent">{CONTACT}</a></p>
      </Section>
    </div>
  );
}

// ── Helper ────────────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="font-display font-bold text-lg text-ink mb-3 pb-2 border-b border-[#E8E5E0]">
        {title}
      </h2>
      <div className="text-sm text-ink-muted leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}
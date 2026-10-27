import { NOTICES } from './shared/measurement-feedback-client.mjs';
// Local, bundled translations. User input and protocol evidence are never translated.
const KEY='arcdrake-tools-language';
let language='en';
const explicit=new URL(location.href).searchParams.get('lang');
let saved;try{saved=localStorage.getItem(KEY);}catch{}
language=['de','en'].includes(explicit)?explicit:['de','en'].includes(saved)?saved:navigator.language.toLowerCase().startsWith('de')?'de':'en';
const sources=new WeakMap(), attributes=new WeakMap();
const entries=[
 [
  "Cloudflare DNS status {0} · DNSSEC AD flag true (not an independent validation). TTL describes resolver cache lifetime, not global propagation or guaranteed freshness.",
  "Cloudflare-DNS-Status {0} · DNSSEC-AD-Flag wahr (keine unabhängige Validierung). TTL beschreibt die Cache-Lebensdauer beim Resolver, weder weltweite Verbreitung noch garantierte Aktualität."
 ],
 [
  "Cloudflare DNS status {0} · DNSSEC AD flag not true (not an independent validation). TTL describes resolver cache lifetime, not global propagation or guaranteed freshness.",
  "Cloudflare-DNS-Status {0} · DNSSEC-AD-Flag nicht wahr (keine unabhängige Validierung). TTL beschreibt die Cache-Lebensdauer beim Resolver, weder weltweite Verbreitung noch garantierte Aktualität."
 ],
 [
  "Mail DNS Check — read the records behind email",
  "Mail DNS Check — die DNS-Einträge hinter E-Mails verstehen"
 ],
 [
  "Understand a domain’s public MX, SPF, DMARC and optional DKIM records. One explicit DNS resolver, honest limits, no mail sent.",
  "Öffentliche MX-, SPF-, DMARC- und optionale DKIM-Einträge einer Domain verstehen. Ein benannter DNS-Resolver, klare Grenzen, kein E-Mail-Versand."
 ],
 [
  "For people checking public email setup",
  "Für die Prüfung öffentlicher E-Mail-Konfigurationen"
 ],
 [
  "PUBLIC RECORDS · PLAIN LANGUAGE",
  "ÖFFENTLICHE EINTRÄGE · KLARE SPRACHE"
 ],
 [
  "A domain’s email setup.",
  "Die E-Mail-Konfiguration einer Domain."
 ],
 [
  "Check the public records.",
  "Prüfe die öffentlichen Einträge."
 ],
 [
  "Domain checker",
  "Domain-Prüfung"
 ],
 [
  "What do you want to check?",
  "Was möchtest du prüfen?"
 ],
 [
  "Help with my mailbox or a missing message",
  "Hilfe mit meinem Postfach oder einer fehlenden Nachricht"
 ],
 [
  "Inspect a domain’s public email setup",
  "Öffentliche E-Mail-Konfiguration einer Domain prüfen"
 ],
 [
  "Choose an option before entering anything. An email address alone does not tell us which kind of help you need.",
  "Wähle vor der Eingabe eine Option. Eine E-Mail-Adresse allein sagt nicht, welche Hilfe du benötigst."
 ],
 [
  "Start with your mail provider’s account help",
  "Beginne bei der Kontohilfe deines E-Mail-Anbieters"
 ],
 [
  "This tool cannot inspect your account, messages or whether a particular message will arrive. This applies to every provider, including a custom work address.",
  "Dieses Werkzeug kann weder dein Konto und Nachrichten prüfen noch feststellen, ob eine bestimmte Nachricht ankommt. Das gilt für jeden Anbieter, auch für eigene Firmenadressen."
 ],
 [
  "Missing a message? Check spam, trash, filters and account storage in your mail app. Ask the sender whether they received a delivery-failure notice.",
  "Fehlt eine Nachricht? Prüfe Spam, Papierkorb, Filter und freien Kontospeicher in deiner E-Mail-App. Frage den Absender nach einer Unzustellbarkeitsmeldung."
 ],
 [
  "Cannot sign in? Open your provider’s own app or help site and use its sign-in or account-recovery steps.",
  "Anmeldung nicht möglich? Öffne die App oder Hilfeseite deines Anbieters und nutze dessen Schritte zur Anmeldung oder Kontowiederherstellung."
 ],
 [
  "For a work mailbox, give your administrator or provider the sender, recipient and approximate time so they can trace the message. A delivery-failure notice can help them identify the cause.",
  "Gib bei einem Firmenpostfach dem Administrator oder Anbieter Absender, Empfänger und ungefähre Uhrzeit zur Nachverfolgung. Eine Unzustellbarkeitsmeldung kann helfen, die Ursache zu finden."
 ],
 [
  "This mailbox-help route makes no DNS queries. If you intentionally want to inspect public domain records, choose the second option above.",
  "Diese Postfachhilfe stellt keine DNS-Anfragen. Wenn du gezielt öffentliche Domain-Einträge prüfen möchtest, wähle oben die zweite Option."
 ],
 [
  "Domain to inspect",
  "Zu prüfende Domain"
 ],
 [
  "Enter the domain you intend to inspect, such as your-restaurant.com. An email address requires a separate domain-only confirmation.",
  "Gib die gewünschte Domain ein, etwa deine-gaststaette.de. Bei einer E-Mail-Adresse ist eine zusätzliche Bestätigung für die reine Domain-Prüfung nötig."
 ],
 [
  "DKIM selector",
  "DKIM-Selektor"
 ],
 [
  "optional",
  "optional"
 ],
 [
  "From your mail provider",
  "Von deinem E-Mail-Anbieter"
 ],
 [
  "A selector identifies your provider’s signing key. Leave blank to skip DKIM.",
  "Ein Selektor bezeichnet den Signaturschlüssel deines Anbieters. Leer lassen, um DKIM zu überspringen."
 ],
 [
  "Where do I find my DKIM selector?",
  "Wo finde ich meinen DKIM-Selektor?"
 ],
 [
  "Ask your mail provider or administrator for its DKIM DNS setup. Microsoft 365 commonly uses selector1 and selector2: check each separately. Google Workspace: in the Admin console, open Gmail’s Authenticate email settings and use the selector shown there. Other providers list it in their domain-authentication settings. A sent message’s DKIM-Signature s= value also identifies its selector. Do not paste the whole DNS name or key here.",
  "Frage deinen E-Mail-Anbieter oder Administrator nach der DKIM-DNS-Konfiguration. Microsoft 365 nutzt häufig selector1 und selector2: einzeln prüfen. Bei Google Workspace öffnest du in der Admin-Konsole die Gmail-Einstellungen zur E-Mail-Authentifizierung und verwendest den dort gezeigten Selektor. Andere Anbieter zeigen ihn in den Einstellungen zur Domain-Authentifizierung. Auch der s=-Wert im DKIM-Signature-Header einer gesendeten Nachricht nennt den Selektor. Hier weder den vollständigen DNS-Namen noch den Schlüssel einfügen."
 ],
 [
  "Microsoft 365 DKIM guide",
  "Microsoft-365-Anleitung zu DKIM"
 ],
 [
  "Google Workspace DKIM guide",
  "Google-Workspace-Anleitung zu DKIM"
 ],
 [
  "On check, these DNS names are sent to",
  "Bei der Prüfung werden diese DNS-Namen an"
 ],
 [
  "Check public DNS",
  "Öffentliches DNS prüfen"
 ],
 [
  "Cancel",
  "Abbrechen"
 ],
 [
  "Clear",
  "Leeren"
 ],
 [
  "Load a fictional demo",
  "Erfundenes Beispiel laden"
 ],
 [
  "DNS observations",
  "DNS-Beobachtungen"
 ],
 [
  "These are DNS observations, not a deliverability or safety verdict. No mail is sent, no mail server is contacted, and no account is inspected.",
  "Dies sind DNS-Beobachtungen, kein Urteil über Zustellbarkeit oder Sicherheit. Es werden weder E-Mails gesendet noch Mailserver kontaktiert oder Konten geprüft."
 ],
 [
  "What to do next",
  "Nächste Schritte"
 ],
 [
  "What this check can’t tell you",
  "Was diese Prüfung nicht feststellen kann"
 ],
 [
  "Mailbox existence, SMTP availability, spam placement, reputation, DNS propagation everywhere, message authentication or whether a provider setup is correct. SPF dependencies are not followed; DMARC organizational-domain inheritance is not discovered; DKIM keys and signatures are not validated. CNAME targets may appear in the resolver answer but this tool issues no additional target queries.",
  "Ob ein Postfach existiert, SMTP verfügbar ist, Nachrichten im Spam landen, Reputation, weltweite DNS-Verbreitung, Nachrichtenauthentifizierung oder korrekte Anbieterkonfiguration. SPF-Verweise werden nicht verfolgt; DMARC-Vererbung von der Organisationsdomain wird nicht ermittelt; DKIM-Schlüssel und Signaturen werden nicht validiert. CNAME-Ziele können in der Resolver-Antwort erscheinen, werden aber nicht zusätzlich abgefragt."
 ],
 [
  "FOUR PIECES OF THE PUZZLE",
  "VIER TEILE DES PUZZLES"
 ],
 [
  "Read the records.",
  "Lies die Einträge."
 ],
 [
  "Know what to ask next.",
  "Erkenne die nächsten Fragen."
 ],
 [
  "Where incoming mail is routed. A lower preference number goes first.",
  "Wohin eingehende E-Mails geleitet werden. Kleinere Prioritätswerte werden zuerst versucht."
 ],
 [
  "Which servers may use the domain as an envelope sender.",
  "Welche Server die Domain als Envelope-Absender verwenden dürfen."
 ],
 [
  "How receivers should treat messages that fail aligned authentication.",
  "Wie Empfänger mit Nachrichten umgehen sollen, deren abgestimmte Authentifizierung fehlschlägt."
 ],
 [
  "A public key for a specific signing selector. The provider tells you the selector.",
  "Ein öffentlicher Schlüssel für einen bestimmten Signaturselektor. Den Selektor nennt der Anbieter."
 ],
 [
  "Rules & primary sources",
  "Regeln und Primärquellen"
 ],
 [
  "Bounded record summaries, based on",
  "Begrenzte Zusammenfassungen der Einträge, basierend auf"
 ],
 [
  "Cloudflare’s DoH JSON API",
  "Cloudflares DoH-JSON-API"
 ],
 [
  "SMTP routing (RFC 5321)",
  "SMTP-Routing (RFC 5321)"
 ],
 [
  "null MX (RFC 7505)",
  "Null-MX (RFC 7505)"
 ],
 [
  "and",
  "und"
 ],
 [
  "Fictional demo · no network requests",
  "Erfundenes Beispiel · keine Netzwerkanfragen"
 ],
 [
  "Live · Cloudflare 1.1.1.1",
  "Live · Cloudflare 1.1.1.1"
 ],
 [
  "Illustrative records, not current DNS",
  "Beispielhafte Einträge, keine aktuellen DNS-Daten"
 ],
 [
  "Observed {0} · snapshot only",
  "Beobachtet am {0} · nur eine Momentaufnahme"
 ],
 [
  "Check the domain spelling first",
  "Zuerst die Schreibweise der Domain prüfen"
 ],
 [
  "DNS answers unavailable: setup could not be assessed",
  "DNS-Antworten nicht verfügbar: Konfiguration konnte nicht beurteilt werden"
 ],
 [
  "What we found: configuration concerns to review",
  "Ergebnis: Konfigurationsauffälligkeiten prüfen"
 ],
 [
  "Some checks could not be completed",
  "Einige Prüfungen konnten nicht abgeschlossen werden"
 ],
 [
  "Some records were not found or need a closer look",
  "Einige Einträge fehlen hier oder erfordern eine genauere Prüfung"
 ],
 [
  "What we found in public DNS",
  "Was wir im öffentlichen DNS gefunden haben"
 ],
 [
  "Resolve the domain-name issue before interpreting this check.",
  "Kläre das Problem mit dem Domainnamen, bevor du diese Prüfung auswertest."
 ],
 [
  "Published routing destination: {0}. These hosts are not tested.",
  "Veröffentlichtes Routing-Ziel: {0}. Diese Hosts wurden nicht getestet."
 ],
 [
  "Published routing destinations: {0}. These hosts are not tested.",
  "Veröffentlichte Routing-Ziele: {0}. Diese Hosts wurden nicht getestet."
 ],
 [
  "Signing key candidate found for the supplied selector. Key syntax and message signatures were not validated.",
  "Möglicher Signaturschlüssel für den angegebenen Selektor gefunden. Schlüsselsyntax und Nachrichtensignaturen wurden nicht validiert."
 ],
 [
  "Skipped because no selector was supplied. This does not mean a key is missing.",
  "Übersprungen, da kein Selektor angegeben wurde. Das bedeutet nicht, dass ein Schlüssel fehlt."
 ],
 [
  "{0} unrelated TXT record(s) retained in raw evidence.",
  "{0} nicht zugehörige TXT-Einträge bleiben im Rohbeleg erhalten."
 ],
 [
  "Published records",
  "Veröffentlichte Einträge"
 ],
 [
  "Next useful step",
  "Nächster sinnvoller Schritt"
 ],
 [
  "Raw resolver evidence",
  "Unverarbeiteter Resolver-Beleg"
 ],
 [
  "Demo values are invented.",
  "Beispielwerte sind erfunden."
 ],
 [
  "{0} · {1} · fictional fixture",
  "{0} · {1} · erfundene Testdaten"
 ],
 [
  "Cloudflare DNS status {0} · DNSSEC AD flag {1} (not an independent validation). TTL describes resolver cache lifetime, not global propagation or guaranteed freshness.",
  "Cloudflare-DNS-Status {0} · DNSSEC-AD-Flag {1} (keine unabhängige Validierung). TTL beschreibt die Cache-Lebensdauer beim Resolver, weder weltweite Verbreitung noch garantierte Aktualität."
 ],
 [
  "Choose whether you need mailbox help or intend to inspect public domain records first.",
  "Wähle zuerst Postfachhilfe oder die gezielte Prüfung öffentlicher Domain-Einträge."
 ],
 [
  "No DNS query was made.",
  "Es wurde keine DNS-Anfrage gestellt."
 ],
 [
  "{0} is managed by its email provider. Its DNS report cannot evaluate your account or explain a missing message. For mailbox help, choose the first option above. {1}",
  "{0} wird vom E-Mail-Anbieter verwaltet. Ein DNS-Bericht kann dein Konto nicht bewerten oder eine fehlende Nachricht erklären. Wähle oben die erste Option für Postfachhilfe. {1}"
 ],
 [
  "You chose public DNS inspection. This checks public records for {0}, not this mailbox, and does not establish that you control the domain. Compare results with provider setup instructions; changes require the DNS administrator. If you need help with your account or a message, choose mailbox help instead. Only the domain will be sent to the resolver.",
  "Du hast die öffentliche DNS-Prüfung gewählt. Geprüft werden öffentliche Einträge für {0}, nicht dieses Postfach; die Kontrolle über die Domain wird nicht bestätigt. Vergleiche die Ergebnisse mit Anbieteranleitungen; Änderungen erfordern die DNS-Administration. Bei Konto- oder Nachrichtenproblemen wähle die Postfachhilfe. Nur die Domain wird an den Resolver gesendet."
 ],
 [
  "Inspect {0} DNS only",
  "Nur DNS von {0} prüfen"
 ],
 [
  "Confirm the domain-only inspection, or choose mailbox help. No DNS query was made.",
  "Bestätige die reine Domain-Prüfung oder wähle Postfachhilfe. Es wurde keine DNS-Anfrage gestellt."
 ],
 [
  "Domain plus DKIM selector is too long.",
  "Domain und DKIM-Selektor sind zusammen zu lang."
 ],
 [
  "Checking {0} with Cloudflare…",
  "{0} wird über Cloudflare geprüft…"
 ],
 [
  "Check finished. Read each observation and its limits below.",
  "Prüfung abgeschlossen. Lies unten die Beobachtungen und ihre Grenzen."
 ],
 [
  "Public DNS inspection selected. No query until you explicitly check.",
  "Öffentliche DNS-Prüfung gewählt. Anfragen erfolgen erst nach deinem Prüfauftrag."
 ],
 [
  "Mailbox help selected. This help makes no DNS queries.",
  "Postfachhilfe gewählt. Diese Hilfe stellt keine DNS-Anfragen."
 ],
 [
  "Cancelled. No results from this check will be shown.",
  "Abgebrochen. Ergebnisse dieser Prüfung werden nicht angezeigt."
 ],
 [
  "Fictional demo loaded. No DNS query was made.",
  "Erfundenes Beispiel geladen. Es wurde keine DNS-Anfrage gestellt."
 ],
 [
  "Enter a domain, or an email address such as you@your-restaurant.com.",
  "Gib eine Domain oder eine E-Mail-Adresse wie du@deine-gaststaette.de ein."
 ],
 [
  "Check the domain after @ in your email address, such as you@your-restaurant.com.",
  "Prüfe die Domain nach @ in deiner E-Mail-Adresse, etwa du@deine-gaststaette.de."
 ],
 [
  "Enter a domain only, such as example.com. No email address, URL or IP address.",
  "Gib nur eine Domain wie example.com ein. Keine E-Mail-, URL- oder IP-Adresse."
 ],
 [
  "That domain cannot be parsed.",
  "Diese Domain konnte nicht verarbeitet werden."
 ],
 [
  "Use a public DNS domain with valid labels; local names and IP addresses are excluded.",
  "Verwende eine öffentliche DNS-Domain mit gültigen Bezeichnungen; lokale Namen und IP-Adressen sind ausgeschlossen."
 ],
 [
  "Enter only the selector before ._domainkey, for example selector1.",
  "Gib nur den Selektor vor ._domainkey ein, etwa selector1."
 ],
 [
  "Use the DKIM selector from your mail provider, without @, spaces or a URL.",
  "Verwende den DKIM-Selektor deines E-Mail-Anbieters, ohne @, Leerzeichen oder URL."
 ],
 [
  "DKIM selector is too long.",
  "Der DKIM-Selektor ist zu lang."
 ],
 [
  "Unrecognized TXT presentation.",
  "Nicht erkannte TXT-Darstellung."
 ],
 [
  "Invalid TXT byte escape.",
  "Ungültige TXT-Byte-Escapesequenz."
 ],
 [
  "Incomplete TXT escape.",
  "Unvollständige TXT-Escapesequenz."
 ],
 [
  "Incomplete TXT string.",
  "Unvollständige TXT-Zeichenfolge."
 ],
 [
  "Not checked",
  "Nicht geprüft"
 ],
 [
  "Selector needed",
  "Selektor erforderlich"
 ],
 [
  "DKIM keys live at a selector supplied by your provider. Enter it above; this tool never guesses selectors.",
  "DKIM-Schlüssel liegen unter einem Selektor deines Anbieters. Gib ihn oben ein; dieses Werkzeug errät keine Selektoren."
 ],
 [
  "Open the selector guide above. Microsoft 365 commonly uses selector1 and selector2; check each separately. A skipped check says nothing about whether keys exist.",
  "Öffne oben die Selektorhilfe. Microsoft 365 nutzt häufig selector1 und selector2; einzeln prüfen. Eine übersprungene Prüfung sagt nichts darüber aus, ob Schlüssel existieren."
 ],
 [
  "Domain not found",
  "Domain nicht gefunden"
 ],
 [
  "Resolver reports this domain name was not found",
  "Der Resolver meldet diesen Domainnamen als nicht gefunden"
 ],
 [
  "The entered domain name returned NXDOMAIN. This is not an absent mail record or an MX fallback configuration.",
  "Der eingegebene Domainname lieferte NXDOMAIN. Das ist weder ein fehlender E-Mail-Eintrag noch eine MX-Fallback-Konfiguration."
 ],
 [
  "Check the domain spelling first. If it is correct, ask your DNS provider about the domain’s public DNS status.",
  "Prüfe zuerst die Schreibweise. Ist sie korrekt, frage den DNS-Anbieter nach dem öffentlichen DNS-Status der Domain."
 ],
 [
  "Unavailable",
  "Nicht verfügbar"
 ],
 [
  "No usable resolver answer",
  "Keine verwertbare Resolver-Antwort"
 ],
 [
  "DNS status {0}. This is not evidence that the record is missing.",
  "DNS-Status {0}. Dies belegt nicht, dass der Eintrag fehlt."
 ],
 [
  "Retry later or compare with your authoritative DNS provider.",
  "Später erneut versuchen oder mit dem zuständigen DNS-Anbieter vergleichen."
 ],
 [
  "Tool limitation",
  "Werkzeuggrenze"
 ],
 [
  "TXT format not interpreted by this tool",
  "Dieses Werkzeug kann das TXT-Format nicht auswerten"
 ],
 [
  "Read the raw response and compare with your DNS provider.",
  "Lies die Rohantwort und vergleiche sie mit deinem DNS-Anbieter."
 ],
 [
  "Intentional",
  "Absichtlich"
 ],
 [
  "Needs attention",
  "Prüfung erforderlich"
 ],
 [
  "This domain announces no incoming mail",
  "Diese Domain erklärt, keine E-Mails anzunehmen"
 ],
 [
  "Null MX mixed with other MX records",
  "Null-MX mit anderen MX-Einträgen vermischt"
 ],
 [
  "A sole “0 .” MX intentionally declines incoming email. It is not a broken mailbox.",
  "Ein einzelner MX-Eintrag „0 .“ lehnt eingehende E-Mails bewusst ab. Das ist kein defektes Postfach."
 ],
 [
  "If receiving mail is intended, ask the domain owner about this policy.",
  "Falls E-Mail-Empfang beabsichtigt ist, frage den Domaininhaber nach dieser Richtlinie."
 ],
 [
  "Ask the DNS administrator to resolve the conflicting MX configuration.",
  "Bitte die DNS-Administration, den MX-Konflikt zu lösen."
 ],
 [
  "Observed",
  "Beobachtet"
 ],
 [
  "{0} mail routing record",
  "{0} E-Mail-Routing-Eintrag"
 ],
 [
  "{0} mail routing records",
  "{0} E-Mail-Routing-Einträge"
 ],
 [
  "Lower preference numbers are tried first. DNS routing does not prove that these servers or a mailbox accept mail.",
  "Kleinere Prioritätswerte werden zuerst versucht. DNS-Routing beweist nicht, dass diese Server oder ein Postfach E-Mails annehmen."
 ],
 [
  "Compare these hosts with your mail provider’s setup instructions.",
  "Vergleiche diese Hosts mit den Konfigurationsanleitungen deines E-Mail-Anbieters."
 ],
 [
  "Incomplete",
  "Unvollständig"
 ],
 [
  "No explicit MX observed",
  "Kein ausdrücklicher MX-Eintrag beobachtet"
 ],
 [
  "SMTP can fall back to this domain’s A/AAAA addresses when MX is absent. This tool does not query fallback addresses or connect to mail servers.",
  "SMTP kann bei fehlendem MX auf A/AAAA-Adressen der Domain zurückgreifen. Dieses Werkzeug fragt solche Ersatzadressen nicht ab und verbindet sich nicht mit Mailservern."
 ],
 [
  "Check whether implicit address fallback is intentional with your DNS administrator.",
  "Kläre mit der DNS-Administration, ob der implizite Adress-Fallback beabsichtigt ist."
 ],
 [
  "Multiple {0} candidate records",
  "Mehrere mögliche {0}-Einträge"
 ],
 [
  "Multiple policy/key candidates require administrator review; this tool cannot choose one.",
  "Mehrere mögliche Richtlinien oder Schlüssel erfordern eine Prüfung durch die Administration; dieses Werkzeug kann keinen auswählen."
 ],
 [
  "Compare the raw TXT records with your provider’s intended single policy/key.",
  "Vergleiche die unverarbeiteten TXT-Einträge mit der vorgesehenen einzelnen Richtlinie oder dem Schlüssel deines Anbieters."
 ],
 [
  "Not found here",
  "Hier nicht gefunden"
 ],
 [
  "No {0} candidate observed",
  "Kein möglicher {0}-Eintrag beobachtet"
 ],
 [
  "No exact-domain DMARC policy was found. A policy may be inherited from the organizational domain; public-suffix discovery and inheritance are not checked.",
  "Keine DMARC-Richtlinie für genau diese Domain gefunden. Eine Richtlinie kann von der Organisationsdomain geerbt werden; öffentliche Suffixe und Vererbung werden nicht geprüft."
 ],
 [
  "A CNAME alias was returned, but no recognizable key appeared in this resolver answer. This tool does not issue another target query. Other selectors may exist.",
  "Ein CNAME-Alias wurde geliefert, aber kein erkennbarer Schlüssel in dieser Resolver-Antwort. Dieses Werkzeug fragt das Ziel nicht zusätzlich ab. Andere Selektoren können existieren."
 ],
 [
  "No recognizable key was found at this exact selector. Other selectors may exist.",
  "Unter genau diesem Selektor wurde kein erkennbarer Schlüssel gefunden. Andere Selektoren können existieren."
 ],
 [
  "No SPF policy was found among the returned TXT records. This is not a message authentication result.",
  "In den gelieferten TXT-Einträgen wurde keine SPF-Richtlinie gefunden. Dies ist kein Ergebnis einer Nachrichtenauthentifizierung."
 ],
 [
  "Check the organizational domain policy with your mail administrator.",
  "Prüfe mit deiner E-Mail-Administration die Richtlinie der Organisationsdomain."
 ],
 [
  "Confirm the exact selector and DNS name with your provider.",
  "Bestätige den genauen Selektor und DNS-Namen mit deinem Anbieter."
 ],
 [
  "Ask your sending provider for its SPF publishing instructions.",
  "Frage deinen Versandanbieter nach den Anleitungen zur SPF-Veröffentlichung."
 ],
 [
  "This policy permits any sender with all; ask your provider whether that is intentional.",
  "Diese Richtlinie erlaubt mit all jeden Absender; frage deinen Anbieter, ob das beabsichtigt ist."
 ],
 [
  "~all asks receivers to treat other senders as a soft fail; it does not say a message failed.",
  "~all bittet Empfänger, andere Absender als Softfail zu behandeln; es besagt nicht, dass eine Nachricht fehlgeschlagen ist."
 ],
 [
  "-all says other senders should fail SPF; this does not test an actual message.",
  "-all legt fest, dass andere Absender SPF nicht bestehen sollen; es wird keine tatsächliche Nachricht geprüft."
 ],
 [
  "?all makes no authorization assertion about other senders.",
  "?all trifft keine Berechtigungsaussage zu anderen Absendern."
 ],
 [
  "The policy redirects evaluation to another policy, which this tool does not follow.",
  "Die Richtlinie leitet die Auswertung an eine andere Richtlinie weiter, der dieses Werkzeug nicht folgt."
 ],
 [
  "No all or redirect term was found; senders that do not match a mechanism normally receive a neutral result.",
  "Kein all- oder redirect-Ausdruck gefunden; Absender, auf die kein Mechanismus passt, erhalten normalerweise ein neutrales Ergebnis."
 ],
 [
  "Records found",
  "Einträge gefunden"
 ],
 [
  "Sending policy permits any sender",
  "Versandrichtlinie erlaubt jeden Absender"
 ],
 [
  "Sending policy published",
  "Versandrichtlinie veröffentlicht"
 ],
 [
  "Ask your sending provider to review the all mechanism before changing this policy.",
  "Bitte deinen Versandanbieter vor einer Änderung, den all-Mechanismus zu prüfen."
 ],
 [
  "Compare the policy with all intended senders before changing it.",
  "Vergleiche die Richtlinie vor einer Änderung mit allen vorgesehenen Absendern."
 ],
 [
  "Monitoring only: no quarantine or rejection requested",
  "Nur Beobachtung: weder Quarantäne noch Ablehnung angefordert"
 ],
 [
  "Failing messages should be treated as suspicious",
  "Fehlschlagende Nachrichten sollen als verdächtig behandelt werden"
 ],
 [
  "Failing messages should be rejected",
  "Fehlschlagende Nachrichten sollen abgelehnt werden"
 ],
 [
  "Unrecognized DMARC policy: {0}",
  "Nicht erkannte DMARC-Richtlinie: {0}"
 ],
 [
  "DMARC candidate has no p= policy",
  "Möglicher DMARC-Eintrag hat keine p=-Richtlinie"
 ],
 [
  "Duplicate tags need administrator review.",
  "Doppelte Tags erfordern eine Prüfung durch die Administration."
 ],
 [
  "Ask your mail provider for a valid DMARC policy and compare it with the published record.",
  "Frage deinen E-Mail-Anbieter nach einer gültigen DMARC-Richtlinie und vergleiche sie mit dem veröffentlichten Eintrag."
 ],
 [
  "Check alignment and reports with your mail provider; do not strengthen policy blindly.",
  "Prüfe Domain-Abgleich und Berichte mit deinem E-Mail-Anbieter; verschärfe die Richtlinie nicht unüberlegt."
 ],
 [
  "DKIM key is revoked",
  "DKIM-Schlüssel ist widerrufen"
 ],
 [
  "DKIM candidate observed · not validated",
  "Möglicher DKIM-Eintrag beobachtet · nicht validiert"
 ],
 [
  "A p= value publishes a key; an empty p= revokes it. Cryptographic key syntax and message signatures are not validated.",
  "Ein p=-Wert veröffentlicht einen Schlüssel; ein leeres p= widerruft ihn. Kryptografische Schlüsselsyntax und Nachrichtensignaturen werden nicht validiert."
 ],
 [
  "Confirm the selector and active key with your provider; inspect an actual sent message’s authentication results.",
  "Bestätige Selektor und aktiven Schlüssel mit deinem Anbieter und prüfe die Authentifizierungsergebnisse einer tatsächlich gesendeten Nachricht."
 ],
 [
  "Resolver HTTP {0}",
  "Resolver-HTTP-Status {0}"
 ],
 [
  "Resolver response exceeded 64 KiB.",
  "Die Resolver-Antwort überschritt 64 KiB."
 ],
 [
  "Resolver response schema was not recognized.",
  "Das Antwortschema des Resolvers wurde nicht erkannt."
 ],
 [
  "Request cancelled or reached the 12-second deadline.",
  "Anfrage abgebrochen oder 12-Sekunden-Frist erreicht."
 ],
 [
  "Request unavailable: {0}",
  "Anfrage nicht verfügbar: {0}"
 ],
 [
  "Incoming mail — Needs attention:",
  "Eingehende E-Mails — Prüfung erforderlich:"
 ],
 [
  "Incoming mail — Unavailable:",
  "Eingehende E-Mails — Nicht verfügbar:"
 ],
 [
  "Incoming mail — Tool limitation:",
  "Eingehende E-Mails — Werkzeuggrenze:"
 ],
 [
  "Incoming mail — Not found here:",
  "Eingehende E-Mails — Hier nicht gefunden:"
 ],
 [
  "Incoming mail — Incomplete:",
  "Eingehende E-Mails — Unvollständig:"
 ],
 [
  "Incoming mail — Domain not found:",
  "Eingehende E-Mails — Domain nicht gefunden:"
 ],
 [
  "Incoming mail — Observed:",
  "Eingehende E-Mails — Beobachtet:"
 ],
 [
  "Incoming mail — Records found:",
  "Eingehende E-Mails — Einträge gefunden:"
 ],
 [
  "Incoming mail — Not checked:",
  "Eingehende E-Mails — Nicht geprüft:"
 ],
 [
  "Incoming mail — Intentional:",
  "Eingehende E-Mails — Absichtlich:"
 ],
 [
  "Sending permission — Needs attention:",
  "Versandberechtigung — Prüfung erforderlich:"
 ],
 [
  "Sending permission — Unavailable:",
  "Versandberechtigung — Nicht verfügbar:"
 ],
 [
  "Sending permission — Tool limitation:",
  "Versandberechtigung — Werkzeuggrenze:"
 ],
 [
  "Sending permission — Not found here:",
  "Versandberechtigung — Hier nicht gefunden:"
 ],
 [
  "Sending permission — Incomplete:",
  "Versandberechtigung — Unvollständig:"
 ],
 [
  "Sending permission — Domain not found:",
  "Versandberechtigung — Domain nicht gefunden:"
 ],
 [
  "Sending permission — Observed:",
  "Versandberechtigung — Beobachtet:"
 ],
 [
  "Sending permission — Records found:",
  "Versandberechtigung — Einträge gefunden:"
 ],
 [
  "Sending permission — Not checked:",
  "Versandberechtigung — Nicht geprüft:"
 ],
 [
  "Sending permission — Intentional:",
  "Versandberechtigung — Absichtlich:"
 ],
 [
  "Policy for failing messages — Needs attention:",
  "Richtlinie für fehlschlagende Nachrichten — Prüfung erforderlich:"
 ],
 [
  "Policy for failing messages — Unavailable:",
  "Richtlinie für fehlschlagende Nachrichten — Nicht verfügbar:"
 ],
 [
  "Policy for failing messages — Tool limitation:",
  "Richtlinie für fehlschlagende Nachrichten — Werkzeuggrenze:"
 ],
 [
  "Policy for failing messages — Not found here:",
  "Richtlinie für fehlschlagende Nachrichten — Hier nicht gefunden:"
 ],
 [
  "Policy for failing messages — Incomplete:",
  "Richtlinie für fehlschlagende Nachrichten — Unvollständig:"
 ],
 [
  "Policy for failing messages — Domain not found:",
  "Richtlinie für fehlschlagende Nachrichten — Domain nicht gefunden:"
 ],
 [
  "Policy for failing messages — Observed:",
  "Richtlinie für fehlschlagende Nachrichten — Beobachtet:"
 ],
 [
  "Policy for failing messages — Records found:",
  "Richtlinie für fehlschlagende Nachrichten — Einträge gefunden:"
 ],
 [
  "Policy for failing messages — Not checked:",
  "Richtlinie für fehlschlagende Nachrichten — Nicht geprüft:"
 ],
 [
  "Policy for failing messages — Intentional:",
  "Richtlinie für fehlschlagende Nachrichten — Absichtlich:"
 ],
 [
  "Signing key — Needs attention:",
  "Signaturschlüssel — Prüfung erforderlich:"
 ],
 [
  "Signing key — Unavailable:",
  "Signaturschlüssel — Nicht verfügbar:"
 ],
 [
  "Signing key — Tool limitation:",
  "Signaturschlüssel — Werkzeuggrenze:"
 ],
 [
  "Signing key — Not found here:",
  "Signaturschlüssel — Hier nicht gefunden:"
 ],
 [
  "Signing key — Incomplete:",
  "Signaturschlüssel — Unvollständig:"
 ],
 [
  "Signing key — Domain not found:",
  "Signaturschlüssel — Domain nicht gefunden:"
 ],
 [
  "Signing key — Observed:",
  "Signaturschlüssel — Beobachtet:"
 ],
 [
  "Signing key — Records found:",
  "Signaturschlüssel — Einträge gefunden:"
 ],
 [
  "Signing key — Not checked:",
  "Signaturschlüssel — Nicht geprüft:"
 ],
 [
  "Signing key — Intentional:",
  "Signaturschlüssel — Absichtlich:"
 ],
 [
  "SPF lists permitted sending services. This policy permits any sender with all; ask your provider whether that is intentional. This tool does not follow includes or evaluate senders, macros or lookup limits; that is a tool limitation, not incomplete setup.",
  "SPF nennt zulässige Versanddienste. Diese Richtlinie erlaubt mit all jeden Absender; frage deinen Anbieter, ob das beabsichtigt ist. Dieses Werkzeug verfolgt keine include-Verweise und wertet weder Absender, Makros noch Abfragegrenzen aus; das ist eine Werkzeuggrenze, keine unvollständige Konfiguration."
 ],
 [
  "Sending policy published: This policy permits any sender with all; ask your provider whether that is intentional.",
  "Versandrichtlinie veröffentlicht: Diese Richtlinie erlaubt mit all jeden Absender; frage deinen Anbieter, ob das beabsichtigt ist."
 ],
 [
  "Sending policy permits any sender: This policy permits any sender with all; ask your provider whether that is intentional.",
  "Versandrichtlinie erlaubt jeden Absender: Diese Richtlinie erlaubt mit all jeden Absender; frage deinen Anbieter, ob das beabsichtigt ist."
 ],
 [
  "SPF lists permitted sending services. ~all asks receivers to treat other senders as a soft fail; it does not say a message failed. This tool does not follow includes or evaluate senders, macros or lookup limits; that is a tool limitation, not incomplete setup.",
  "SPF nennt zulässige Versanddienste. ~all bittet Empfänger, andere Absender als Softfail zu behandeln; es besagt nicht, dass eine Nachricht fehlgeschlagen ist. Dieses Werkzeug verfolgt keine include-Verweise und wertet weder Absender, Makros noch Abfragegrenzen aus; das ist eine Werkzeuggrenze, keine unvollständige Konfiguration."
 ],
 [
  "Sending policy published: ~all asks receivers to treat other senders as a soft fail; it does not say a message failed.",
  "Versandrichtlinie veröffentlicht: ~all bittet Empfänger, andere Absender als Softfail zu behandeln; es besagt nicht, dass eine Nachricht fehlgeschlagen ist."
 ],
 [
  "Sending policy permits any sender: ~all asks receivers to treat other senders as a soft fail; it does not say a message failed.",
  "Versandrichtlinie erlaubt jeden Absender: ~all bittet Empfänger, andere Absender als Softfail zu behandeln; es besagt nicht, dass eine Nachricht fehlgeschlagen ist."
 ],
 [
  "SPF lists permitted sending services. -all says other senders should fail SPF; this does not test an actual message. This tool does not follow includes or evaluate senders, macros or lookup limits; that is a tool limitation, not incomplete setup.",
  "SPF nennt zulässige Versanddienste. -all legt fest, dass andere Absender SPF nicht bestehen sollen; es wird keine tatsächliche Nachricht geprüft. Dieses Werkzeug verfolgt keine include-Verweise und wertet weder Absender, Makros noch Abfragegrenzen aus; das ist eine Werkzeuggrenze, keine unvollständige Konfiguration."
 ],
 [
  "Sending policy published: -all says other senders should fail SPF; this does not test an actual message.",
  "Versandrichtlinie veröffentlicht: -all legt fest, dass andere Absender SPF nicht bestehen sollen; es wird keine tatsächliche Nachricht geprüft."
 ],
 [
  "Sending policy permits any sender: -all says other senders should fail SPF; this does not test an actual message.",
  "Versandrichtlinie erlaubt jeden Absender: -all legt fest, dass andere Absender SPF nicht bestehen sollen; es wird keine tatsächliche Nachricht geprüft."
 ],
 [
  "SPF lists permitted sending services. ?all makes no authorization assertion about other senders. This tool does not follow includes or evaluate senders, macros or lookup limits; that is a tool limitation, not incomplete setup.",
  "SPF nennt zulässige Versanddienste. ?all trifft keine Berechtigungsaussage zu anderen Absendern. Dieses Werkzeug verfolgt keine include-Verweise und wertet weder Absender, Makros noch Abfragegrenzen aus; das ist eine Werkzeuggrenze, keine unvollständige Konfiguration."
 ],
 [
  "Sending policy published: ?all makes no authorization assertion about other senders.",
  "Versandrichtlinie veröffentlicht: ?all trifft keine Berechtigungsaussage zu anderen Absendern."
 ],
 [
  "Sending policy permits any sender: ?all makes no authorization assertion about other senders.",
  "Versandrichtlinie erlaubt jeden Absender: ?all trifft keine Berechtigungsaussage zu anderen Absendern."
 ],
 [
  "SPF lists permitted sending services. The policy redirects evaluation to another policy, which this tool does not follow. This tool does not follow includes or evaluate senders, macros or lookup limits; that is a tool limitation, not incomplete setup.",
  "SPF nennt zulässige Versanddienste. Die Richtlinie leitet die Auswertung an eine andere Richtlinie weiter, der dieses Werkzeug nicht folgt. Dieses Werkzeug verfolgt keine include-Verweise und wertet weder Absender, Makros noch Abfragegrenzen aus; das ist eine Werkzeuggrenze, keine unvollständige Konfiguration."
 ],
 [
  "Sending policy published: The policy redirects evaluation to another policy, which this tool does not follow.",
  "Versandrichtlinie veröffentlicht: Die Richtlinie leitet die Auswertung an eine andere Richtlinie weiter, der dieses Werkzeug nicht folgt."
 ],
 [
  "Sending policy permits any sender: The policy redirects evaluation to another policy, which this tool does not follow.",
  "Versandrichtlinie erlaubt jeden Absender: Die Richtlinie leitet die Auswertung an eine andere Richtlinie weiter, der dieses Werkzeug nicht folgt."
 ],
 [
  "SPF lists permitted sending services. No all or redirect term was found; senders that do not match a mechanism normally receive a neutral result. This tool does not follow includes or evaluate senders, macros or lookup limits; that is a tool limitation, not incomplete setup.",
  "SPF nennt zulässige Versanddienste. Kein all- oder redirect-Ausdruck gefunden; Absender, auf die kein Mechanismus passt, erhalten normalerweise ein neutrales Ergebnis. Dieses Werkzeug verfolgt keine include-Verweise und wertet weder Absender, Makros noch Abfragegrenzen aus; das ist eine Werkzeuggrenze, keine unvollständige Konfiguration."
 ],
 [
  "Sending policy published: No all or redirect term was found; senders that do not match a mechanism normally receive a neutral result.",
  "Versandrichtlinie veröffentlicht: Kein all- oder redirect-Ausdruck gefunden; Absender, auf die kein Mechanismus passt, erhalten normalerweise ein neutrales Ergebnis."
 ],
 [
  "Sending policy permits any sender: No all or redirect term was found; senders that do not match a mechanism normally receive a neutral result.",
  "Versandrichtlinie erlaubt jeden Absender: Kein all- oder redirect-Ausdruck gefunden; Absender, auf die kein Mechanismus passt, erhalten normalerweise ein neutrales Ergebnis."
 ],
 [
  "DMARC compares authenticated domains with the visible From address. This summary does not test messages or fully validate the policy.",
  "DMARC gleicht authentifizierte Domains mit der sichtbaren From-Adresse ab. Diese Zusammenfassung prüft weder Nachrichten noch die vollständige Gültigkeit der Richtlinie."
 ],
 [
  "Monitoring only: p=none requests no quarantine or rejection for messages failing DMARC. It can be an intentional first step while reviewing reports. DMARC compares authenticated domains with the visible From address. This summary does not test messages or fully validate the policy.",
  "Nur Beobachtung: p=none fordert bei DMARC-Fehlschlägen weder Quarantäne noch Ablehnung an. Das kann während der Berichtsauswertung ein bewusster erster Schritt sein. DMARC gleicht authentifizierte Domains mit der sichtbaren From-Adresse ab. Diese Zusammenfassung prüft weder Nachrichten noch die vollständige Gültigkeit der Richtlinie."
 ],
 [
  "p=quarantine asks receivers to treat failing messages as suspicious. DMARC compares authenticated domains with the visible From address. This summary does not test messages or fully validate the policy.",
  "p=quarantine bittet Empfänger, fehlschlagende Nachrichten als verdächtig zu behandeln. DMARC gleicht authentifizierte Domains mit der sichtbaren From-Adresse ab. Diese Zusammenfassung prüft weder Nachrichten noch die vollständige Gültigkeit der Richtlinie."
 ],
 [
  "p=reject asks receivers to reject messages failing DMARC. DMARC compares authenticated domains with the visible From address. This summary does not test messages or fully validate the policy.",
  "p=reject bittet Empfänger, Nachrichten mit DMARC-Fehlschlag abzulehnen. DMARC gleicht authentifizierte Domains mit der sichtbaren From-Adresse ab. Diese Zusammenfassung prüft weder Nachrichten noch die vollständige Gültigkeit der Richtlinie."
 ],
 [
  "DNS status {0} · truncated response. This is not evidence that the record is missing.",
  "DNS-Status {0} · gekürzte Antwort. Dies belegt nicht, dass der Eintrag fehlt."
 ],
 [
  "{0} is managed by its email provider. Its DNS report cannot evaluate your account or explain a missing message. For mailbox help, choose the first option above.",
  "{0} wird vom E-Mail-Anbieter verwaltet. Ein DNS-Bericht kann dein Konto nicht bewerten oder eine fehlende Nachricht erklären. Wähle oben die erste Option für Postfachhilfe."
 ],
 [
  "The request was unavailable. Check your connection or retry later. Raw diagnostic details remain below.",
  "Die Anfrage war nicht verfügbar. Prüfe deine Verbindung oder versuche es später erneut. Die unverarbeiteten Diagnosedaten stehen unten."
 ]
];
// Shared notices stay in sync with the copied client; drafts are never rebuilt.
entries.push(...Object.keys(NOTICES.en).map(key => [NOTICES.en[key].trim(), NOTICES.de[key].trim()]));
entries.push([NOTICES.en.sent + "{0}", NOTICES.de.sent + "{0}"]);
entries.push(...[
 [
  "Compare a domain’s public email records with your provider’s instructions. Need account or missing-message help? Choose mailbox help below.",
  "Vergleiche die öffentlichen E-Mail-Einträge einer Domain mit den Anleitungen deines Anbieters. Geht es um dein Konto oder eine fehlende Nachricht? Wähle unten die Postfachhilfe."
 ],
 [
  "Explore without a DNS request.",
  "Ausprobieren ohne DNS-Abfrage."
 ],
 [
  "Public inspection does not require domain ownership. Changing records requires the DNS administrator. Results cannot tell whether a mailbox works.",
  "Die öffentliche Abfrage erfordert keinen Domainbesitz. Änderungen erfordern den DNS-Administrator. Die Ergebnisse sagen nicht, ob ein Postfach funktioniert."
 ],
 [
  ", the only resolver used. Cloudflare receives the DNS names and your public IP address. Domains, selectors and results are not saved by this app.",
  ", den einzigen verwendeten Resolver. Cloudflare erhält die DNS-Namen und deine öffentliche IP-Adresse. Domains, Selektoren und Ergebnisse werden von dieser App nicht gespeichert."
 ],
 [
  "Feedback & optional usage counts",
  "Feedback und optionale Nutzungszählung"
 ],
 [
  "Feedback and usage counts may be unavailable on this page. An unconfirmed send keeps your text in the form, even if storage succeeded. There is no automatic retry. The DNS checker and fictional demo work independently.",
  "Feedback und Nutzungszählung sind auf dieser Seite möglicherweise nicht verfügbar. Bei unbestätigtem Versand bleibt dein Text im Formular, auch wenn die Speicherung erfolgreich war. Es gibt keinen automatischen Neuversuch. DNS-Prüfung und fiktive Demo funktionieren unabhängig davon."
 ],
 [
  "Usage counts are unavailable on this page.",
  "Nutzungszählungen sind auf dieser Seite nicht verfügbar."
 ],
 [
  "One resolver. No background DNS checks. No saved DNS history or cookies. Language and usage-count preferences may be saved in this browser.",
  "Ein Resolver. Keine DNS-Abfragen im Hintergrund. Kein gespeicherter DNS-Verlauf und keine Cookies. Sprach- und Zählungseinstellungen können in diesem Browser gespeichert werden."
 ],
 [
  "Cleared. Domain, selector and results were not saved.",
  "Geleert. Domain, Selektor und Ergebnisse wurden nicht gespeichert."
 ],
 [
  "Feedback requires JavaScript.",
  "Feedback erfordert JavaScript."
 ]
]);
const patterns=entries.filter(([s])=>s.includes('{0}')).map(([s,t])=>[new RegExp('^'+s.split(/(\{\d+\})/).map(v=>/^\{\d+\}$/.test(v)?'(.*?)':v.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('')+'$','s'),t]);
const exact=new Map(entries);
export function translate(value){const raw=String(value);if(language!=='de')return raw;const s=raw.trim();if(!s)return raw;let output=exact.get(s);if(output===undefined){for(const [pattern,target] of patterns){const match=s.match(pattern);if(match){output=target.replace(/\{(\d+)\}/g,(_,i)=>match[Number(i)+1]);break;}}}return output===undefined?raw:raw.replace(s,()=>output);}
export const getLanguage=()=>language;
export function translateHTML(html){const doc=new DOMParser().parseFromString(html,'text/html');const walker=doc.createTreeWalker(doc.documentElement,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const n=walker.currentNode;if(n.parentElement.closest('style,script,[data-l10n-raw]:not([data-l10n-raw="false"])'))continue;const v=n.nodeValue.trim();if(v)n.nodeValue=n.nodeValue.replace(v,()=>translate(v));}doc.documentElement.lang=language;return '<!doctype html>'+doc.documentElement.outerHTML;}
function text(node){const old=sources.get(node);const value=node.nodeValue;if(old&&value===old.output){node.nodeValue=language==='de'?old.output:old.source;old.output=node.nodeValue;if(language==='de')old.output=node.nodeValue=translate(old.source);return;}const trimmed=value.trim();if(!trimmed)return;const translated=translate(trimmed);const output=value.replace(trimmed,()=>translated);sources.set(node,{source:value,output});node.nodeValue=output;}
function refresh(){observer.disconnect();const walker=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const n=walker.currentNode;if(!n.parentElement.closest('script,style,textarea,pre,[data-l10n-raw]:not([data-l10n-raw="false"]),.arcdrake-collection-nav'))text(n);}for(const el of document.querySelectorAll('[aria-label],[placeholder],meta[name="description"]')){if(el.closest('[data-l10n-raw]:not([data-l10n-raw="false"]),.arcdrake-collection-nav'))continue;let saved=attributes.get(el);if(!saved){saved={};attributes.set(el,saved);}for(const attr of ['aria-label','placeholder',...(el.matches('meta')?['content']:[])]){if(!el.hasAttribute(attr))continue;const value=el.getAttribute(attr);const old=saved[attr];const source=old&&value===old.output?old.source:value;const output=translate(source);saved[attr]={source,output};el.setAttribute(attr,output);}}document.documentElement.lang=language;for(const b of document.querySelectorAll('[data-app-language]'))b.setAttribute('aria-pressed',String(b.dataset.appLanguage===language));observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true});}
const observer=new MutationObserver(refresh);
function setLanguage(next,announce=false){if(!['de','en'].includes(next))return;language=next;try{localStorage.setItem(KEY,next);}catch{}try{const url=new URL(location.href);url.searchParams.set('lang',next);history.replaceState(history.state,'',url);}catch{}refresh();if(announce)window.dispatchEvent(new CustomEvent('arcdrake-language-change',{detail:{language:next}}));}
const control=document.createElement('nav');control.className='language-switch';control.setAttribute('aria-label','Language / Sprache');control.innerHTML='<button type="button" data-app-language="en" lang="en">English</button><button type="button" data-app-language="de" lang="de">Deutsch</button>';
document.querySelector('header').append(control);control.addEventListener('click',e=>{if(e.target.dataset.appLanguage)setLanguage(e.target.dataset.appLanguage,true);});
window.addEventListener('arcdrake-language-change',e=>setLanguage(e.detail?.language));
window.addEventListener('storage',e=>{if(e.key===KEY&&['de','en'].includes(e.newValue)&&e.newValue!==language)setLanguage(e.newValue,true);});
window.addEventListener('popstate',()=>{const next=new URL(location.href).searchParams.get('lang');if(['de','en'].includes(next)&&next!==language)setLanguage(next,true);});
refresh();

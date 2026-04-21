const { WebSocketServer } = require('ws');

const PORT = 3002;
const wss = new WebSocketServer({ port: PORT });

function nowIso() {
  return new Date().toISOString();
}

function sendJson(ws, message) {
  ws.send(JSON.stringify(message));
}

function createMessage(type, payload, from = 'system') {
  return {
    type,
    payload,
    from,
    timestamp: nowIso()
  };
}

function normalizeLang(lang) {
  const value = String(lang || 'es').toLowerCase();
  if (value === 'en' || value === 'fr') return value;
  return 'es';
}

function tr(lang, es, en, fr) {
  if (lang === 'en') return en;
  if (lang === 'fr') return fr;
  return es;
}

function getBotReply(text, lang) {
  const normalized = String(text || '').trim().toLowerCase();

  if (!normalized) {
    return tr(
      lang,
      'Escribe algo y te ayudo.',
      'Type something and I will help you.',
      'Ecris quelque chose et je t aide.'
    );
  }

  if (normalized === 'ping') {
    return 'pong';
  }

  if (normalized.includes('hola') || normalized.includes('hello') || normalized.includes('hi')) {
    return tr(
      lang,
      'Hola, soy Clippy XP. Escribe "ayuda" para ver opciones.',
      'Hi, I am Clippy XP. Type "help" to see options.',
      'Salut, je suis Clippy XP. Ecris "aide" pour voir les options.'
    );
  }

  if (normalized.includes('ayuda') || normalized.includes('help') || normalized.includes('aide') || normalized.includes('menu')) {
    return tr(
      lang,
      'Puedes preguntarme por: skills, proyectos web, proyectos moviles, contacto o cv.',
      'You can ask me about: skills, web projects, mobile projects, contact, or cv.',
      'Tu peux me demander: competences, projets web, projets mobiles, contact ou cv.'
    );
  }

  if (normalized.includes('skills') || normalized.includes('stack') || normalized.includes('tecnolog')) {
    return tr(
      lang,
      'Stack principal: Spring Boot, Java, SQL, Android, Git, Angular, Supabase, Flutter.',
      'Main stack: Spring Boot, Java, SQL, Android, Git, Angular, Supabase, Flutter.',
      'Stack principal: Spring Boot, Java, SQL, Android, Git, Angular, Supabase, Flutter.'
    );
  }

  if (normalized.includes('proyectos web') || normalized.includes('web projects') || normalized.includes('frontend')) {
    return tr(
      lang,
      'Tengo varios proyectos web. Puedes acceder a ellos desde Internet Explorer.',
      'I have several web projects. You can access them from Internet Explorer.',
      'J ai plusieurs projets web. Tu peux les consulter depuis Internet Explorer.'
    );
  }

  if (normalized.includes('movil') || normalized.includes('móvil') || normalized.includes('mobile') || normalized.includes('android')) {
    return tr(
      lang,
      'Tambien tengo proyectos moviles en Android que puedes consultar desde el visor de fotos.',
      'I also have mobile projects on Android that you can view from the photo viewer.',
      'J ai aussi des projets mobiles Android que tu peux consulter depuis le visionneur de photos.'
    );
  }

  if (normalized.includes('contacto') || normalized.includes('contact') || normalized.includes('github') || normalized.includes('linkedin')) {
    return tr(
      lang,
      'Contacto: GitHub: github.com/aperezm1 y Email: adrianperez936@gmail.com',
      'Contact: GitHub: github.com/aperezm1 and Email: adrianperez936@gmail.com',
      'Contact: GitHub: github.com/aperezm1 et Email: adrianperez936@gmail.com'
    );
  }

  if (normalized.includes('cv') || normalized.includes('curriculum') || normalized.includes('resume')) {
    return tr(
      lang,
      'Puedes descargar mi CV desde la app Mi PC.',
      'You can download my CV from the My PC app.',
      'Tu peux telecharger mon CV depuis l app My PC.'
    );
  }

  return tr(
    lang,
    'No te entendi del todo. Prueba con: ayuda, skills, proyectos web, proyectos moviles, contacto o cv.',
    'I did not fully understand. Try: help, skills, web projects, mobile projects, contact, or cv.',
    'Je n ai pas bien compris. Essaie: aide, competences, projets web, projets mobiles, contact ou cv.'
  );
}

wss.on('connection', (ws, req) => {
  const reqUrl = new URL(req?.url || '/', 'ws://localhost');
  const lang = normalizeLang(reqUrl.searchParams.get('lang'));

  sendJson(ws, createMessage('status', { text: 'open' }));
  sendJson(
    ws,
    createMessage(
      'chat',
      {
        text: tr(
          lang,
          'Hola, soy Clippy XP. Escribe "ayuda" para ver opciones.',
          'Hi, I am Clippy XP. Type "help" to see options.',
          'Salut, je suis Clippy XP. Ecris "aide" pour voir les options.'
        )
      },
      'bot'
    )
  );

  ws.on('message', (raw) => {
    let incoming;
    try {
      incoming = JSON.parse(raw.toString());
    } catch {
      sendJson(ws, createMessage('notification', { text: 'JSON invalido' }));
      return;
    }

    const type = incoming?.type;
    const payload = incoming?.payload || {};
    const lang = normalizeLang(payload.lang);

    if (!type) {
      sendJson(ws, createMessage('notification', { text: 'Falta type' }));
      return;
    }

    if (type === 'ping') {
      sendJson(ws, createMessage('chat', { text: 'pong' }, 'bot'));
      return;
    }

    if (type === 'chat') {
      const userText = String(payload.text || '').trim();

      sendJson(ws, createMessage('chat', { text: userText }, 'user'));
      sendJson(ws, createMessage('chat', { text: getBotReply(userText, lang) }, 'bot'));
      return;
    }

    sendJson(ws, createMessage('notification', { text: 'Tipo no soportado' }));
  });
});

console.log('Clippy WS server running on ws://localhost:' + PORT);
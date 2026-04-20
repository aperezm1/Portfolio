import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { createClient } from '@supabase/supabase-js';

const PORT = Number(process.env.PORT || 8080);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const app = express();
app.use(cors({ origin: ALLOWED_ORIGIN }));
app.get('/health', (_req, res) => res.json({ ok: true }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGIN,
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling']
});

const rules = [
  { intent: 'help', patterns: [/ayuda|help|que puedes|opciones|menu/i] },
  { intent: 'skills', patterns: [/skills?|stack|tecnolog|tecnolog(i|í)as|herramientas/i] },
  { intent: 'projects_web', patterns: [/proyectos?\s*web|web projects?|internet explorer|frontend/i] },
  { intent: 'projects_mobile', patterns: [/movil|m(ó|o)vil|android|mobile/i] },
  { intent: 'contact', patterns: [/contacto|github|linkedin|redes/i] },
  { intent: 'cv', patterns: [/cv|curriculum|curr(i|í)culum|resume/i] },
  { intent: 'greeting', patterns: [/hola|hello|buenas|hi/i] }
];

function detectIntent(text) {
  let bestIntent = 'unknown';
  let bestScore = 0;
  for (const rule of rules) {
    let score = 0;
    for (const p of rule.patterns) {
      if (p.test(text)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestIntent = rule.intent;
    }
  }
  return bestIntent;
}

function list(items) {
  return items.map((x) => `- ${x}`).join('\n');
}

async function replyByIntent(intent, lang = 'es') {
  if (intent === 'greeting') {
    return lang === 'es'
      ? 'Hola, soy Clippy XP. Puedo responder sobre proyectos, skills, CV y contacto.'
      : 'Hi, I am Clippy XP. I can answer about projects, skills, CV and contact.';
  }

  if (intent === 'help') {
    return lang === 'es'
      ? 'Puedes preguntarme:\n- Skills\n- Proyectos web\n- Proyectos móviles\n- Contacto\n- CV'
      : 'You can ask me about:\n- Skills\n- Web projects\n- Mobile projects\n- Contact\n- CV';
  }

  if (intent === 'skills') {
    const { data, error } = await supabase.from('my_pc_skills').select('label,url').order('id');
    if (error) return 'No pude cargar las skills ahora mismo.';
    if (!data?.length) return 'No hay skills cargadas.';
    return `Stack principal:\n${list(data.map((s) => `${s.label} (${s.url})`))}`;
  }

  if (intent === 'projects_web') {
    const { data, error } = await supabase
      .from('explorer_projects')
      .select('id,status,deploy_url,repo_url,stack')
      .order('id');
    if (error) return 'No pude cargar los proyectos web.';
    if (!data?.length) return 'No hay proyectos web cargados.';
    return `Proyectos web:\n${list(
      data.map((p) => `${p.id} | ${p.status} | deploy: ${p.deploy_url} | repo: ${p.repo_url || 'N/A'}`)
    )}`;
  }

  if (intent === 'projects_mobile') {
    const { data, error } = await supabase
      .from('mobile_projects')
      .select('id,name,status,platform')
      .order('id');
    if (error) return 'No pude cargar los proyectos móviles.';
    if (!data?.length) return 'No hay proyectos móviles cargados.';
    return `Proyectos móviles:\n${list(
      data.map((p) => `${p.name} (${p.platform}) | ${p.status}`)
    )}`;
  }

  if (intent === 'contact') {
    return `Contacto:\n- GitHub: https://github.com/aperezm1\n- Email: adrianperez936@gmail.com`;
  }

  if (intent === 'cv') {
    return lang === 'es'
      ? 'Puedes descargar mi CV desde la app "Mi PC" en el escritorio: ábrela y haz clic en "Descargar CV".'
      : 'You can download my CV from the "My PC" app on the desktop: open it and click "Download CV".';
  }

  return lang === 'es'
    ? 'No te entendí del todo. Prueba con: "skills", "proyectos web", "proyectos móviles", "contacto" o "cv".'
    : 'I did not fully understand. Try: "skills", "web projects", "mobile projects", "contact" or "cv".';
}

io.on('connection', (socket) => {
  socket.emit('chat:bot_message', {
    text: 'Hola, soy Clippy XP. Escribe "ayuda" para ver opciones.',
    ts: Date.now()
  });

  socket.on('chat:user_message', async (payload) => {
    const text = String(payload?.text || '').trim();
    const lang = String(payload?.lang || 'es');
    if (!text) return;

    socket.emit('chat:bot_typing', { typing: true });

    try {
      const intent = detectIntent(text.toLowerCase());
      const answer = await replyByIntent(intent, lang);
      socket.emit('chat:bot_message', { text: answer, ts: Date.now() });
    } catch {
      socket.emit('chat:bot_message', {
        text: 'Error temporal. Intenta de nuevo en unos segundos.',
        ts: Date.now()
      });
    } finally {
      socket.emit('chat:bot_typing', { typing: false });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Clippy socket server running on :${PORT}`);
});
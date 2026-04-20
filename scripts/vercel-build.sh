set -eu

mkdir -p src/environments

: "${SUPABASE_URL:?Missing SUPABASE_URL}"
: "${SUPABASE_ANON_KEY:?Missing SUPABASE_ANON_KEY}"
: "${CHAT_SOCKET_URL:?Missing CHAT_SOCKET_URL}"

cat > src/environments/environment.ts <<EOF
export const environment = {
  production: true,
  supabase: {
    url: '${SUPABASE_URL}',
    anonKey: '${SUPABASE_ANON_KEY}'
  },
  chatSocketUrl: '${CHAT_SOCKET_URL}'
};
EOF

npm run build
set -eu

mkdir -p src/environments

: "${SUPABASE_URL:?Missing SUPABASE_URL}"
: "${SUPABASE_ANON_KEY:?Missing SUPABASE_ANON_KEY}"

cat > src/environments/environment.ts <<EOF
export const environment = {
  production: true,
  supabase: {
    url: '${SUPABASE_URL}',
    anonKey: '${SUPABASE_ANON_KEY}'
  }
};
EOF

npm run build
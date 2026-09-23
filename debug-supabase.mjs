import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Cargar variables de entorno manualmente desde .env
const env = fs.readFileSync('.env', 'utf-8');
for (let line of env.split('\n')) {
  line = line.trim();
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan variables de entorno: VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  console.log("=== INICIANDO DEBUG DE SUPABASE ===");
  console.log("1. Probando una consulta simple a 'profiles'...");
  
  try {
    // 1. Primero un select normal (debería funcionar)
    const { data: data1, error: error1 } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
      
    if (error1) {
      console.log("❌ Error en el SELECT inicial de 'profiles':", error1);
    } else {
      console.log("✅ SELECT de 'profiles' exitoso. Datos:", data1);
    }

    console.log("\n2. Probando si 'profiles' tiene 'activated_at'...");
    // 2. Intentar hacer select de activated_at
    const { data: data2, error: error2 } = await supabase
      .from('profiles')
      .select('activated_at')
      .limit(1);

    if (error2) {
      console.log("❌ Error al buscar 'activated_at' en 'profiles':", error2.message);
      console.log("Esto confirma que PostgREST/Supabase falla cuando se le pide esa columna.");
    } else {
      console.log("✅ 'activated_at' encontrado en 'profiles'. Datos:", data2);
    }

    console.log("\n3. Probando la consulta exacta de getCardStatus (que hace join con profiles)...");
    const { data: data3, error: error3 } = await supabase
      .from('cards')
      .select('*, profile:profiles(*)')
      .limit(1);

    if (error3) {
      console.log("❌ Error en getCardStatus (cards con profile:profiles(*)):");
      console.dir(error3, { depth: null });
      if (error3.message.includes('activated_at')) {
        console.log("\n⚠️ CONCLUSIÓN: El error de 'activated_at' ocurre al hacer el join select('*, profile:profiles(*)').");
        console.log("Esto significa que hay una vista o caché de esquema en Supabase que cree que profiles tiene 'activated_at', o que PostgREST está tratando de leer esa columna.");
      }
    } else {
      console.log("✅ SELECT cards con profile:profiles(*) exitoso.");
    }

  } catch (err) {
    console.error("Error inesperado en el script:", err);
  }
}

testSupabase();

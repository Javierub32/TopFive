// api/og-profile.js

export default async function handler(req, res) {
  // 1. Obtenemos el nombre de usuario de la URL (?username=...)
  const { username } = req.query;

  // 2. Textos e imágenes por defecto (por si falla o el usuario no tiene foto)
  let title = "TopFive";
  let description = "Descubre mis películas, series, libros, videojuegos y música favoritos en TopFive.";
  let image = "https://www.topfive5.me/icon.png";

  if (username) {
    try {
      // 3. Hacemos una petición rápida a Supabase para obtener el perfil
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/rest/v1/usuario?username=eq.${username}&select=username,description,avatar_url`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`
          }
        }
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const user = data[0];
        title = `Perfil de ${user.username} en TopFive`;
        description = user.description || description;
        image = user.avatar_url || image;
      }
    } catch (err) {
      console.error("Error obteniendo datos para Open Graph:", err);
    }
  }

  // 4. Obtenemos el HTML original de tu app (generado por Expo)
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  
  const indexRes = await fetch(`${protocol}://${host}/index.html`);
  let html = await indexRes.text();

  // 5. Creamos las etiquetas meta para WhatsApp, Twitter, Instagram...
  const metaTags = `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:type" content="profile" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
  `;

  // 6. Inyectamos las etiquetas justo antes de cerrar el </head>
  html = html.replace('</head>', `${metaTags}</head>`);

  // 7. Devolvemos el HTML modificado
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
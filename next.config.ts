import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sem cacheComponents: este site não tem dado dinâmico, e o recurso é
  // incompatível com `dynamicParams = false` — que é o que faz slug
  // inexistente responder 404 de verdade em vez de 200 com cara de erro.

  // A raiz não tem conteúdo próprio: o idioma é sempre o primeiro segmento.
  // Redirect em config em vez de middleware — não custa runtime por requisição.
  async redirects() {
    return [{ source: "/", destination: "/pt", permanent: false }];
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

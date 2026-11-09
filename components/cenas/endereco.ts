/**
 * O endereço que leva um caso para a prancha dele. Módulo comum, sem "use client":
 * a página (servidor) e as cenas (cliente) montam o mesmo link.
 */
export const PREFIXO_SISTEMA = "construi-";

export function hashDoSistema(slug: string) {
  return `#${PREFIXO_SISTEMA}${slug}`;
}

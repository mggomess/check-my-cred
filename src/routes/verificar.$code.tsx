import { createFileRoute } from "@tanstack/react-router";
import { ConsultaCertificado } from "@/components/ConsultaCertificado";

export const Route = createFileRoute("/verificar/$code")({
  head: () => ({
    meta: [
      { title: "Verificação de Documento — Consulta Pública" },
      {
        name: "description",
        content: "Verificação de autenticidade de certificados e históricos por QR Code.",
      },
      { property: "og:title", content: "Verificação de Documento" },
      {
        property: "og:description",
        content: "Verificação de autenticidade de certificados e históricos por QR Code.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <ConsultaCertificado codigo={Route.useParams().code} />,
});

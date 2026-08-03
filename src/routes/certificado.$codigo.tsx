import { createFileRoute } from "@tanstack/react-router";
import { ConsultaCertificado } from "@/components/ConsultaCertificado";

export const Route = createFileRoute("/certificado/$codigo")({
  head: () => ({
    meta: [
      { title: "Consulta Pública de Certificados" },
      {
        name: "description",
        content:
          "Consulte a autenticidade de certificados emitidos pelo Sistema Integrado de Educação.",
      },
      { property: "og:title", content: "Consulta Pública de Certificados" },
      {
        property: "og:description",
        content: "Verifique a autenticidade de um certificado pelo código ou QR Code.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <ConsultaCertificado codigo={Route.useParams().codigo} />,
});

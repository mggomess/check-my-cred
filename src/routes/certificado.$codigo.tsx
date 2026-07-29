import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { CertificadoCard, type Certificado } from "@/components/CertificadoCard";
import { CertificadoNaoEncontrado } from "@/components/CertificadoNaoEncontrado";

export const Route = createFileRoute("/certificado/$codigo")({
  head: () => ({
    meta: [
      { title: "Consulta Pública de Certificados" },
      {
        name: "description",
        content:
          "Consulte a autenticidade de certificados emitidos pelo Sistema Integrado de Educação.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConsultaPage,
});

function ConsultaPage() {
  const { codigo } = Route.useParams();
  const [loading, setLoading] = useState(true);
  const [cert, setCert] = useState<Certificado | null>(null);

  useEffect(() => {
  let alive = true;

  async function buscarCertificado() {
    setLoading(true);

    const { data, error } = await supabase
      .from("certificados")
      .select(
        "codigo,nome,cpf,curso,nivel,ano_conclusao,instituicao,estado,cidade,registro,data_emissao,ativo",
      )
      .eq("codigo", codigo)
      .maybeSingle();

    if (!alive) return;

    if (error) {
      console.error("Erro ao consultar certificado:", error);
      setCert(null);
      setLoading(false);
      return;
    }

    if (!data) {
      setCert(null);
      setLoading(false);
      return;
    }

    setCert({
      ...data,
      data_nascimento: "",
      endereco: "",
    } as Certificado);

    setLoading(false);
  }

  buscarCertificado();

  return () => {
    alive = false;
  };
}, [codigo]);
  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Header />
      <main className="px-4 py-8 sm:py-10">
        {loading ? (
          <div className="mx-auto max-w-5xl rounded-xl bg-white p-10 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
            Consultando certificado...
          </div>
        ) : cert ? (
          <CertificadoCard cert={cert} />
        ) : (
          <CertificadoNaoEncontrado codigo={codigo} />
        )}

        <p className="mx-auto mt-6 max-w-5xl text-center text-xs text-slate-500">
          Documento gerado pelo Sistema Integrado de Educação · MEC · FNDE · GOV.BR
        </p>
      </main>
    </div>
  );
}

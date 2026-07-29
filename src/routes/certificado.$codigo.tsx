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
    setCert(null);

    // 1. Primeiro procura na tabela nova.
    const { data: novo, error: erroNovo } = await supabase
      .from("certificates")
      .select(`
        code,
        estado,
        issued_at,
        status,
        students (
          full_name,
          cpf
        ),
        courses (
          name,
          workload
        ),
        institutions (
          name,
          city,
          address
        )
      `)
      .eq("code", codigo)
      .maybeSingle();

    if (!alive) return;

    if (erroNovo) {
      console.error("Erro ao consultar certificates:", erroNovo);
    }

    if (novo) {
      const aluno = novo.students as {
        full_name: string;
        cpf: string | null;
      } | null;

      const curso = novo.courses as {
        name: string;
        workload: number;
      } | null;

      const instituicao = novo.institutions as {
        name: string;
        city: string | null;
        address: string | null;
      } | null;

      setCert({
        codigo: novo.code,
        nome: aluno?.full_name ?? "",
        cpf: aluno?.cpf ?? "",
        data_nascimento: "",
        curso: curso?.name ?? "",
        nivel: novo.type === "superior" ? "Ensino Superior" : "Curso Livre",
        ano_conclusao: new Date(novo.issued_at).getFullYear(),
        instituicao: instituicao?.name ?? "Instituição de Ensino",
        estado: novo.estado ?? "",
        cidade: instituicao?.city ?? "",
        endereco: instituicao?.address ?? "",
        registro: novo.code,
        data_emissao: novo.issued_at,
        ativo: novo.status !== "cancelado",
      } as Certificado);

      setLoading(false);
      return;
    }

    // 2. Caso não encontre, procura na tabela antiga.
    const { data: antigo, error: erroAntigo } = await supabase
      .from("certificados")
      .select(
        "codigo,nome,cpf,data_nascimento,curso,ano_conclusao,instituicao,estado,cidade,endereco,registro,data_emissao,ativo",
      )
      .eq("codigo", codigo)
      .maybeSingle();

    if (!alive) return;

    if (erroAntigo) {
      console.error("Erro ao consultar certificados:", erroAntigo);
      setCert(null);
      setLoading(false);
      return;
    }

    if (antigo) {
      setCert({
        ...antigo,
        nivel: "Certificado",
      } as Certificado);
    } else {
      setCert(null);
    }

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

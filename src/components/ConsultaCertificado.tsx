import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Header } from "@/components/Header";
import { CertificadoCard, type Certificado } from "@/components/CertificadoCard";
import { CertificadoNaoEncontrado } from "@/components/CertificadoNaoEncontrado";
import { consultarCertificado } from "@/lib/consulta.functions";

const CODIGO_RE = /^[A-Za-z0-9._/-]{4,120}$/;

function Aviso({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <section className="mx-auto max-w-xl rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
      <h1 className="text-lg font-semibold text-slate-800">{titulo}</h1>
      <p className="mt-2 text-sm text-slate-600">{texto}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        Tentar novamente
      </button>
    </section>
  );
}

export function ConsultaCertificado({ codigo }: { codigo: string }) {
  const consultar = useServerFn(consultarCertificado);
  const codigoValido = CODIGO_RE.test(codigo.trim());

  const { data, isLoading, isError } = useQuery({
    queryKey: ["certificado", codigo],
    enabled: codigoValido,
    retry: false,
    queryFn: () => consultar({ data: { codigo } }),
  });

  const cert = (data?.certificado ?? null) as Certificado | null;

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Header />
      <main className="px-4 py-8 sm:py-10">
        {!codigoValido ? (
          <Aviso
            titulo="Código inválido"
            texto="O código informado no endereço não está em um formato válido. Confira o QR Code ou o código impresso no certificado."
          />
        ) : isLoading ? (
          <div className="mx-auto max-w-5xl rounded-xl bg-white p-10 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
            Consultando certificado...
          </div>
        ) : isError || data?.status === "erro" ? (
          <Aviso
            titulo="Falha na consulta"
            texto="Não foi possível consultar o sistema emissor no momento. Tente novamente em alguns instantes."
          />
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

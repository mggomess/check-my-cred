import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Header } from "@/components/Header";
import { CertificadoCard, type Certificado } from "@/components/CertificadoCard";
import { CertificadoNaoEncontrado } from "@/components/CertificadoNaoEncontrado";
import { consultarCertificado } from "@/lib/consulta.functions";

export function ConsultaCertificado({ codigo }: { codigo: string }) {
  const consultar = useServerFn(consultarCertificado);

  const { data, isLoading } = useQuery({
    queryKey: ["certificado", codigo],
    queryFn: async () => (await consultar({ data: { codigo } })) as Certificado | null,
  });

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Header />
      <main className="px-4 py-8 sm:py-10">
        {isLoading ? (
          <div className="mx-auto max-w-5xl rounded-xl bg-white p-10 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
            Consultando certificado...
          </div>
        ) : data ? (
          <CertificadoCard cert={data} />
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

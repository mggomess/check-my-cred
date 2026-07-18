import { ArrowLeft, Printer, CheckCircle2, XCircle } from "lucide-react";

export interface Certificado {
  codigo: string;
  nome: string;
  cpf: string;
  data_nascimento: string;
  curso: string;
  nivel: string;
  ano_conclusao: number;
  instituicao: string;
  estado: string;
  cidade: string;
  endereco: string;
  registro: string;
  data_emissao: string;
  ativo: boolean;
}

function formatDate(iso: string) {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function Field({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border-b border-slate-100 py-2 last:border-b-0">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium text-slate-800">{value || "-"}</dd>
    </div>
  );
}

export function CertificadoCard({ cert }: { cert: Certificado }) {
  const consultadoEm = new Date().toLocaleString("pt-BR", {
    dateStyle: "long",
    timeStyle: "medium",
  });

  return (
    <section className="mx-auto max-w-5xl overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 print:shadow-none print:ring-0">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Certificado
          </p>
          <p className="font-mono text-base font-semibold text-slate-800">
            {cert.codigo}
          </p>
        </div>
        {cert.ativo ? (
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Certificado Válido
          </span>
        ) : (
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">
            <XCircle className="h-4 w-4" />
            Certificado Cancelado
          </span>
        )}
      </div>

      <div className="grid gap-8 px-6 py-6 md:grid-cols-2">
        <div>
          <h2 className="mb-3 border-b-2 border-[#0a3d91] pb-2 text-sm font-semibold uppercase tracking-wide text-[#0a3d91]">
            Dados do Aluno
          </h2>
          <dl>
            <Field label="Nome" value={cert.nome} />
            <Field label="CPF" value={cert.cpf} />
            <Field label="Data de nascimento" value={formatDate(cert.data_nascimento)} />
            <Field label="Curso" value={cert.curso} />
            <Field label="Nível de ensino" value={cert.nivel} />
            <Field label="Ano de conclusão" value={cert.ano_conclusao} />
            <Field
              label="Situação"
              value={cert.ativo ? "Regular" : "Cancelado"}
            />
          </dl>
        </div>

        <div>
          <h2 className="mb-3 border-b-2 border-[#0a3d91] pb-2 text-sm font-semibold uppercase tracking-wide text-[#0a3d91]">
            Dados da Instituição
          </h2>
          <dl>
            <Field label="Instituição" value={cert.instituicao} />
            <Field label="Estado" value={cert.estado} />
            <Field label="Cidade" value={cert.cidade} />
            <Field label="Endereço" value={cert.endereco} />
            <Field label="Registro" value={cert.registro} />
            <Field label="Data de emissão" value={formatDate(cert.data_emissao)} />
          </dl>
        </div>
      </div>

      <hr className="mx-6 border-slate-200" />

      <div className="px-6 py-5 text-sm text-slate-700">
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Código do Certificado
            </p>
            <p className="font-mono text-sm font-semibold text-slate-800">
              {cert.codigo}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Data e Hora da Consulta
            </p>
            <p className="text-sm font-medium text-slate-800">{consultadoEm}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50/60 px-6 py-4 sm:flex-row sm:justify-end print:hidden">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0a3d91] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#082f70]"
        >
          <Printer className="h-4 w-4" />
          Imprimir
        </button>
      </div>
    </section>
  );
}
